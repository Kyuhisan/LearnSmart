package com.learnSmart.learnSmart.DTO.VsebinaPredmet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Map<String, Object> vsebina;
}
