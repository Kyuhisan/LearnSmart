package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.VsebinaPredmet.VsebinaPredmetResponseDTO;
import com.learnSmart.learnSmart.Model.VsebinaPredmet;
import com.learnSmart.learnSmart.Repository.VsebinaPredmetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
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
}
