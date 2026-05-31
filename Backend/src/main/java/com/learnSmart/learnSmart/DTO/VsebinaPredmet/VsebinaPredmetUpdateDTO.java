package com.learnSmart.learnSmart.DTO.VsebinaPredmet;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@SuppressFBWarnings(value = {"EI_EXPOSE_REP", "EI_EXPOSE_REP2"}, justification = "DTO used for JSON transport")
public class VsebinaPredmetUpdateDTO {
    private Map<String,Object> vsebina;
}
