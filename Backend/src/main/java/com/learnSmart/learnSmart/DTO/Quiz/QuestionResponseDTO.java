package com.learnSmart.learnSmart.DTO.Quiz;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.*;
import java.util.List;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuestionResponseDTO {
    private UUID id;
    private String besediloVprasanja;
    private List<String> moznosti;
    private Integer indeksPravilnegaOdgovora;
    private String razlaga;
}