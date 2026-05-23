package com.learnSmart.learnSmart.Mapper;

import com.learnSmart.learnSmart.DTO.Predmet.PredmetRequestDTO;
import com.learnSmart.learnSmart.DTO.Predmet.PredmetResponseDTO;
import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Model.Profil;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class PredmetMapperTest {

    @Test
    void toResponse_mapsAllFields() {
        UUID id = UUID.randomUUID();
        UUID uciteljId = UUID.randomUUID();

        Predmet predmet = new Predmet();
        predmet.setId(id);
        predmet.setNaziv("Mathematics");
        predmet.setOpis("Description");
        predmet.setKodaVpisa("MAT-001");
        predmet.setJeObjavljen(true);
        predmet.setTezavnost(3);
        predmet.setUciteljId(uciteljId);

        Profil profil = new Profil();
        profil.setImePriimek("Test Teacher");

        PredmetResponseDTO dto = PredmetMapper.toResponse(predmet, profil);

        assertEquals("Mathematics", dto.getNaziv());
        assertEquals("MAT-001", dto.getKodaVpisa());
        assertEquals("Test Teacher", dto.getUciteljImePriimek());
        assertTrue(dto.isJeObjavljen());
    }

    @Test
    void toResponse_returnsUnknownWhenProfileNull() {
        Predmet predmet = new Predmet();
        predmet.setId(UUID.randomUUID());
        predmet.setNaziv("Test");
        predmet.setUciteljId(UUID.randomUUID());

        PredmetResponseDTO dto = PredmetMapper.toResponse(predmet, null);

        assertEquals("Neznan", dto.getUciteljImePriimek());
    }

    @Test
    void toEntity_mapsAllFields() {
        PredmetRequestDTO dto = new PredmetRequestDTO();
        dto.setNaziv("Physics");
        dto.setOpis("Physics description");
        dto.setKodaVpisa("PHY-001");
        dto.setTezavnost(4);

        UUID uciteljId = UUID.randomUUID();
        Predmet predmet = PredmetMapper.toEntity(dto, uciteljId);

        assertEquals("Physics", predmet.getNaziv());
        assertEquals("PHY-001", predmet.getKodaVpisa());
        assertEquals(uciteljId, predmet.getUciteljId());
        assertNotNull(predmet.getUstvarjenOb());
    }
}