package com.learnSmart.learnSmart.DTO.Quiz;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.*;
import java.util.List;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuizResultRequestDTO {
    private List<Integer> odgovori;
    private Integer casResevanjaS; // sekunde
}