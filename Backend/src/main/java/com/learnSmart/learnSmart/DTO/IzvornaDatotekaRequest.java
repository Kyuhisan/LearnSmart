package com.learnSmart.learnSmart.DTO;

import com.learnSmart.learnSmart.Model.Predmet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

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
}
