package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.LearningStyleResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class GeminiServiceTest {

    @InjectMocks
    private GeminiService geminiService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(geminiService, "apiKey", "test-api-key");
    }

    @Test
    void classify_fallsBackToCountWhenGeminiUnavailable() {
        List<String> answers = List.of("visual", "visual", "reading", "kinesthetic");

        LearningStyleResponse result = geminiService.classify(answers);

        assertNotNull(result);
        assertEquals("visual", result.getLearningStyle());
    }

    @Test
    void classify_returnsCorrectDominantStyle() {
        List<String> answers = List.of("kinesthetic", "kinesthetic", "kinesthetic", "visual");

        LearningStyleResponse result = geminiService.classify(answers);

        assertNotNull(result);
        assertEquals("kinesthetic", result.getLearningStyle());
    }

    @Test
    void classify_handlesEmptyAnswers() {
        List<String> answers = List.of();

        LearningStyleResponse result = geminiService.classify(answers);

        assertNotNull(result);
    }

    @Test
    void extractText_returnsTextFromValidBody() {
        Map<String, Object> body = Map.of(
                "candidates", List.of(
                        Map.of("content", Map.of(
                                "parts", List.of(
                                        Map.of("text", "VISUAL")
                                )
                        ))
                )
        );

        String result = geminiService.extractText(body);

        assertEquals("VISUAL", result);
    }

    @Test
    void extractText_returnsUncategorizedOnInvalidBody() {
        String result = geminiService.extractText(Map.of());

        assertEquals("UNCATEGORIZED", result);
    }

    @Test
    void countFallback_returnsCorrectConfidence() {
        List<String> answers = List.of("visual", "visual", "visual", "reading");

        LearningStyleResponse result = geminiService.classify(answers);

        assertEquals("visual", result.getLearningStyle());
        assertTrue(result.getConfidence() > 0.5);
    }
}