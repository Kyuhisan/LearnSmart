package com.learnSmart.learnSmart.DTO;

import com.learnSmart.learnSmart.Model.Predmet;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

// Suppresses SpotBugs warnings for exposing internal Predmet reference.
// Defensive copying is intentionally skipped as this DTO is used only internally within the controller.
@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IzvornaDatotekaRequest {
    private Predmet predmet;
    private String imeDatoteke;
    private String url;
    private String tip;
    private Long velikostBytes;
    private String processingStatus;
    private OffsetDateTime ustvarjenOb;
    private String manjsiTranscript;
    private String hash;
}
