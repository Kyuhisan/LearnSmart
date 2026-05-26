package com.learnSmart.learnSmart.DTO.VsebinaPredmet;

import lombok.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VsebinaPredmetResponseDTO {

    private UUID predmetVsebinaId;
    private UUID predmetId;
    private String ucniTip;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private Map<String, Object> vsebina;

    public Map<String, Object> getVsebina() {
        if (vsebina == null) {
            vsebina = new HashMap<>();
        }
        return new HashMap<>(vsebina);
    }

    public void setVsebina(Map<String, Object> vsebina) {
        if (vsebina == null) {
            this.vsebina = new HashMap<>();
            return;
        }
        this.vsebina = new HashMap<>(vsebina);
    }
}