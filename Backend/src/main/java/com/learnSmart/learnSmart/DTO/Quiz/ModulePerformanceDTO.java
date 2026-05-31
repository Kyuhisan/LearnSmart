package com.learnSmart.learnSmart.DTO.Quiz;

import java.util.List;
import java.util.UUID;

public record ModulePerformanceDTO(
        UUID predmetId, String naziv,
        int totalStudents, int avgScore, int avgCompletion, int passRate,
        List<QuizPerformanceDTO> kvizi) {

    public ModulePerformanceDTO {
        kvizi = List.copyOf(kvizi);
    }
}
