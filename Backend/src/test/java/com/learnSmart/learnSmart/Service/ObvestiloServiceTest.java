package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Obvestilo.ObvestiloResponseDTO;
import com.learnSmart.learnSmart.Model.Obvestilo;
import com.learnSmart.learnSmart.Repository.ObvestiloRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ObvestiloServiceTest {

    @Mock private ObvestiloRepository obvestiloRepository;

    @InjectMocks
    private ObvestiloService obvestiloService;

    private UUID uporabnikId;
    private UUID obvestiloId;
    private Obvestilo obvestilo;

    @BeforeEach
    void setUp() {
        uporabnikId = UUID.randomUUID();
        obvestiloId = UUID.randomUUID();

        obvestilo = new Obvestilo();
        obvestilo.setId(obvestiloId);
        obvestilo.setUporabnikId(uporabnikId);
        obvestilo.setTip("QUIZ");
        obvestilo.setNaslov("Test notification");
        obvestilo.setSporocilo("Test message");
        obvestilo.setJePrebrano(false);
        obvestilo.setUstvarjenoOb(OffsetDateTime.now());
        obvestilo.setPovezava("/kvizi");
    }

    // ── ustvari ───────────────────────────────────────────────────────────────

    @Test
    void ustvari_savesNotification() {
        when(obvestiloRepository.save(any())).thenReturn(obvestilo);

        assertDoesNotThrow(() -> obvestiloService.ustvari(
                uporabnikId, "QUIZ", "Test", "Message", "/kvizi"));

        verify(obvestiloRepository, times(1)).save(any());
    }

    @Test
    void ustvari_savesWithCorrectFields() {
        when(obvestiloRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        obvestiloService.ustvari(uporabnikId, "MODULE", "Naslov", "Sporocilo", "/moduli");

        verify(obvestiloRepository).save(argThat(o ->
                o.getUporabnikId().equals(uporabnikId) &&
                        o.getTip().equals("MODULE") &&
                        o.getNaslov().equals("Naslov") &&
                        !o.isJePrebrano()
        ));
    }

    // ── getMoja ───────────────────────────────────────────────────────────────

    @Test
    void getMoja_returnsNotifications() {
        when(obvestiloRepository.findByUporabnikIdOrderByUstvarjenoObDesc(uporabnikId))
                .thenReturn(List.of(obvestilo));

        List<ObvestiloResponseDTO> result = obvestiloService.getMoja(uporabnikId);

        assertEquals(1, result.size());
        assertEquals("Test notification", result.get(0).getNaslov());
    }

    @Test
    void getMoja_returnsEmptyWhenNone() {
        when(obvestiloRepository.findByUporabnikIdOrderByUstvarjenoObDesc(uporabnikId))
                .thenReturn(List.of());

        List<ObvestiloResponseDTO> result = obvestiloService.getMoja(uporabnikId);

        assertTrue(result.isEmpty());
    }

    // ── getNeprebranaStevilo ──────────────────────────────────────────────────

    @Test
    void getStevilo_returnsCount() {
        when(obvestiloRepository.countByUporabnikIdAndJePrebranoFalse(uporabnikId)).thenReturn(3L);

        long result = obvestiloService.getNeprebranaStevilo(uporabnikId);

        assertEquals(3L, result);
    }

    @Test
    void getStevilo_returnsZeroWhenAllRead() {
        when(obvestiloRepository.countByUporabnikIdAndJePrebranoFalse(uporabnikId)).thenReturn(0L);

        long result = obvestiloService.getNeprebranaStevilo(uporabnikId);

        assertEquals(0L, result);
    }

    // ── oznaciPrebrano ────────────────────────────────────────────────────────

    @Test
    void oznaciPrebrano_marksAsRead() {
        when(obvestiloRepository.findById(obvestiloId)).thenReturn(Optional.of(obvestilo));
        when(obvestiloRepository.save(any())).thenReturn(obvestilo);

        assertDoesNotThrow(() -> obvestiloService.oznaciPrebrano(obvestiloId));

        verify(obvestiloRepository, times(1)).save(any());
        assertTrue(obvestilo.isJePrebrano());
    }

    @Test
    void oznaciPrebrano_doesNothingWhenNotFound() {
        when(obvestiloRepository.findById(obvestiloId)).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> obvestiloService.oznaciPrebrano(obvestiloId));

        verify(obvestiloRepository, never()).save(any());
    }

    // ── oznaciVsePrebrano ─────────────────────────────────────────────────────

    @Test
    void oznaciVsePrebrano_marksAllAsRead() {
        Obvestilo o2 = new Obvestilo();
        o2.setId(UUID.randomUUID());
        o2.setJePrebrano(false);

        when(obvestiloRepository.findByUporabnikIdOrderByUstvarjenoObDesc(uporabnikId))
                .thenReturn(List.of(obvestilo, o2));
        when(obvestiloRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        assertDoesNotThrow(() -> obvestiloService.oznaciVsePrebrano(uporabnikId));

        verify(obvestiloRepository, times(2)).save(any());
    }

    @Test
    void oznaciVsePrebrano_doesNothingWhenNone() {
        when(obvestiloRepository.findByUporabnikIdOrderByUstvarjenoObDesc(uporabnikId))
                .thenReturn(List.of());

        assertDoesNotThrow(() -> obvestiloService.oznaciVsePrebrano(uporabnikId));

        verify(obvestiloRepository, never()).save(any());
    }
}