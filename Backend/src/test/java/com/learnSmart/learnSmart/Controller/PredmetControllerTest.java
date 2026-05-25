package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.Predmet.PredmetRequestDTO;
import com.learnSmart.learnSmart.DTO.Predmet.PredmetResponseDTO;
import com.learnSmart.learnSmart.Model.Profil;
import com.learnSmart.learnSmart.Repository.ProfilRepository;
import com.learnSmart.learnSmart.Service.PredmetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PredmetControllerTest {

    @Mock
    private PredmetService predmetService;

    @Mock
    private ProfilRepository profilRepository;

    @Mock
    private Jwt jwt;

    @InjectMocks
    private PredmetController predmetController;

    private UUID uciteljId;
    private UUID predmetId;
    private Profil profil;
    private PredmetResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        uciteljId = UUID.randomUUID();
        predmetId = UUID.randomUUID();

        profil = new Profil();
        profil.setId(uciteljId);
        profil.setVloga("ucitelj");

        responseDTO = new PredmetResponseDTO();
        responseDTO.setId(predmetId);
        responseDTO.setNaziv("Mathematics");
    }

    @Test
    void getPublished_returnsModuleList() {
        when(predmetService.getObjavljene()).thenReturn(List.of(responseDTO));

        ResponseEntity<List<PredmetResponseDTO>> response = predmetController.getObjavljene();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getById_returnsModule() {
        when(predmetService.getById(predmetId)).thenReturn(responseDTO);

        ResponseEntity<PredmetResponseDTO> response = predmetController.getById(predmetId);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Mathematics", response.getBody().getNaziv());
    }

    @Test
    void getMyModules_returns403WithoutRole() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = predmetController.getMoji(jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    @Test
    void getMyModules_returnsTeacherModules() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));
        when(predmetService.getMoji(uciteljId)).thenReturn(List.of(responseDTO));

        ResponseEntity<?> response = predmetController.getMoji(jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void create_teacherCreatesModule() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        PredmetRequestDTO dto = new PredmetRequestDTO();
        dto.setNaziv("Physics");
        dto.setKodaVpisa("PHY-001");

        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));
        when(predmetService.ustvari(dto, uciteljId)).thenReturn(responseDTO);

        ResponseEntity<?> response = predmetController.ustvari(dto, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void create_studentGets403() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        profil.setVloga("ucenec");
        PredmetRequestDTO dto = new PredmetRequestDTO();

        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));

        ResponseEntity<?> response = predmetController.ustvari(dto, jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    @Test
    void delete_teacherDeletes() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));
        doNothing().when(predmetService).izbrisi(predmetId, uciteljId);

        ResponseEntity<?> response = predmetController.izbrisi(predmetId, jwt);

        assertEquals(204, response.getStatusCode().value());
    }

    @Test
    void delete_studentGets403() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        profil.setVloga("ucenec");

        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));

        ResponseEntity<?> response = predmetController.izbrisi(predmetId, jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    @Test
    void update_teacherUpdatesModule() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        PredmetRequestDTO dto = new PredmetRequestDTO();
        dto.setNaziv("Mathematics 2");
        dto.setKodaVpisa("MAT-002");

        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));
        when(predmetService.uredi(predmetId, dto, uciteljId)).thenReturn(responseDTO);

        ResponseEntity<?> response = predmetController.uredi(predmetId, dto, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void update_studentGets403() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        profil.setVloga("ucenec");
        PredmetRequestDTO dto = new PredmetRequestDTO();

        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));

        ResponseEntity<?> response = predmetController.uredi(predmetId, dto, jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    @Test
    void publish_teacherPublishes() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));
        when(predmetService.objavi(predmetId, uciteljId)).thenReturn(responseDTO);

        ResponseEntity<?> response = predmetController.objavi(predmetId, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void publish_studentGets403() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        profil.setVloga("ucenec");

        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));

        ResponseEntity<?> response = predmetController.objavi(predmetId, jwt);

        assertEquals(403, response.getStatusCode().value());
    }
}