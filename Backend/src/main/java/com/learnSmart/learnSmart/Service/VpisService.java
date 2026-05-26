package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Predmet.VpisResponseDTO;
import com.learnSmart.learnSmart.DTO.Predmet.VpisResponseDTO;
import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Model.Vpis;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
import com.learnSmart.learnSmart.Repository.VpisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VpisService {

    private static final String PREDMET_NE_OBSTAJA = "Module does not exist";
    private static final String ZE_VPISAN = "Already enrolled";
    private static final String NAPACNA_KODA = "Invalid enrollment code";
    private static final String VPIS_NE_OBSTAJA = "Enrollment does not exist";

    private final VpisRepository vpisRepository;
    private final PredmetRepository predmetRepository;

    // Vpis z kodo
    public VpisResponseDTO vpisZKodo(String kodaVpisa, UUID ucenecId) {
        Predmet predmet = predmetRepository.findByKodaVpisa(kodaVpisa)
                .orElseThrow(() -> new RuntimeException(NAPACNA_KODA));

        if (vpisRepository.existsByUcenecIdAndPredmetId(ucenecId, predmet.getId())) {
            throw new RuntimeException(ZE_VPISAN);
        }

        Vpis vpis = new Vpis();
        vpis.setUcenecId(ucenecId);
        vpis.setPredmet(predmet);
        vpis.setVpisanOb(OffsetDateTime.now());
        vpis.setCasNaModulu(0);

        return toResponse(vpisRepository.save(vpis));
    }

    // Moji vpisi
    public List<VpisResponseDTO> getMojiVpisi(UUID ucenecId) {
        return vpisRepository.findByUcenecId(ucenecId).stream()
                .map(this::toResponse)
                .toList();
    }

    // Posodobi cas na modulu
    public VpisResponseDTO posodobiCas(UUID predmetId, UUID ucenecId, Integer cas) {
        Vpis vpis = vpisRepository.findByUcenecIdAndPredmetId(ucenecId, predmetId)
                .orElseThrow(() -> new RuntimeException(VPIS_NE_OBSTAJA));
        vpis.setCasNaModulu((vpis.getCasNaModulu() == null ? 0 : vpis.getCasNaModulu()) + cas);
        return toResponse(vpisRepository.save(vpis));
    }

    // Odjava iz modula
    public void odjava(UUID predmetId, UUID ucenecId) {
        Vpis vpis = vpisRepository.findByUcenecIdAndPredmetId(ucenecId, predmetId)
                .orElseThrow(() -> new RuntimeException(VPIS_NE_OBSTAJA));
        vpisRepository.delete(vpis);
    }

    private VpisResponseDTO toResponse(Vpis vpis) {
        VpisResponseDTO dto = new VpisResponseDTO();
        dto.setId(vpis.getId());
        dto.setPredmetId(vpis.getPredmet().getId());
        dto.setPredmetNaziv(vpis.getPredmet().getNaziv());
        dto.setVpisanOb(vpis.getVpisanOb());
        dto.setCasNaModulu(vpis.getCasNaModulu());
        return dto;
    }
}