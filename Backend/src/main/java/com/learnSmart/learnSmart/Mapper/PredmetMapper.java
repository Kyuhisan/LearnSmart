package com.learnSmart.learnSmart.Mapper;

import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.DTO.Predmet.PredmetRequestDTO;
import com.learnSmart.learnSmart.DTO.Predmet.PredmetResponseDTO;
import java.util.UUID;

public class PredmetMapper {

    public static PredmetResponseDTO toResponse(Predmet predmet) {
        PredmetResponseDTO dto = new PredmetResponseDTO();
        dto.setId(predmet.getId());
        dto.setNaziv(predmet.getNaziv());
        dto.setOpis(predmet.getOpis());
        dto.setKodaVpisa(predmet.getKodaVpisa());
        dto.setJeObjavljen(predmet.isJeObjavljen());
        dto.setTezavnost(predmet.getTezavnost());
        dto.setUstvarjenOb(predmet.getUstvarjenOb());
        dto.setUciteljId(predmet.getUciteljId());
        return dto;
    }

    public static Predmet toEntity(PredmetRequestDTO dto, UUID uciteljId) {
        Predmet predmet = new Predmet();
        predmet.setNaziv(dto.getNaziv());
        predmet.setOpis(dto.getOpis());
        predmet.setKodaVpisa(dto.getKodaVpisa());
        predmet.setJeObjavljen(dto.isJeObjavljen());
        predmet.setTezavnost(dto.getTezavnost());
        predmet.setUciteljId(uciteljId);
        predmet.setUstvarjenOb(java.time.OffsetDateTime.now());
        return predmet;
    }
}