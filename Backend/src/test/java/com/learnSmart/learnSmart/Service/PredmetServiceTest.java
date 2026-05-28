package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Predmet.PredmetRequestDTO;
import com.learnSmart.learnSmart.DTO.Predmet.PredmetResponseDTO;
import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Model.Profil;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
import com.learnSmart.learnSmart.Repository.ProfilRepository;
import com.learnSmart.learnSmart.Repository.VpisRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PredmetServiceTest {

    @Mock
    private PredmetRepository predmetRepository;

    @Mock
    private ProfilRepository profilRepository;

    @Mock
    private VpisRepository vpisRepository;

    @InjectMocks
    private PredmetService predmetService;

    private UUID uciteljId;
    private UUID predmetId;
    private Predmet predmet;
    private Profil profil;

    @BeforeEach
    void setUp() {
        uciteljId = UUID.randomUUID();
        predmetId = UUID.randomUUID();

        profil = new Profil();
        profil.setId(uciteljId);
        profil.setImePriimek("Test Teacher");
        profil.setVloga("ucitelj");

        predmet = new Predmet();
        predmet.setId(predmetId);
        predmet.setNaziv("Mathematics");
        predmet.setOpis("Description");
        predmet.setKodaVpisa("MAT-001");
        predmet.setJeObjavljen(true);
        predmet.setTezavnost(3);
        predmet.setUciteljId(uciteljId);
    }

    @Test
    void getPublished_returnsPublishedModules() {
        when(predmetRepository.findAll()).thenReturn(List.of(predmet));
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));
        when(vpisRepository.countByPredmetIdAndJeAktivenTrue(any())).thenReturn(0L);

        List<PredmetResponseDTO> result = predmetService.getObjavljene();

        assertEquals(1, result.size());
        assertEquals("Mathematics", result.get(0).getNaziv());
    }

    @Test
    void getPublished_skipsUnpublishedModules() {
        predmet.setJeObjavljen(false);
        when(predmetRepository.findAll()).thenReturn(List.of(predmet));

        List<PredmetResponseDTO> result = predmetService.getObjavljene();

        assertEquals(0, result.size());
    }

    @Test
    void getById_returnsModule() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));
        when(vpisRepository.countByPredmetIdAndJeAktivenTrue(any())).thenReturn(0L);

        PredmetResponseDTO result = predmetService.getById(predmetId);

        assertEquals("Mathematics", result.getNaziv());
    }

    @Test
    void getById_throwsWhenNotFound() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> predmetService.getById(predmetId));
    }

    @Test
    void create_savesModule() {
        PredmetRequestDTO dto = new PredmetRequestDTO();
        dto.setNaziv("Physics");
        dto.setOpis("Physics description");
        dto.setKodaVpisa("PHY-001");
        dto.setTezavnost(4);

        Predmet saved = new Predmet();
        saved.setId(UUID.randomUUID());
        saved.setNaziv("Physics");
        saved.setUciteljId(uciteljId);

        when(predmetRepository.save(any())).thenReturn(saved);
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));
        when(vpisRepository.countByPredmetIdAndJeAktivenTrue(any())).thenReturn(0L);

        PredmetResponseDTO result = predmetService.ustvari(dto, uciteljId);

        assertEquals("Physics", result.getNaziv());
        verify(predmetRepository, times(1)).save(any());
    }

    @Test
    void update_updatesModule() {
        PredmetRequestDTO dto = new PredmetRequestDTO();
        dto.setNaziv("Mathematics 2");
        dto.setOpis("New description");
        dto.setKodaVpisa("MAT-002");
        dto.setTezavnost(2);

        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));
        when(predmetRepository.save(any())).thenReturn(predmet);
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));
        when(vpisRepository.countByPredmetIdAndJeAktivenTrue(any())).thenReturn(0L);

        PredmetResponseDTO result = predmetService.uredi(predmetId, dto, uciteljId);

        assertNotNull(result);
        verify(predmetRepository, times(1)).save(any());
    }

    @Test
    void update_throwsWhenWrongOwner() {
        PredmetRequestDTO dto = new PredmetRequestDTO();
        dto.setNaziv("Test");
        dto.setKodaVpisa("TST-001");

        UUID otherTeacher = UUID.randomUUID();
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));

        assertThrows(RuntimeException.class, () -> predmetService.uredi(predmetId, dto, otherTeacher));
    }

    @Test
    void update_throwsWhenNotFound() {
        PredmetRequestDTO dto = new PredmetRequestDTO();
        dto.setNaziv("Test");
        dto.setKodaVpisa("TST-001");

        when(predmetRepository.findById(predmetId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> predmetService.uredi(predmetId, dto, uciteljId));
    }

    @Test
    void delete_deletesModule() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));

        predmetService.izbrisi(predmetId, uciteljId);

        verify(predmetRepository, times(1)).delete(predmet);
    }

    @Test
    void delete_throwsWhenWrongOwner() {
        UUID otherTeacher = UUID.randomUUID();
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));

        assertThrows(RuntimeException.class, () -> predmetService.izbrisi(predmetId, otherTeacher));
    }

    @Test
    void delete_throwsWhenNotFound() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> predmetService.izbrisi(predmetId, uciteljId));
    }

    @Test
    void publish_setsPublished() {
        predmet.setJeObjavljen(false);
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));
        when(predmetRepository.save(any())).thenReturn(predmet);
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));
        when(vpisRepository.countByPredmetIdAndJeAktivenTrue(any())).thenReturn(0L);

        PredmetResponseDTO result = predmetService.objavi(predmetId, uciteljId);

        assertNotNull(result);
        verify(predmetRepository, times(1)).save(any());
    }

    @Test
    void publish_throwsWhenWrongOwner() {
        UUID otherTeacher = UUID.randomUUID();
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));

        assertThrows(RuntimeException.class, () -> predmetService.objavi(predmetId, otherTeacher));
    }

    @Test
    void publish_throwsWhenNotFound() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> predmetService.objavi(predmetId, uciteljId));
    }

    @Test
    void getMyModules_returnsTeacherModules() {
        when(predmetRepository.findAll()).thenReturn(List.of(predmet));
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(profil));
        when(vpisRepository.countByPredmetIdAndJeAktivenTrue(any())).thenReturn(0L);

        List<PredmetResponseDTO> result = predmetService.getMoji(uciteljId);

        assertEquals(1, result.size());
    }

    @Test
    void getMyModules_returnsEmptyListForNewTeacher() {
        UUID newTeacher = UUID.randomUUID();
        when(predmetRepository.findAll()).thenReturn(List.of(predmet));

        List<PredmetResponseDTO> result = predmetService.getMoji(newTeacher);

        assertEquals(0, result.size());
    }
}