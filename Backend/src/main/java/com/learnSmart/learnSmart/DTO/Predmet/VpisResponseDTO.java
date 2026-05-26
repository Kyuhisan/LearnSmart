package com.learnSmart.learnSmart.DTO.Predmet;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class VpisResponseDTO {
    private UUID id;
    private UUID predmetId;
    private String predmetNaziv;
    private OffsetDateTime vpisanOb;
    private Integer casNaModulu;
}