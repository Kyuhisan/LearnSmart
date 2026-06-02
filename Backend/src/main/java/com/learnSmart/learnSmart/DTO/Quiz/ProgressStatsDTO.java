package com.learnSmart.learnSmart.DTO.Quiz;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProgressStatsDTO {
    private List<DailyXpDTO> biweeklyXp;   // 14 dni
    private List<CalendarDayDTO> calendarDays; // 35 dni
    private int streak;
    private int streakBest;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class DailyXpDTO {
        private String label;  // "May 10"
        private int xp;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CalendarDayDTO {
        private String date;    // "YYYY-MM-DD"
        private int xp;
        private boolean future;
    }
}