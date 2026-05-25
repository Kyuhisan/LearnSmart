package com.learnSmart.learnSmart.DTO.Predmet;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.validation.constraints.*;
import lombok.*;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PredmetRequestDTO {

    @NotBlank(message = "Title can not be empty")
    @Size(min = 1, max = 45, message = "Title must be between 1 and 45 characters")
    private String naziv;

    private String opis;

    @NotBlank(message = "The login code cannot be empty")
    private String kodaVpisa;

    private Boolean jeObjavljen = false;

    @Min(1) @Max(5)
    private Integer tezavnost;

    private java.util.List<String> kategorije;
}