package com.learnSmart.learnSmart.DTO.Quiz;


import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuizGenerateRequestDTO {
    private UUID predmetId;
    private int steviloVprasanj;
    private String tezavnost;
}