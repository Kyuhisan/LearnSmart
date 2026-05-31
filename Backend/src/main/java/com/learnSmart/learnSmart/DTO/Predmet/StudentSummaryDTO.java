package com.learnSmart.learnSmart.DTO.Predmet;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class StudentSummaryDTO {
    private UUID ucenecId;
    private String imePriimek;
    private String username;
    private String email;
    private String ucniTip;
    private int avgScore;       // 0 = no quiz results
    private int steviloModulov; // how many of this professor's modules they're enrolled in
}
