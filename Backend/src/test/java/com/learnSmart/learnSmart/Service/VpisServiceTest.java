package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Predmet.VpisResponseDTO;
import com.learnSmart.learnSmart.Model.*;
import com.learnSmart.learnSmart.Repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VpisServiceTest {

    @Mock private VpisRepository vpisRepository;
    @Mock private PredmetRepository predmetRepository;
    @Mock private ProfilRepository profilRepository;
    @Mock private QuizRepository quizRepository;
    @Mock private QuizResultRepository quizResultRepository;
    @Mock private ObvestiloService obvestiloService;

    @InjectMocks
    private VpisService vpisService;

    private UUID ucenecId;
    private UUID uciteljId;
    private UUID predmetId;
    private Predmet predmet;
    private Vpis vpis;
    private Profil profil;

    @BeforeEach
    void setUp() {
        ucenecId  = UUID.randomUUID();
        uciteljId = UUID.randomUUID();
        predmetId = UUID.randomUUID();

        predmet = new Predmet();
        predmet.setId(predmetId);
        predmet.setNaziv("Test Module");
        predmet.setKodaVpisa("ABC123");
        predmet.setUciteljId(uciteljId);

        vpis = new Vpis();
        vpis.setId(UUID.randomUUID());
        vpis.setUcenecId(ucenecId);
        vpis.setPredmet(predmet);
        vpis.setJeAktiven(true);
        vpis.setVpisanOb(OffsetDateTime.now());
        vpis.setCasNaModulu(0);

        profil = new Profil();
        profil.setId(ucenecId);
        profil.setImePriimek("Test Student");
        profil.setUcniTip("visual");
    }

    // ── vpisZKodo ─────────────────────────────────────────────────────────────

    @Test
    void vpisZKodo_enrollsStudent() {
        when(predmetRepository.findByKodaVpisa("ABC123")).thenReturn(Optional.of(predmet));
        when(vpisRepository.existsByUcenecIdAndPredmetIdAndJeAktivenTrue(ucenecId, predmetId)).thenReturn(false);
        when(vpisRepository.findByUcenecIdAndPredmetId(ucenecId, predmetId)).thenReturn(Optional.empty());
        when(vpisRepository.save(any())).thenReturn(vpis);
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(profil));

        VpisResponseDTO result = vpisService.vpisZKodo("ABC123", ucenecId);

        assertNotNull(result);
        verify(vpisRepository, times(1)).save(any());
    }

    @Test
    void vpisZKodo_throwsWhenInvalidCode() {
        when(predmetRepository.findByKodaVpisa("WRONG")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> vpisService.vpisZKodo("WRONG", ucenecId));
    }

    @Test
    void vpisZKodo_throwsWhenAlreadyEnrolled() {
        when(predmetRepository.findByKodaVpisa("ABC123")).thenReturn(Optional.of(predmet));
        when(vpisRepository.existsByUcenecIdAndPredmetIdAndJeAktivenTrue(ucenecId, predmetId)).thenReturn(true);

        assertThrows(RuntimeException.class,
                () -> vpisService.vpisZKodo("ABC123", ucenecId));
    }

    @Test
    void vpisZKodo_reactivatesInactiveEnrollment() {
        Vpis neaktiven = new Vpis();
        neaktiven.setId(UUID.randomUUID());
        neaktiven.setUcenecId(ucenecId);
        neaktiven.setPredmet(predmet);
        neaktiven.setJeAktiven(false);
        neaktiven.setCasNaModulu(0);

        when(predmetRepository.findByKodaVpisa("ABC123")).thenReturn(Optional.of(predmet));
        when(vpisRepository.existsByUcenecIdAndPredmetIdAndJeAktivenTrue(ucenecId, predmetId)).thenReturn(false);
        when(vpisRepository.findByUcenecIdAndPredmetId(ucenecId, predmetId)).thenReturn(Optional.of(neaktiven));
        when(vpisRepository.save(any())).thenReturn(neaktiven);
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(profil));

        VpisResponseDTO result = vpisService.vpisZKodo("ABC123", ucenecId);

        assertNotNull(result);
        verify(vpisRepository, times(1)).save(any());
    }

    @Test
    void vpisZKodo_sendsNotificationToProfessor() {
        when(predmetRepository.findByKodaVpisa("ABC123")).thenReturn(Optional.of(predmet));
        when(vpisRepository.existsByUcenecIdAndPredmetIdAndJeAktivenTrue(ucenecId, predmetId)).thenReturn(false);
        when(vpisRepository.findByUcenecIdAndPredmetId(ucenecId, predmetId)).thenReturn(Optional.empty());
        when(vpisRepository.save(any())).thenReturn(vpis);
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(profil));

        vpisService.vpisZKodo("ABC123", ucenecId);

        verify(obvestiloService, times(1)).ustvari(
                eq(uciteljId), eq("MODULE"), any(), any(), any());
    }

    // ── getMojiVpisi ──────────────────────────────────────────────────────────

    @Test
    void getMojiVpisi_returnsEnrollments() {
        when(vpisRepository.findByUcenecIdAndJeAktivenTrue(ucenecId)).thenReturn(List.of(vpis));

        var result = vpisService.getMojiVpisi(ucenecId);

        assertEquals(1, result.size());
        assertEquals(predmetId, result.get(0).getPredmetId());
    }

    @Test
    void getMojiVpisi_returnsEmptyWhenNone() {
        when(vpisRepository.findByUcenecIdAndJeAktivenTrue(ucenecId)).thenReturn(List.of());

        assertTrue(vpisService.getMojiVpisi(ucenecId).isEmpty());
    }

    // ── posodobiCas ───────────────────────────────────────────────────────────

    @Test
    void posodobiCas_updatesTime() {
        when(vpisRepository.findByUcenecIdAndPredmetIdAndJeAktivenTrue(ucenecId, predmetId))
                .thenReturn(Optional.of(vpis));
        when(vpisRepository.save(any())).thenReturn(vpis);

        VpisResponseDTO result = vpisService.posodobiCas(predmetId, ucenecId, 120);

        assertNotNull(result);
        verify(vpisRepository, times(1)).save(any());
    }

    @Test
    void posodobiCas_throwsWhenNotEnrolled() {
        when(vpisRepository.findByUcenecIdAndPredmetIdAndJeAktivenTrue(ucenecId, predmetId))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> vpisService.posodobiCas(predmetId, ucenecId, 60));
    }

    // ── steviloVpisanih ───────────────────────────────────────────────────────

    @Test
    void steviloVpisanih_returnsCount() {
        when(vpisRepository.countByPredmetIdAndJeAktivenTrue(predmetId)).thenReturn(5L);

        assertEquals(5L, vpisService.steviloVpisanih(predmetId));
    }

    @Test
    void steviloVpisanih_returnsZeroWhenNone() {
        when(vpisRepository.countByPredmetIdAndJeAktivenTrue(predmetId)).thenReturn(0L);

        assertEquals(0L, vpisService.steviloVpisanih(predmetId));
    }

    // ── getStilMixZaUcitelja ──────────────────────────────────────────────────

    @Test
    void getStilMix_returnsStyleCounts() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of(predmet));
        when(vpisRepository.findByPredmetIdInAndJeAktivenTrue(any())).thenReturn(List.of(vpis));
        when(profilRepository.findAllById(any())).thenReturn(List.of(profil));

        Map<String, Long> result = vpisService.getStilMixZaUcitelja(uciteljId);

        assertNotNull(result);
        assertTrue(result.containsKey("visual"));
        assertTrue(result.containsKey("_total"));
    }

    @Test
    void getStilMix_returnsEmptyWhenNoModules() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of());

        assertTrue(vpisService.getStilMixZaUcitelja(uciteljId).isEmpty());
    }

    // ── getStudentiZaUcitelja ─────────────────────────────────────────────────

    @Test
    void getStudenti_returnsStudents() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of(predmet));
        when(vpisRepository.findByPredmetIdInAndJeAktivenTrue(any())).thenReturn(List.of(vpis));
        when(quizRepository.findByPredmetIdIn(any())).thenReturn(List.of());
        when(profilRepository.findAllById(any())).thenReturn(List.of(profil));

        var result = vpisService.getStudentiZaUcitelja(uciteljId);

        assertEquals(1, result.size());
        assertEquals("Test Student", result.get(0).getImePriimek());
    }

    @Test
    void getStudenti_returnsEmptyWhenNoModules() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of());

        assertTrue(vpisService.getStudentiZaUcitelja(uciteljId).isEmpty());
    }

    @Test
    void getStudenti_returnsEmptyWhenNoEnrollments() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of(predmet));
        when(vpisRepository.findByPredmetIdInAndJeAktivenTrue(any())).thenReturn(List.of());

        assertTrue(vpisService.getStudentiZaUcitelja(uciteljId).isEmpty());
    }

    // ── getStudentiPoModulihZaUcitelja ────────────────────────────────────────

    @Test
    void getStudentiPoModulih_returnsGrouped() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of(predmet));
        when(vpisRepository.findByPredmetIdInAndJeAktivenTrue(any())).thenReturn(List.of(vpis));
        when(quizRepository.findByPredmetIdIn(any())).thenReturn(List.of());
        when(profilRepository.findAllById(any())).thenReturn(List.of(profil));

        var result = vpisService.getStudentiPoModulihZaUcitelja(uciteljId);

        assertEquals(1, result.size());
        assertEquals("Test Module", result.get(0).getNaziv());
    }

    @Test
    void getStudentiPoModulih_returnsEmptyWhenNoModules() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of());

        assertTrue(vpisService.getStudentiPoModulihZaUcitelja(uciteljId).isEmpty());
    }

    // ── odjava ────────────────────────────────────────────────────────────────

    @Test
    void odjava_deactivatesEnrollment() {
        when(vpisRepository.findByUcenecIdAndPredmetIdAndJeAktivenTrue(ucenecId, predmetId))
                .thenReturn(Optional.of(vpis));
        when(vpisRepository.save(any())).thenReturn(vpis);

        assertDoesNotThrow(() -> vpisService.odjava(predmetId, ucenecId));
        verify(vpisRepository, times(1)).save(any());
    }

    @Test
    void odjava_throwsWhenNotEnrolled() {
        when(vpisRepository.findByUcenecIdAndPredmetIdAndJeAktivenTrue(ucenecId, predmetId))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> vpisService.odjava(predmetId, ucenecId));
    }
}