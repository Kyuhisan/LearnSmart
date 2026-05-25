package com.learnSmart.learnSmart.DTO.Upload;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IzvornaDatotekaResponseDTO {
    private UUID id;
    private String imeDatoteke;
    private String url;
    private String tip;
    private Long velikostBytes;
    private String processingStatus;
    private OffsetDateTime ustvarjenOb;
    private UUID predmetId;
    private String predmetNaziv;
}
