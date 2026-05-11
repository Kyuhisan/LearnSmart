package DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LearningStyleResponse {
    private String learningStyle;
    private int confidence;
}
