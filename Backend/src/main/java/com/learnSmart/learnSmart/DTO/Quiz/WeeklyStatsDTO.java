package com.learnSmart.learnSmart.DTO.Quiz;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.*;
import java.util.List;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class WeeklyStatsDTO {
    private List<DayStatsDTO> days;

    @SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class DayStatsDTO {
        private String day;      // "MON", "TUE" ...
        private int xpSum;
        private int avgScore;
    }
}