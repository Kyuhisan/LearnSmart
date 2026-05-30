package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.Obvestilo.ObvestiloResponseDTO;
import com.learnSmart.learnSmart.Service.ObvestiloService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ObvestiloControllerTest {

    @Mock private ObvestiloService obvestiloService;
    @Mock private Jwt jwt;

    @InjectMocks
    private ObvestiloController obvestiloController;

    private UUID userId;
    private UUID obvestiloId;
    private ObvestiloResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        obvestiloId = UUID.randomUUID();

        responseDTO = new ObvestiloResponseDTO();
        responseDTO.setId(obvestiloId);
        responseDTO.setTip("QUIZ");
        responseDTO.setNaslov("Test notification");
        responseDTO.setJePrebrano(false);
    }

    @Test
    void getMoja_returnsNotifications() {
        when(jwt.getSubject()).thenReturn(userId.toString());
        when(obvestiloService.getMoja(userId)).thenReturn(List.of(responseDTO));

        ResponseEntity<List<ObvestiloResponseDTO>> response = obvestiloController.getMoja(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getMoja_returnsEmptyList() {
        when(jwt.getSubject()).thenReturn(userId.toString());
        when(obvestiloService.getMoja(userId)).thenReturn(List.of());

        ResponseEntity<List<ObvestiloResponseDTO>> response = obvestiloController.getMoja(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void getStevilo_returnsCount() {
        when(jwt.getSubject()).thenReturn(userId.toString());
        when(obvestiloService.getNeprebranaStevilo(userId)).thenReturn(5L);

        ResponseEntity<Long> response = obvestiloController.getStevilo(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(5L, response.getBody());
    }

    @Test
    void getStevilo_returnsZero() {
        when(jwt.getSubject()).thenReturn(userId.toString());
        when(obvestiloService.getNeprebranaStevilo(userId)).thenReturn(0L);

        ResponseEntity<Long> response = obvestiloController.getStevilo(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(0L, response.getBody());
    }

    @Test
    void oznaciPrebrano_returns200() {
        ResponseEntity<?> response = obvestiloController.oznaciPrebrano(obvestiloId, jwt);

        assertEquals(200, response.getStatusCode().value());
        verify(obvestiloService, times(1)).oznaciPrebrano(obvestiloId);
    }

    @Test
    void oznaciVsePrebrano_returns200() {
        when(jwt.getSubject()).thenReturn(userId.toString());

        ResponseEntity<?> response = obvestiloController.oznaciVsePrebrano(jwt);

        assertEquals(200, response.getStatusCode().value());
        verify(obvestiloService, times(1)).oznaciVsePrebrano(userId);
    }
}