package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.VsebinaPredmet.VsebinaPredmetResponseDTO;
import com.learnSmart.learnSmart.Model.VsebinaPredmet;
import com.learnSmart.learnSmart.Repository.VsebinaPredmetRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@SuppressFBWarnings(value = "EI_EXPOSE_REP2", justification = "Spring dependency injection")
public class VsebinaPredmetService {
    private final VsebinaPredmetRepository vsebinaPredmetRepository;

    public List<VsebinaPredmetResponseDTO> getVsebinaPredmeta(UUID predmetId){
        List<VsebinaPredmet> vsebine = vsebinaPredmetRepository.findByPredmetId(predmetId);

        return vsebine.stream()
                .map(vsebinaPredmet -> new VsebinaPredmetResponseDTO(
                vsebinaPredmet.getVsebinaPredmetId(),
                vsebinaPredmet.getPredmet().getId(),
                vsebinaPredmet.getUcniTip(),
                vsebinaPredmet.getVsebina()
        )).toList();
    }

    public void updateVsebinaPredmet(UUID vsebinaPredmetId, Map<String, Object> vsebina) {
        VsebinaPredmet vsebinaPredmet = vsebinaPredmetRepository.findById(vsebinaPredmetId).orElseThrow(() -> new IllegalArgumentException("Content not found."));

        Map<String, Object> existingVsebina = vsebinaPredmet.getVsebina();

        if (existingVsebina == null) {
            existingVsebina = new HashMap<>();
        }
        
        existingVsebina.putAll(vsebina);
        vsebinaPredmet.setVsebina(existingVsebina);
        vsebinaPredmetRepository.save(vsebinaPredmet);
    }
}
