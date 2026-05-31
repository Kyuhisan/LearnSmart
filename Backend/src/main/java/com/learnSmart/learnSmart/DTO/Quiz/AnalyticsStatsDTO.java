package com.learnSmart.learnSmart.DTO.Quiz;

public record AnalyticsStatsDTO(
        int totalStudents,
        int avgScore,
        int avgCompletion,
        int passRate
) {}
