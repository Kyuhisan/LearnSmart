package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Model.Profil;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
import com.learnSmart.learnSmart.Repository.ProfilRepository;
import com.learnSmart.learnSmart.Repository.VpisRepository;
import com.learnSmart.learnSmart.DTO.Predmet.PredmetRequestDTO;
import com.learnSmart.learnSmart.DTO.Predmet.PredmetResponseDTO;
import com.learnSmart.learnSmart.Mapper.PredmetMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PredmetService {

    private static final String PREDMET_NE_OBSTAJA = "Module does not exist";
    private static final String NI_DOVOLJENJA = "You do not have permission";

    private final PredmetRepository predmetRepository;
    private final ProfilRepository profilRepository;
    private final VpisRepository vpisRepository;

    private PredmetResponseDTO toResponseWithProfil(Predmet predmet) {
        Profil profil = profilRepository.findById(predmet.getUciteljId()).orElse(null);
        long count = vpisRepository.countByPredmetIdAndJeAktivenTrue(predmet.getId());
        return PredmetMapper.toResponse(predmet, profil, count);
    }

    public List<PredmetResponseDTO> getObjavljene() {
        return predmetRepository.findAll().stream()
                .filter(Predmet::isJeObjavljen)
                .map(this::toResponseWithProfil)
                .toList();
    }

    public PredmetResponseDTO getById(UUID id) {
        Predmet predmet = predmetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(PREDMET_NE_OBSTAJA));
        return toResponseWithProfil(predmet);
    }

    public PredmetResponseDTO ustvari(PredmetRequestDTO dto, UUID uciteljId) {
        Predmet predmet = PredmetMapper.toEntity(dto, uciteljId);
        return toResponseWithProfil(predmetRepository.save(predmet));
    }

    public PredmetResponseDTO uredi(UUID id, PredmetRequestDTO dto, UUID uciteljId) {
        Predmet predmet = predmetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(PREDMET_NE_OBSTAJA));
        if (!predmet.getUciteljId().equals(uciteljId)) {
            throw new RuntimeException(NI_DOVOLJENJA);
        }
        predmet.setNaziv(dto.getNaziv());
        predmet.setOpis(dto.getOpis());
        predmet.setKodaVpisa(dto.getKodaVpisa());
        predmet.setTezavnost(dto.getTezavnost());
        predmet.setKategorije(dto.getKategorije());
        return toResponseWithProfil(predmetRepository.save(predmet));
    }

    public void izbrisi(UUID id, UUID uciteljId) {
        Predmet predmet = predmetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(PREDMET_NE_OBSTAJA));
        if (!predmet.getUciteljId().equals(uciteljId)) {
            throw new RuntimeException(NI_DOVOLJENJA);
        }
        predmetRepository.delete(predmet);
    }

    public PredmetResponseDTO objavi(UUID id, UUID uciteljId) {
        Predmet predmet = predmetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(PREDMET_NE_OBSTAJA));
        if (!predmet.getUciteljId().equals(uciteljId)) {
            throw new RuntimeException(NI_DOVOLJENJA);
        }
        predmet.setJeObjavljen(true);
        return toResponseWithProfil(predmetRepository.save(predmet));
    }

    public PredmetResponseDTO umakni(UUID id, UUID uciteljId) {
        Predmet predmet = predmetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(PREDMET_NE_OBSTAJA));
        if (!predmet.getUciteljId().equals(uciteljId)) {
            throw new RuntimeException(NI_DOVOLJENJA);
        }
        predmet.setJeObjavljen(false);
        return toResponseWithProfil(predmetRepository.save(predmet));
    }

    public List<PredmetResponseDTO> getMoji(UUID uciteljId) {
        return predmetRepository.findAll().stream()
                .filter(p -> p.getUciteljId().equals(uciteljId))
                .map(this::toResponseWithProfil)
                .toList();
    }
}