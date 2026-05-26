package com.learnSmart.learnSmart.DTO.Quiz;


import com.learnSmart.learnSmart.Service.QuizGeminiService;
import lombok.*;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuizSaveRequestDTO {
    private UUID predmetId;
    private String naziv;
    private Integer casIzvajanja;
    private List<QuizGeminiService.GeneratedQuestion> vprasanja;
}