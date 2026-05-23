package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.net.*;
import java.nio.file.*;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class TranscriptService {

    private final PredmetRepository predmetRepository;
    @Value("${SUPABASE_SERVICE_KEY}")
    private String supabaseServiceKey;

    @Value("${OPENAI_API_KEY}")
    private String openaiApiKey;

    private final IzvornaDatotekaRepository izvornaDatotekaRepository;
    private final StorageService storageService;

    public TranscriptService(IzvornaDatotekaRepository izvornaDatotekaRepository, StorageService storageService, PredmetRepository predmetRepository) {
        this.izvornaDatotekaRepository = izvornaDatotekaRepository;
        this.storageService = storageService;
        this.predmetRepository = predmetRepository;
    }


    //HTTP CONNECTION
    private HttpURLConnection createConnection(URL url) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("apikey", supabaseServiceKey);
        connection.setRequestProperty("Authorization", "Bearer " + supabaseServiceKey);
        return connection;
    }


    //GENERIC FILE DOWNLOAD
    private Path downloadFile(String fileURL, String prefix) throws IOException {
        URL url = new URL(fileURL);
        HttpURLConnection connection = createConnection(url);

        String extension = ".tmp";
        String path = url.getPath();
        int dotIndex = path.lastIndexOf('.');

        if (dotIndex != -1) {
            extension = path.substring(dotIndex);
        }

        Path tmpFile = Files.createTempFile(prefix, extension);

        try {
            Files.copy(
                    connection.getInputStream(),
                    tmpFile,
                    StandardCopyOption.REPLACE_EXISTING);

            return tmpFile;
        } finally {
            connection.disconnect();
        }
    }


    // PDF file
    private String extractFromPdf(String fileURL) throws IOException {
        URL url = new URL(fileURL);
        HttpURLConnection connection = createConnection(url);

        try (
                InputStream inputStream = connection.getInputStream();
                PDDocument pdDocument = Loader.loadPDF(inputStream.readAllBytes())
        ) {
            PDFTextStripper pdfTextStripper = new PDFTextStripper();
            String text = pdfTextStripper.getText(pdDocument);
            return text;
        } finally {
            connection.disconnect();
        }
    }


    // AUDIO files
    private String transcribeAudio(Path tmpFile) throws IOException {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(openaiApiKey);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(tmpFile.toFile()));
        body.add("model", "whisper-1");

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/audio/transcriptions",
                request,
                Map.class
        );

        Map responseBody = response.getBody();

        if (responseBody == null || !responseBody.containsKey("text")) {
            throw new IOException("Invalid transcription response");
        }

        return (String) responseBody.get("text");
    }


    private String extractFromAudio(String fileURL) throws IOException {
        Path tmpFile = downloadFile(fileURL, "audio-");

        try {
            return transcribeAudio(tmpFile);
        } finally {
            Files.deleteIfExists(tmpFile);
        }
    }


    // MP4
    private Path extractAudioFromVideo(Path tmpVideo) throws IOException, InterruptedException {
        Path tmpAudio = Files.createTempFile("audio-", ".mp3");

        ProcessBuilder processBuilder = new ProcessBuilder(
                "ffmpeg",
                "-y",
                "-i",
                tmpVideo.toString(),
                "-vn",
                "-acodec",
                "mp3",
                tmpAudio.toString()
        );
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;

        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IOException("FFmpeg audio extraction failed.");
        }
        return tmpAudio;
    }

    private void saveAudioFile(IzvornaDatoteka videoDatoteka, String audioUrl, Path tmpAudio) throws IOException {
        IzvornaDatoteka audioDatoteka = new IzvornaDatoteka();
        audioDatoteka.setPredmet(videoDatoteka.getPredmet());
        audioDatoteka.setImeDatoteke(tmpAudio.getFileName().toString());
        audioDatoteka.setUrl(audioUrl);
        audioDatoteka.setTip("AUDIO");
        audioDatoteka.setProcessingStatus("done");
        audioDatoteka.setUstvarjenOb(OffsetDateTime.now());
        audioDatoteka.setVelikostBytes(Files.size(tmpAudio));
        audioDatoteka.setGeneriranaIz(videoDatoteka);

        izvornaDatotekaRepository.save(audioDatoteka);
    }


    private String extractFromMp4(IzvornaDatoteka videoDatoteka) throws IOException {
        UUID predmetId = videoDatoteka.getPredmet().getId();
        Path tmpVideo = downloadFile(videoDatoteka.getUrl(), "video-");
        Path tmpAudio = null;

        try {
            tmpAudio = extractAudioFromVideo(tmpVideo);

            String audioUrl = storageService.uploadFile(tmpAudio, "audio/mpeg", predmetId);
            saveAudioFile(videoDatoteka, audioUrl, tmpAudio);
            return transcribeAudio(tmpAudio);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Video processing interrupted." ,e);

        } finally {
            Files.deleteIfExists(tmpVideo);

            if (tmpAudio != null) {
                Files.deleteIfExists(tmpAudio);
            }
        }
    }


    public String extractTranscript(IzvornaDatoteka datoteka) throws IOException {
        return switch (datoteka.getTip()) {
            case "PDF" -> extractFromPdf(datoteka.getUrl());
            case "AUDIO" -> extractFromAudio(datoteka.getUrl());
            case "VIDEO" -> extractFromMp4(datoteka);
            default -> throw new IOException("Unsupported file type.");
        };
    }


    private void updateCombinedTranscript(UUID predmetId) throws IOException {
        List<IzvornaDatoteka> doneDatoteka = izvornaDatotekaRepository.findByPredmetIdAndProcessingStatus(predmetId, "done");

        StringBuilder combined = new StringBuilder();
        for (IzvornaDatoteka datoteka : doneDatoteka) {
            if (datoteka.getManjsiTranscript() != null) {
                combined.append(datoteka.getManjsiTranscript());
                combined.append("\n");
            }
        }

        Predmet predmet = predmetRepository.findById(predmetId).orElseThrow(() -> new IllegalArgumentException("Predmet does not exist"));
        predmet.setZdruzenTranscript(combined.toString());
        predmetRepository.save(predmet);
    }


    @Async
    public void processTranscript(UUID izvornaDatotekaId, String fileURL, String tip) {
        try {
            IzvornaDatoteka datoteka = izvornaDatotekaRepository.findById(izvornaDatotekaId).orElseThrow(() -> new IllegalArgumentException("File does not exist"));
            String transcript = extractTranscript(datoteka);
            datoteka.setManjsiTranscript(transcript);
            datoteka.setProcessingStatus("done");

            izvornaDatotekaRepository.save(datoteka);

            updateCombinedTranscript(datoteka.getPredmet().getId());
        } catch(Exception e) {
            System.out.println("Transcript failed: " + e.getMessage());
            e.printStackTrace();

            izvornaDatotekaRepository.findById(izvornaDatotekaId).ifPresent(d -> {
                d.setProcessingStatus("failed");
                izvornaDatotekaRepository.save(d);
            });
        }
    }
}
