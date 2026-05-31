package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Obvestilo.ObvestiloResponseDTO;
import com.learnSmart.learnSmart.Model.Obvestilo;
import com.learnSmart.learnSmart.Repository.ObvestiloRepository;
import com.learnSmart.learnSmart.Repository.ProfilRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
public class ObvestiloService {

    private final ObvestiloRepository obvestiloRepository;
    private final ProfilRepository profilRepository;
    private final EmailService emailService;

    public void ustvari(UUID uporabnikId, String tip, String naslov, String sporocilo, String povezava) {
        Obvestilo o = new Obvestilo();
        o.setUporabnikId(uporabnikId);
        o.setTip(tip);
        o.setNaslov(naslov);
        o.setSporocilo(sporocilo);
        o.setPovezava(povezava);
        o.setUstvarjenoOb(OffsetDateTime.now());
        obvestiloRepository.save(o);
        log.info("Obvestilo ustvarjeno za {}: {}", uporabnikId, naslov);

        // ── EMAIL ──
        profilRepository.findById(uporabnikId).ifPresent(p -> {
            if (p.getEmail() != null && !p.getEmail().isBlank()) {
                emailService.poslji(p.getEmail(), tip, naslov, sporocilo);
            }
        });
    }

    public List<ObvestiloResponseDTO> getMoja(UUID uporabnikId) {
        return obvestiloRepository
                .findByUporabnikIdOrderByUstvarjenoObDesc(uporabnikId)
                .stream()
                .map(o -> new ObvestiloResponseDTO(
                        o.getId(), o.getTip(), o.getNaslov(),
                        o.getSporocilo(), o.isJePrebrano(),
                        o.getUstvarjenoOb(), o.getPovezava()))
                .toList();
    }

    public long getNeprebranaStevilo(UUID uporabnikId) {
        return obvestiloRepository.countByUporabnikIdAndJePrebranoFalse(uporabnikId);
    }

    public void oznaciPrebrano(UUID obvestiloId) {
        obvestiloRepository.findById(obvestiloId).ifPresent(o -> {
            o.setJePrebrano(true);
            obvestiloRepository.save(o);
        });
    }

    public void oznaciVsePrebrano(UUID uporabnikId) {
        obvestiloRepository.findByUporabnikIdOrderByUstvarjenoObDesc(uporabnikId)
                .forEach(o -> {
                    o.setJePrebrano(true);
                    obvestiloRepository.save(o);
                });
    }
}