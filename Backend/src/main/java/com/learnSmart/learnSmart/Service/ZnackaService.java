package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Znacka.ZnackaResponseDTO;
import com.learnSmart.learnSmart.Enum.BadgeType;
import com.learnSmart.learnSmart.Model.Profil;
import com.learnSmart.learnSmart.Model.Znacka;
import com.learnSmart.learnSmart.Repository.ProfilRepository;
import com.learnSmart.learnSmart.Repository.ZnackaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ZnackaService {

    private final ZnackaRepository znackaRepository;
    private final ProfilRepository profilRepository;

    public void awardBadge(UUID profilId, BadgeType badgeType, String description) {
        if (znackaRepository.existsByProfilIdAndType(profilId, badgeType)) {
            return;
        }

        Profil profil = profilRepository.findById(profilId).orElseThrow(() -> new IllegalArgumentException("Profile not found."));

        Znacka znacka = new Znacka();
        znacka.setProfil(profil);
        znacka.setOpis(description);
        znacka.setType(badgeType);
        znacka.setPridobljenOb(OffsetDateTime.now());

        znackaRepository.save(znacka);
    }

    public List<ZnackaResponseDTO> findAll(UUID profilId) {
        return znackaRepository.findByProfilId(profilId)
                .stream()
                .map(znacka -> {
            ZnackaResponseDTO dto = new ZnackaResponseDTO();
            dto.setType(znacka.getType());
            dto.setOpis(znacka.getOpis());
            dto.setPridobljenOb(znacka.getPridobljenOb());
            return dto;
        }).toList();
    }
}
