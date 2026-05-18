package com.learnSmart.learnSmart.DTO.Predmet;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PredmetResponseDTO {
    private UUID id;
    private String naziv;
    private String opis;
    private String kodaVpisa;
    private boolean jeObjavljen;
    private Integer tezavnost;
    private OffsetDateTime ustvarjenOb;
    private UUID uciteljId;
    private String uciteljImePriimek;
}