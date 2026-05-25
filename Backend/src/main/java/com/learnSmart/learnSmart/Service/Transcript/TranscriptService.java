package com.learnSmart.learnSmart.Service.Transcript;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Model.VsebinaPredmet;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
import com.learnSmart.learnSmart.Repository.VsebinaPredmetRepository;
import com.learnSmart.learnSmart.Service.GeminiService;
import com.learnSmart.learnSmart.Service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

import java.io.IOException;
import java.nio.file.*;
import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
public class TranscriptService {

    @Value("${GOOGLE_TTS_API_KEY}")
    private String googleTTSApiKey;

    private final PredmetRepository predmetRepository;
    private final IzvornaDatotekaRepository izvornaDatotekaRepository;
    private final StorageService storageService;
    private final VsebinaPredmetRepository vsebinaPredmetRepository;
    private final GeminiService geminiService;

    private final PdfTranscriptService pdfTranscriptService;
    private final AudioTranscriptionService audioTranscriptionService;
    private final VideoTranscriptionService videoTranscriptionService;


    public String extractTranscript(IzvornaDatoteka datoteka) throws IOException {
        return switch (datoteka.getTip()) {
            case "PDF" -> pdfTranscriptService.extractFromPdf(datoteka.getUrl());
            case "AUDIO" -> audioTranscriptionService.extractFromAudio(datoteka.getUrl());
            case "VIDEO" -> videoTranscriptionService.extractFromMp4(datoteka);
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
