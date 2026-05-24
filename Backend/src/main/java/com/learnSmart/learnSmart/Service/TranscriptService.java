package com.learnSmart.learnSmart.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Model.VsebinaPredmet;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
import com.learnSmart.learnSmart.Repository.VsebinaPredmetRepository;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.OffsetDateTime;
import java.util.*;

@Service
@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
public class TranscriptService {

    private final PredmetRepository predmetRepository;
    @Value("${SUPABASE_SERVICE_KEY}")
    private String supabaseServiceKey;

    @Value("${OPENAI_API_KEY}")
    private String openaiApiKey;

    @Value("${GOOGLE_TTS_API_KEY}")
    private String googleTTSApiKey;

    private final IzvornaDatotekaRepository izvornaDatotekaRepository;
    private final StorageService storageService;
    private final GeminiService geminiService;
    private final VsebinaPredmetRepository vsebinaPredmetRepository;

    public TranscriptService
            (
            IzvornaDatotekaRepository izvornaDatotekaRepository,
            StorageService storageService,
            PredmetRepository predmetRepository,
            GeminiService geminiService,
            VsebinaPredmetRepository vsebinaPredmetRepository
    ) {
        this.izvornaDatotekaRepository = izvornaDatotekaRepository;
        this.storageService = storageService;
        this.predmetRepository = predmetRepository;
        this.geminiService = geminiService;
        this.vsebinaPredmetRepository = vsebinaPredmetRepository;
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


        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IOException("FFmpeg audio extraction failed.");
        }
        return tmpAudio;
    }

    private void saveAudioFile(IzvornaDatoteka videoDatoteka, String audioUrl, Path tmpAudio) throws IOException {
        if (tmpAudio == null) {
            throw new IllegalStateException("Audio path invalid.");
        }

        Path fileNamePath = tmpAudio.getFileName();

        if (fileNamePath == null) {
            throw new IllegalStateException("Audio path invalid.");
        }

        IzvornaDatoteka audioDatoteka = new IzvornaDatoteka();
        audioDatoteka.setPredmet(videoDatoteka.getPredmet());
        audioDatoteka.setImeDatoteke(fileNamePath.toString());
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


    private void generateAndSaveAudio(UUID predmetId, String narationScript) throws IOException {
        RestTemplate restTemplate = new RestTemplate();

        if (narationScript.length() > 4500) {
            narationScript = narationScript.substring(0, 4500);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "input", Map.of("text", narationScript),
                "voice", Map.of("languageCode", "sl-SI", "name", "sl-SI-Chirp3-HD-Algenib", "ssmlGender", "MALE"),
                "audioConfig", Map.of("audioEncoding", "MP3")
        );

       String url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + googleTTSApiKey;

       ResponseEntity<String> response = restTemplate.postForEntity(
               url,
               new HttpEntity<>(body, headers),
               String.class
       );

       ObjectMapper mapper = new ObjectMapper();
       Map<String, Object> responseBody = mapper.readValue(response.getBody(), Map.class);
       String base64Audio = (String) responseBody.get("audioContent");
       byte[] audioBytes = Base64.getDecoder().decode(base64Audio);

       Path tmpAudio = Files.createTempFile("tts-", ".mp3");
       Files.write(tmpAudio, audioBytes);

       String audioUrl = storageService.uploadFile(tmpAudio, "audio/mpeg", predmetId);
       Files.deleteIfExists(tmpAudio);

       Predmet predmet = predmetRepository.findById(predmetId).orElseThrow(() -> new IllegalArgumentException("Predmet does not exist"));
       VsebinaPredmet vsebinaPredmet = new VsebinaPredmet();
        vsebinaPredmet.setPredmet(predmet);
        vsebinaPredmet.setUcniTip("audio");
        vsebinaPredmet.setVsebina(Map.of("audio_url", audioUrl));
        vsebinaPredmet.setPosodobljenOb(OffsetDateTime.now());
        vsebinaPredmetRepository.save(vsebinaPredmet);
    }


    private void saveContentPacks(UUID predmetId, String jsonResponse) {
        try {
            Predmet predmet = predmetRepository.findById(predmetId).orElseThrow(() -> new IllegalArgumentException("Predmet does not exist"));
            ObjectMapper mapper = new ObjectMapper();

            jsonResponse = jsonResponse.trim();
            if (jsonResponse.startsWith("```")) {
                jsonResponse = jsonResponse.replaceAll("^```(json)?\\s*", "").replaceAll("```\\s*$", "").trim();
            }

            Map<String, Object> contentPacks = mapper.readValue(jsonResponse, Map.class);

            List<String> ucniTip = List.of("branje", "kinestetično", "audio");

            vsebinaPredmetRepository.deleteByPredmetId(predmet.getId());

            for (String tip : ucniTip) {
                if (contentPacks.containsKey(tip)) {
                    VsebinaPredmet vsebinaPredmet = new VsebinaPredmet();
                    vsebinaPredmet.setPredmet(predmet);
                    vsebinaPredmet.setUcniTip(tip);
                    vsebinaPredmet.setVsebina((Map<String, Object>) contentPacks.get(tip));
                    vsebinaPredmet.setPosodobljenOb(OffsetDateTime.now());

                    vsebinaPredmetRepository.save(vsebinaPredmet);
                }
            }

            Map<String, Object> audioPack = (Map<String, Object>) contentPacks.get("audio");

            if (audioPack != null) {
                String narationScript = (String) audioPack.get("naracijski_skript");

                if (narationScript != null) {
                    try {
                        generateAndSaveAudio(predmetId, narationScript);
                    } catch (Exception e) {
                        System.out.println("Audio generation failed: " + e.getMessage());
                        e.printStackTrace();
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Content pack save failed: " + e.getMessage());
        }
    }


    @Async
    @Transactional
    public void processTranscript(UUID izvornaDatotekaId, String fileURL, String tip) {
        try {
            IzvornaDatoteka datoteka = izvornaDatotekaRepository.findById(izvornaDatotekaId).orElseThrow(() -> new IllegalArgumentException("File does not exist"));
            String transcript = extractTranscript(datoteka);
            datoteka.setManjsiTranscript(transcript);
            datoteka.setProcessingStatus("done");

            izvornaDatotekaRepository.save(datoteka);

            updateCombinedTranscript(datoteka.getPredmet().getId());

            long pendingCount = izvornaDatotekaRepository.countByPredmetIdAndProcessingStatusNot(datoteka.getPredmet().getId(), "done");

            if (pendingCount == 0) {
                Predmet predmet = predmetRepository.findById(datoteka.getPredmet().getId()).orElseThrow(() -> new IllegalArgumentException("Predmet does not exist"));
                String jsonResponse = geminiService.generateContentPacks(predmet.getZdruzenTranscript());

                if (jsonResponse != null) {
                    saveContentPacks(datoteka.getPredmet().getId(), jsonResponse);
                }
            }
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
