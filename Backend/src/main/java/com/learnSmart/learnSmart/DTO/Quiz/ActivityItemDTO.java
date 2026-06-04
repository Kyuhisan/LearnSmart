package com.learnSmart.learnSmart.DTO.Quiz;

import lombok.*;
import java.time.OffsetDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ActivityItemDTO {
    private String type;       // "QUIZ_PUBLISHED", "QUIZ_RESULT"
    private String title;
    private String badge;
    private OffsetDateTime date;
}