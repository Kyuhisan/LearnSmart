package com.learnSmart.learnSmart.DTO.Predmet;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PredmetRequestDTO {

    @NotBlank(message = "Title can not be empty")
    @Size(min = 3, max = 45, message = "Title must be between 3 and 45 characters")
    private String naziv;

    private String opis;

    @NotBlank(message = "The login code cannot be empty")
    private String kodaVpisa;

    private boolean jeObjavljen = false;

    @Min(1) @Max(5)
    private Integer tezavnost;
}