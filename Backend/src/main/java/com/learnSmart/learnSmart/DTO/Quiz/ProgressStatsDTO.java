package com.learnSmart.learnSmart.DTO.Quiz;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.*;
import java.util.List;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProgressStatsDTO {
    private List<DailyXpDTO> biweeklyXp;   // 14 dni
    private List<CalendarDayDTO> calendarDays; // 35 dni
    private int streak;
    private int streakBest;

    @SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class DailyXpDTO {
        private String label;  // "May 10"
        private int xp;
    }

    @SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CalendarDayDTO {
        private String date;    // "YYYY-MM-DD"
        private int xp;
        private boolean future;
    }
}