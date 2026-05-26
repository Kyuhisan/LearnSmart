package com.learnSmart.learnSmart.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@SuppressFBWarnings("VA_FORMAT_STRING_USES_NEWLINE")
@SuppressWarnings({"rawtypes", "unchecked"})
public class QuizGeminiService {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String apiKey;
    private final String openAiApiKey;
    private final RestTemplate restTemplate;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    public QuizGeminiService(GeminiService geminiService,
                             @Value("${gemini.api.key}") String apiKey,
                             @Value("${OPENAI_API_KEY}") String openAiApiKey) {
        this.geminiService = geminiService;
        this.apiKey = apiKey;
        this.openAiApiKey = openAiApiKey;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(120000);
        this.restTemplate = new RestTemplate(factory);
    }

    @SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
    public record GeneratedQuestion(
            String besediloVprasanja,
            List<String> moznosti,
            int indeksPravilnegaOdgovora,
            String razlaga
    ) {}

    public List<GeneratedQuestion> generirajVprasanja(
            String zdruzenTranscript,
            int steviloVprasanj,
            String tezavnost) {

        log.info("Generating {} questions, difficulty: {}", steviloVprasanj, tezavnost);

        String prompt = buildPrompt(steviloVprasanj, tezavnost, zdruzenTranscript);

        try {
            String rawJson = geminiService.extractText(
                    geminiService.callGeminiPublic(prompt, GEMINI_URL + apiKey).getBody()
            );
            return parseQuestions(rawJson);
        } catch (Exception e) {
            log.warn("Gemini failed: {}, trying OpenAI fallback...", e.getMessage());
        }

        try {
            return generateWithOpenAI(prompt);
        } catch (Exception e) {
            log.error("OpenAI also failed: {}", e.getMessage());
            return List.of();
        }
    }

    private List<GeneratedQuestion> generateWithOpenAI(String prompt) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        Map<String, Object> body = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
                OPENAI_URL,
                new HttpEntity<>(body, headers),
                Map.class
        );

        List choices = (List) response.getBody().get("choices");
        Map choice = (Map) choices.get(0);
        Map message = (Map) choice.get("message");
        String rawJson = (String) message.get("content");

        log.info("OpenAI fallback succeeded");
        return parseQuestions(rawJson);
    }

    private List<GeneratedQuestion> parseQuestions(String rawJson) throws Exception {
        String cleanJson = rawJson
                .replaceAll("```json", "")
                .replaceAll("```", "")
                .trim();

        List<Map> raw = objectMapper.readValue(cleanJson, List.class);
        List<GeneratedQuestion> result = new ArrayList<>();

        for (Map q : raw) {
            result.add(new GeneratedQuestion(
                    (String) q.get("besediloVprasanja"),
                    (List<String>) q.get("moznosti"),
                    (Integer) q.get("indeksPravilnegaOdgovora"),
                    (String) q.get("razlaga")
            ));
        }

        log.info("Successfully parsed {} questions", result.size());
        return result;
    }

    private String buildPrompt(int steviloVprasanj, String tezavnost, String zdruzenTranscript) {
        return """
                You are an educational quiz generator. Based on the transcript below, generate exactly %d multiple choice questions.
                Difficulty level: %s (EASY = basic recall, MEDIUM = understanding, HARD = analysis/application)
                
                Return ONLY a valid JSON array with no additional text, markdown, or code blocks.
                Each question must follow this exact format:
                
                [
                  {
                    "besediloVprasanja": "Question text here?",
                    "moznosti": ["Option A", "Option B", "Option C", "Option D"],
                    "indeksPravilnegaOdgovora": 0,
                    "razlaga": "Brief explanation of why this answer is correct"
                  }
                ]
                
                Rules:
                - Exactly 4 options per question
                - indeksPravilnegaOdgovora is 0-based index (0=A, 1=B, 2=C, 3=D)
                - Questions must be based strictly on the transcript content
                - No duplicate questions
                - razlaga should be 1 sentence
                
                Transcript:
                %s
                """.formatted(steviloVprasanj, tezavnost, zdruzenTranscript);
    }
}