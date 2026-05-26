package com.learnSmart.learnSmart.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public QuizGeminiService(GeminiService geminiService,
                             @Value("${gemini.api.key}") String apiKey) {
        this.geminiService = geminiService;
        this.apiKey = apiKey;
    }

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

        String prompt = """
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

        try {
            String rawJson = geminiService.extractText(
                    geminiService.callGeminiPublic(prompt, GEMINI_URL + apiKey).getBody()
            );

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

            log.info("Successfully generated {} questions", result.size());
            return result;

        } catch (Exception e) {
            log.error("Failed to generate quiz questions: {}", e.getMessage());
            return List.of();
        }
    }
}