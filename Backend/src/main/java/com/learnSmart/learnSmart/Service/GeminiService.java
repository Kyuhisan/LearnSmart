package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.LearningStyleResponse;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
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
@SuppressFBWarnings("VA_FORMAT_STRING_USES_NEWLINE")
@SuppressWarnings("rawtypes")
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_CLASSIFY_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=";
    private static final String GEMINI_CONTENT_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";
    private final RestTemplate restTemplate = buildRestTemplate();

    public ResponseEntity<Map> callGeminiPublic(String prompt, String baseUrl) {
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return restTemplate.postForEntity(
                baseUrl,
                new HttpEntity<>(body, headers),
                Map.class
        );
    }

    public LearningStyleResponse classify(List<String> answers) {
        log.info("GeminiService classify answers: {}", answers.size());

        try {
            String prompt = "Based on these VARK questionnaire answers, classify the learning style. " +
                    "Reply ONLY with one of: VISUAL, AUDITORY, READING, KINESTHETIC. " +
                    "Answers: " + answers;

            String url = GEMINI_CLASSIFY_URL + apiKey;
            ResponseEntity<Map> response = callGeminiPublic(prompt, url);

            String result = extractText(response.getBody()).trim().toLowerCase();
            return new LearningStyleResponse(result, 0.87);

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
        return new RestTemplate(requestFactory);
    }

    public String generateContentPacks(String combinedTranscript) {
        try {
            String prompt = """
                                You are an educational content generator. Based on the provided transcript, generate learning content for 3 different learning styles.
                            
                                Return ONLY a valid JSON object with no additional text, markdown, or code blocks. The JSON must have exactly these 3 keys:
                            
                                {
                                  "branje": {
                                    "definicija": "A clear definition of the main topic",
                                    "povzetek": "A concise summary of the content",
                                    "strukturirane_opombe": ["key point 1", "key point 2", "key point 3"],
                                    "glosar": [
                                      {
                                        "izraz": "term",
                                        "definicija": "definition"
                                      }
                                    ],
                                    "kljucni_pojmi": ["concept 1", "concept 2"]
                                  },
                                  "kinestetično": {
                                    "vprasanja": [
                                      {
                                        "vprasanje": "question text",
                                        "moznosti": [
                                          "A) option",
                                          "B) option",
                                          "C) option",
                                          "D) option"
                                        ],
                                        "pravilen_odgovor": "A"
                                      }
                                    ]
                                  },
                                  "audio": {
                                    "naracijski_skript": "A natural spoken narrative of the entire content, written as if spoken aloud by a teacher. Should be comprehensive and cover all key points."
                                  }
                                }
                            
                                Generate between 10 and 15 multiple choice questions based on the transcript.
                                Each question must have exactly 4 options (A, B, C, D) and one correct answer.
                            
                                Transcript:
                                %s
                                """.formatted(combinedTranscript);

            String url = GEMINI_CONTENT_URL + apiKey;
            ResponseEntity<Map> response = callGeminiPublic(prompt, url);

            return extractText(response.getBody());

        } catch (Exception e) {
            log.warn("Gemini content generation failed: {}", e.getMessage());
            return null;
        }
    }
}