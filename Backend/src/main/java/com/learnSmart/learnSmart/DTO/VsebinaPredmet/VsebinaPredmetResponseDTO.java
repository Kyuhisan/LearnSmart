package com.learnSmart.learnSmart.DTO.VsebinaPredmet;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class VsebinaPredmetResponseDTO {

    private UUID predmetVsebinaId;
    private UUID predmetId;
    private String ucniTip;
    private Map<String, Object> vsebina = new HashMap<>();

    public VsebinaPredmetResponseDTO(
            UUID predmetVsebinaId,
            UUID predmetId,
            String ucniTip,
            Map<String, Object> vsebina
    ) {
        this.predmetVsebinaId = predmetVsebinaId;
        this.predmetId = predmetId;
        this.ucniTip = ucniTip;
        this.vsebina = new HashMap<>(vsebina);
    }

    public Map<String, Object> getVsebina() {
        return new HashMap<>(vsebina);
    }

    public void setVsebina(Map<String, Object> vsebina) {
        this.vsebina = new HashMap<>(vsebina);
    }
}