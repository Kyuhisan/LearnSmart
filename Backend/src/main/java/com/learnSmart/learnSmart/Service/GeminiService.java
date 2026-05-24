package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.LearningStyleResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = buildRestTemplate();

    public LearningStyleResponse classify(List<String> answers) {
        log.info("GeminiService classify answers: {}", answers.size());

        try {
            String prompt = "Based on these VARK questionnaire answers, classify the learning style. " +
                    "Reply ONLY with one of: VISUAL, AUDITORY, READING, KINESTHETIC. " +
                    "Answers: " + answers;

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
            
            String result = extractText(response.getBody()).trim().toLowerCase();
            return new LearningStyleResponse(result, 0.87); // <---- confidence hardcoded for now, change later

        } catch (Exception e) {
            log.warn("Gemini unavailable, using count-based fallback: {}", e.getMessage());
            return countFallback(answers);
        }
    }

    private LearningStyleResponse countFallback(List<String> answers) {
        Map<String, Long> counts = answers.stream()
                .collect(Collectors.groupingBy(String::toLowerCase, Collectors.counting()));
        long total = answers.size();
        String dominant = counts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("visual");
        double confidence = total > 0
                ? (double) counts.getOrDefault(dominant, 0L) / total
                : 0.0;
        log.info("Count fallback result: {} (confidence: {})", dominant, confidence);
        return new LearningStyleResponse(dominant, confidence);
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

    private RestTemplate buildRestTemplate() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(10000);
        requestFactory.setReadTimeout(120000);
        requestFactory.setReadTimeout(120000);
        return new RestTemplate(requestFactory);
    }

    public String generateContentPacks(String combinedTranscript) {
        try {
            String prompt = "You are an educational content generator. Based on the provided transcript, generate learning content for 3 different learning styles.\n" +
                    "\n" +
                    "Return ONLY a valid JSON object with no additional text, markdown, or code blocks. The JSON must have exactly these 3 keys:\n" +
                    "\n" +
                    "{\n" +
                    "  \"branje\": {\n" +
                    "    \"definicija\": \"A clear definition of the main topic\",\n" +
                    "    \"povzetek\": \"A concise summary of the content\",\n" +
                    "    \"strukturirane_opombe\": [\"key point 1\", \"key point 2\", \"key point 3\"],\n" +
                    "    \"glosar\": [{\"izraz\": \"term\", \"definicija\": \"definition\"}],\n" +
                    "    \"kljucni_pojmi\": [\"concept 1\", \"concept 2\"]\n" +
                    "  },\n" +
                    "  \"kinestetično\": {\n" +
                    "    \"vprasanja\": [\n" +
                    "      Generate between 10 and 15 multiple choice questions based on the transcript.\n" +
                    "      Each question must have exactly 4 options (A, B, C, D) and one correct answer.\n" +
                    "      {\n" +
                    "        \"vprasanje\": \"question text\",\n" +
                    "        \"moznosti\": [\"A) option\", \"B) option\", \"C) option\", \"D) option\"],\n" +
                    "        \"pravilen_odgovor\": \"A\"\n" +
                    "      }\n" +
                    "    ]\n" +
                    "  },\n" +
                    "  \"audio\": {\n" +
                    "    \"naracijski_skript\": \"A natural spoken narrative of the entire content, written as if spoken aloud by a teacher. Should be comprehensive and cover all key points.\"\n" +
                    "  }\n" +
                    "}\n" +
                    "\n" +
                    "Transcript: " + combinedTranscript;

            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    url,
                    new HttpEntity<>(body, headers),
                    Map.class
            );

            return extractText(response.getBody());

        } catch (Exception e) {
            log.warn("Gemini content generation failed: {}", e.getMessage());
            return null;
        }
    }
}
