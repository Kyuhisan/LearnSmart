package com.learnSmart.learnSmart.DTO.Predmet;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
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
    private java.util.List<String> kategorije;
    private long steviloVpisanih;
}