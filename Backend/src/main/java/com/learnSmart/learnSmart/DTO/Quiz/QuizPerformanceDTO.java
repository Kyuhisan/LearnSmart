package com.learnSmart.learnSmart.DTO.Quiz;

import java.util.UUID;

public record QuizPerformanceDTO(UUID kvizId, String naziv, int avgScore, int submissions, int passRate) {}
