package com.learnSmart.learnSmart.DTO.Quiz;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class WeeklyStatsDTO {
    private List<DayStatsDTO> days;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class DayStatsDTO {
        private String day;      // "MON", "TUE" ...
        private int xpSum;
        private int avgScore;
    }
}