package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
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
import java.util.*;

@Service
public class TranscriptService {

    @Value("${SUPABASE_SERVICE_KEY}")
    private String supabaseServiceKey;

    @Value("${OPENAI_API_KEY}")
    private String openaiApiKey;

    private final IzvornaDatotekaRepository izvornaDatotekaRepository;

    public TranscriptService(IzvornaDatotekaRepository izvornaDatotekaRepository) {
        this.izvornaDatotekaRepository = izvornaDatotekaRepository;
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

        try {
            InputStream inputStream = connection.getInputStream();
            PDDocument pdDocument = Loader.loadPDF(inputStream.readAllBytes());
            PDFTextStripper pdfTextStripper = new PDFTextStripper();
            String text = pdfTextStripper.getText(pdDocument);
            pdDocument.close();
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
    private void extractFromMp4() {}


    public String extractTranscript(String fileURL, String tip) throws IOException {
        if (tip.equals("PDF")) {
            return extractFromPdf(fileURL);
        } else if (tip.equals("AUDIO")) {
            return extractFromAudio(fileURL);
        } else {
            throw new IllegalArgumentException("");
        }
    }

    @Async
    public void processTranscript(UUID izvornaDatotekaId, String fileURL, String tip) {
        try {
            String transcript = extractTranscript(fileURL, tip);

            IzvornaDatoteka datoteka = izvornaDatotekaRepository.findById(izvornaDatotekaId).orElseThrow(() -> new IllegalArgumentException("File does not exist"));
            datoteka.setManjsiTranscript(transcript);
            datoteka.setProcessingStatus("done");
            izvornaDatotekaRepository.save(datoteka);
        } catch(Exception e) {
            System.out.println("Transcipt failed: " + e.getMessage());
            e.printStackTrace();

            izvornaDatotekaRepository.findById(izvornaDatotekaId).ifPresent(d -> {
                d.setProcessingStatus("failed");
                izvornaDatotekaRepository.save(d);
            });
        }
    }
}
