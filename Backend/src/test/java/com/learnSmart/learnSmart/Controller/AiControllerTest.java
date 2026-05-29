package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.LearningStyleResponse;
import com.learnSmart.learnSmart.Service.GeminiService;
import com.learnSmart.learnSmart.Service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiControllerTest {

    @Mock
    private GeminiService geminiService;

    @Mock
    private UserService userService;

    @Mock
    private Jwt jwt;

    @InjectMocks
    private AiController aiController;

    @Test
    void classifyStyle_returnsLearningStyle() {
        List<String> answers = List.of("visual", "visual", "reading");
        LearningStyleResponse mockResponse = new LearningStyleResponse("visual", 0.75);

        when(geminiService.classify(answers)).thenReturn(mockResponse);

        Map<String, List<String>> request = Map.of("answers", answers);
        ResponseEntity<LearningStyleResponse> response = aiController.classifyStyle(request, null);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("visual", response.getBody().getLearningStyle());
    }

    @Test
    void classifyStyle_persistsStyleWhenJwtPresent() {
        List<String> answers = List.of("kinesthetic", "kinesthetic");
        LearningStyleResponse mockResponse = new LearningStyleResponse("kinesthetic", 0.9);

        when(geminiService.classify(answers)).thenReturn(mockResponse);
        when(jwt.getSubject()).thenReturn("user-123");

        Map<String, List<String>> request = Map.of("answers", answers);
        aiController.classifyStyle(request, jwt);

        verify(userService, times(1)).updateLearningStyle("user-123", "kinesthetic", 0, 0, 0, 2);
    }

    @Test
    void classifyStyle_skipsPersistedWhenJwtNull() {
        List<String> answers = List.of("reading");
        LearningStyleResponse mockResponse = new LearningStyleResponse("reading", 0.8);

        when(geminiService.classify(answers)).thenReturn(mockResponse);

        Map<String, List<String>> request = Map.of("answers", answers);
        aiController.classifyStyle(request, null);

        verify(userService, never()).updateLearningStyle(any(), any(), anyInt(), anyInt(), anyInt(), anyInt());
    }

    @Test
    void classifyStyle_continuesWhenUserServiceFails() {
        List<String> answers = List.of("visual");
        LearningStyleResponse mockResponse = new LearningStyleResponse("visual", 0.8);

        when(geminiService.classify(answers)).thenReturn(mockResponse);
        when(jwt.getSubject()).thenReturn("user-123");
        doThrow(new RuntimeException("Supabase error"))
                .when(userService).updateLearningStyle(any(), any(), anyInt(), anyInt(), anyInt(), anyInt());

        Map<String, List<String>> request = Map.of("answers", answers);
        ResponseEntity<LearningStyleResponse> response = aiController.classifyStyle(request, jwt);

        assertEquals(200, response.getStatusCode().value());
    }
}