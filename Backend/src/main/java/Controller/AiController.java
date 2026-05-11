package Controller;

import DTO.LearningStyleResponse;
import Service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("ai/")
public class AiController {
    private final GeminiService geminiService;

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/classify-style")
    public ResponseEntity<LearningStyleResponse> classifyStyle(@RequestBody Map<String, List<String>> request) {
        List<String> answers = request.get("answers");
        LearningStyleResponse response = geminiService.classify(answers);
        return ResponseEntity.ok(response);
    }
}
