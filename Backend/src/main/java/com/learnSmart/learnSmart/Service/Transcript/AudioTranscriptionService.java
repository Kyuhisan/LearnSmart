package com.learnSmart.learnSmart.Service.Transcript;

import com.learnSmart.learnSmart.Service.SupaBaseConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AudioTranscriptionService {

    @Value("${OPENAI_API_KEY}")
    private String openaiApiKey;

    private final SupaBaseConnectionService connectionService;


    @SuppressWarnings({"unchecked", "rawtypes"})
    public String transcribeAudio(Path tmpFile) throws IOException {
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

        Map<String, Object> responseBody = response.getBody();

        if (responseBody == null || !responseBody.containsKey("text")) {
            throw new IOException("Invalid transcription response");
        }

        return (String) responseBody.get("text");
    }


    public String extractFromAudio(String fileURL) throws IOException {
        Path tmpFile = connectionService.downloadFile(fileURL, "audio-");

        try {
            return transcribeAudio(tmpFile);
        } finally {
            Files.deleteIfExists(tmpFile);
            Files.deleteIfExists(tmpFile.getParent());
        }
    }
}
