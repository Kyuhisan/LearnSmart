package com.learnSmart.learnSmart.DTO.Quiz;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuizResultResponseDTO {
    private UUID id;
    private UUID kvizId;
    private String kvizNaziv;
    private Integer tocke;
    private Integer skupajVprasanj;
    private Integer odstotek;
    private Integer casResevanjaS;
    private OffsetDateTime oddanoOb;
    private List<Integer> odgovori;
    private Integer xpZasluzen;
    private Integer skupajXp;
    private Integer nivo;
}