package com.learnSmart.learnSmart.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Result of VARK learning style classification")
public class LearningStyleResponse {

    @Schema(description = "Dominant VARK learning style", example = "visual", allowableValues = {"visual", "auditory", "reading", "kinesthetic", "uncategorized"})
    private String learningStyle;

    @Schema(description = "Confidence score from Gemini (0.0–1.0). Hardcoded to 0.87 when AI is available; count-based when falling back.", example = "0.87")
    private double confidence;
}
