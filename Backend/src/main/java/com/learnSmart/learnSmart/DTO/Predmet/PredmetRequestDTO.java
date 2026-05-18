package com.learnSmart.learnSmart.DTO.Predmet;

import jakarta.validation.constraints.*;
import lombok.*;

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
}