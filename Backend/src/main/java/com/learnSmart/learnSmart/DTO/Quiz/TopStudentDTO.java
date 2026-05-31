package com.learnSmart.learnSmart.DTO.Quiz;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TopStudentDTO {
    private UUID ucenecId;
    private String imePriimek;
    private String ucniTip;
    private int score; // 0–130 (accuracy % with up to +30% speed bonus)
}
