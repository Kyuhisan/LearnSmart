package com.learnSmart.learnSmart.DTO.Predmet;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ModuleStudentsDTO {
    private UUID predmetId;
    private String naziv;
    private List<StudentSummaryDTO> studenti;
}
