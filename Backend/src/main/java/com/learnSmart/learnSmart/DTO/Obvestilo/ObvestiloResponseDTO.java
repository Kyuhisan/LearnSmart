package com.learnSmart.learnSmart.DTO.Obvestilo;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ObvestiloResponseDTO {
    private UUID id;
    private String tip;
    private String naslov;
    private String sporocilo;
    private boolean jePrebrano;
    private OffsetDateTime ustvarjenoOb;
    private String povezava;
}