package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.Predmet.*;
import com.learnSmart.learnSmart.Service.VpisService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VpisControllerTest {

    @Mock private VpisService vpisService;
    @Mock private Jwt jwt;

    @InjectMocks
    private VpisController vpisController;

    private UUID ucenecId;
    private UUID uciteljId;
    private UUID predmetId;
    private VpisResponseDTO vpisResponseDTO;

    @BeforeEach
    void setUp() {
        ucenecId  = UUID.randomUUID();
        uciteljId = UUID.randomUUID();
        predmetId = UUID.randomUUID();

        vpisResponseDTO = new VpisResponseDTO();
        vpisResponseDTO.setId(UUID.randomUUID());
        vpisResponseDTO.setPredmetId(predmetId);
        vpisResponseDTO.setPredmetNaziv("Test Module");
    }

    // ── vpisZKodo ─────────────────────────────────────────────────────────────

    @Test
    void vpisZKodo_enrollsStudent() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        VpisRequestDTO dto = new VpisRequestDTO();
        dto.setKodaVpisa("ABC123");
        when(vpisService.vpisZKodo("ABC123", ucenecId)).thenReturn(vpisResponseDTO);

        ResponseEntity<?> response = vpisController.vpisZKodo(dto, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void vpisZKodo_throwsWhenInvalidCode() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        VpisRequestDTO dto = new VpisRequestDTO();
        dto.setKodaVpisa("WRONG");
        when(vpisService.vpisZKodo("WRONG", ucenecId))
                .thenThrow(new RuntimeException("Invalid enrollment code"));

        assertThrows(RuntimeException.class,
                () -> vpisController.vpisZKodo(dto, jwt));
    }

    // ── getMojiVpisi ──────────────────────────────────────────────────────────

    @Test
    void getMojiVpisi_returnsEnrollments() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(vpisService.getMojiVpisi(ucenecId)).thenReturn(List.of(vpisResponseDTO));

        ResponseEntity<List<VpisResponseDTO>> response = vpisController.getMojiVpisi(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getMojiVpisi_returnsEmptyList() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(vpisService.getMojiVpisi(ucenecId)).thenReturn(List.of());

        ResponseEntity<List<VpisResponseDTO>> response = vpisController.getMojiVpisi(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isEmpty());
    }

    // ── posodobiCas ───────────────────────────────────────────────────────────

    @Test
    void posodobiCas_updatesTime() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(vpisService.posodobiCas(predmetId, ucenecId, 120)).thenReturn(vpisResponseDTO);

        ResponseEntity<?> response = vpisController.posodobiCas(
                predmetId, Map.of("cas", 120), jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void posodobiCas_throwsWhenNotEnrolled() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(vpisService.posodobiCas(predmetId, ucenecId, 60))
                .thenThrow(new RuntimeException("Enrollment does not exist"));

        assertThrows(RuntimeException.class,
                () -> vpisController.posodobiCas(predmetId, Map.of("cas", 60), jwt));
    }

    // ── steviloVpisanih ───────────────────────────────────────────────────────

    @Test
    void steviloVpisanih_returnsCount() {
        when(vpisService.steviloVpisanih(predmetId)).thenReturn(5L);

        ResponseEntity<Long> response = vpisController.steviloVpisanih(predmetId);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(5L, response.getBody());
    }

    @Test
    void steviloVpisanih_returnsZero() {
        when(vpisService.steviloVpisanih(predmetId)).thenReturn(0L);

        ResponseEntity<Long> response = vpisController.steviloVpisanih(predmetId);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(0L, response.getBody());
    }

    // ── stilMix ───────────────────────────────────────────────────────────────

    @Test
    void stilMix_returnsStyleCounts() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        Map<String, Long> mix = Map.of("visual", 3L, "reading", 1L,
                "auditory", 0L, "kinesthetic", 2L, "_total", 6L);
        when(vpisService.getStilMixZaUcitelja(uciteljId)).thenReturn(mix);

        ResponseEntity<Map<String, Long>> response = vpisController.stilMix(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(6L, response.getBody().get("_total"));
    }

    @Test
    void stilMix_returnsEmptyWhenNoModules() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(vpisService.getStilMixZaUcitelja(uciteljId)).thenReturn(Map.of());

        ResponseEntity<Map<String, Long>> response = vpisController.stilMix(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isEmpty());
    }

    // ── studenti ──────────────────────────────────────────────────────────────

    @Test
    void studenti_returnsStudentList() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        StudentSummaryDTO student = new StudentSummaryDTO(
                ucenecId, "Test Student", "testuser",
                "test@test.com", "visual", 75, 1);
        when(vpisService.getStudentiZaUcitelja(uciteljId)).thenReturn(List.of(student));

        ResponseEntity<List<StudentSummaryDTO>> response = vpisController.studenti(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void studenti_returnsEmptyWhenNoStudents() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(vpisService.getStudentiZaUcitelja(uciteljId)).thenReturn(List.of());

        ResponseEntity<List<StudentSummaryDTO>> response = vpisController.studenti(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isEmpty());
    }

    // ── moduliStudenti ────────────────────────────────────────────────────────

    @Test
    void moduliStudenti_returnsGroupedStudents() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        ModuleStudentsDTO moduleStudents = new ModuleStudentsDTO(
                predmetId, "Test Module", List.of());
        when(vpisService.getStudentiPoModulihZaUcitelja(uciteljId))
                .thenReturn(List.of(moduleStudents));

        ResponseEntity<List<ModuleStudentsDTO>> response = vpisController.moduliStudenti(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void moduliStudenti_returnsEmptyWhenNoModules() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(vpisService.getStudentiPoModulihZaUcitelja(uciteljId)).thenReturn(List.of());

        ResponseEntity<List<ModuleStudentsDTO>> response = vpisController.moduliStudenti(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isEmpty());
    }

    // ── odjava ────────────────────────────────────────────────────────────────

    @Test
    void odjava_returnsNoContent() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        doNothing().when(vpisService).odjava(predmetId, ucenecId);

        ResponseEntity<?> response = vpisController.odjava(predmetId, jwt);

        assertEquals(204, response.getStatusCode().value());
    }

    @Test
    void odjava_throwsWhenNotEnrolled() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        doThrow(new RuntimeException("Enrollment does not exist"))
                .when(vpisService).odjava(predmetId, ucenecId);

        assertThrows(RuntimeException.class,
                () -> vpisController.odjava(predmetId, jwt));
    }
}