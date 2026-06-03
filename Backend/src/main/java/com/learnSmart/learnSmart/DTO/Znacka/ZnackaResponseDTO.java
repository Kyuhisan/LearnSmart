package com.learnSmart.learnSmart.DTO.Znacka;

import com.learnSmart.learnSmart.Enum.BadgeType;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class ZnackaResponseDTO {
    private BadgeType type;
    private String opis;
    private OffsetDateTime pridobljenOb;
}
