package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
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

    private final PredmetRepository predmetRepository;

    // GET vse objavljene (javno)
    public List<PredmetResponseDTO> getObjavljene() {
        return predmetRepository.findAll().stream()
                .filter(Predmet::isJeObjavljen)
                .map(PredmetMapper::toResponse)
                .toList();
    }

    // GET po id
    public PredmetResponseDTO getById(UUID id) {
        Predmet predmet = predmetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module does not exist"));
        return PredmetMapper.toResponse(predmet);
    }

    // POST - ustvari
    public PredmetResponseDTO ustvari(PredmetRequestDTO dto, UUID uciteljId) {
        Predmet predmet = PredmetMapper.toEntity(dto, uciteljId);
        return PredmetMapper.toResponse(predmetRepository.save(predmet));
    }

    // PUT - uredi (samo lastnik)
    public PredmetResponseDTO uredi(UUID id, PredmetRequestDTO dto, UUID uciteljId) {
        Predmet predmet = predmetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module does not exist"));

        if (!predmet.getUciteljId().equals(uciteljId)) {
            throw new RuntimeException("You do not have permission to edit this item");
        }

        predmet.setNaziv(dto.getNaziv());
        predmet.setOpis(dto.getOpis());
        predmet.setKodaVpisa(dto.getKodaVpisa());
        predmet.setTezavnost(dto.getTezavnost());
        return PredmetMapper.toResponse(predmetRepository.save(predmet));
    }

    // DELETE (samo lastnik)
    public void izbrisi(UUID id, UUID uciteljId) {
        Predmet predmet = predmetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module does not exist"));

        if (!predmet.getUciteljId().equals(uciteljId)) {
            throw new RuntimeException("You do not have permission to edit this item");
        }

        predmetRepository.delete(predmet);
    }

    // PATCH - objavi
    public PredmetResponseDTO objavi(UUID id, UUID uciteljId) {
        Predmet predmet = predmetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module does not exist"));

        if (!predmet.getUciteljId().equals(uciteljId)) {
            throw new RuntimeException("You do not have permission");
        }

        predmet.setJeObjavljen(true);
        return PredmetMapper.toResponse(predmetRepository.save(predmet));
    }
}
