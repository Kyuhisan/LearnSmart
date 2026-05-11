package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.LearningStyleResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public LearningStyleResponse classify(List<String> answers) {
        try {
            String prompt = "Na podlagi teh odgovorov na VARK vprašalnik klasificiraj učni tip. " +
                    "Odgovori SAMO z enim od: VISUAL, AUDITORY, READING, KINESTHETIC. " +
                    "Odgovori: " + answers;

            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=" + apiKey;

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    url,
                    new HttpEntity<>(body, headers),
                    Map.class
            );
            
            String result = extractText(response.getBody());
            return new LearningStyleResponse(result.trim(), 0.87); // <---- confidence zaenkrat hardcoded

        } catch (Exception e) {
            System.err.println("Gemini API failed: " + e.getMessage());
            return new LearningStyleResponse("UNCATEGORIZED", 0.0);
        }
    }

    public String extractText(Map body) {
        try {
            var candidates = (List) body.get("candidates");
            var content = (Map) ((Map) candidates.get(0)).get("content");
            var parts = (List) (content.get("parts"));
            return (String) ((Map) parts.get(0)).get("text");
        } catch (Exception e) {
            return "UNCATEGORIZED";
        }
    }
}
