package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.LearningStyleResponse;
import com.learnSmart.learnSmart.Service.GeminiService;
import com.learnSmart.learnSmart.Service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("ai/")
@Tag(name = "AI", description = "Gemini-powered learning style classification")
public class AiController {
    private final GeminiService geminiService;
    private final UserService userService;

    public AiController(GeminiService geminiService, UserService userService) {
        this.geminiService = geminiService;
        this.userService = userService;
    }

    @PostMapping("/classify-style")
    @SecurityRequirements
    @Operation(
        summary = "Classify VARK learning style",
        description = "Submits VARK questionnaire answers to Gemini AI and returns the dominant learning style. " +
                      "If a JWT is present, the result is persisted to the user's profile. " +
                      "Falls back to count-based classification if Gemini is unavailable. " +
                      "Authentication is optional — works for both logged-in users and anonymous calls."
    )
    @ApiResponse(responseCode = "200", description = "Learning style classified successfully", content = @Content(schema = @Schema(implementation = LearningStyleResponse.class)))
    public ResponseEntity<LearningStyleResponse> classifyStyle(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "List of VARK answer strings from the questionnaire",
                content = @Content(schema = @Schema(example = "{\"answers\": [\"visual\", \"reading\", \"visual\", \"kinesthetic\"]}"))
            )
            @RequestBody Map<String, List<String>> request,
            @AuthenticationPrincipal Jwt jwt) {

        List<String> answers = request.get("answers");
        LearningStyleResponse response = geminiService.classify(answers);

        if (jwt != null) {
            try {
                Map<String, Long> counts = answers.stream()
                        .collect(java.util.stream.Collectors.groupingBy(a -> a, java.util.stream.Collectors.counting()));
                userService.updateLearningStyle(
                        jwt.getSubject(),
                        response.getLearningStyle(),
                        counts.getOrDefault("visual",      0L).intValue(),
                        counts.getOrDefault("auditory",    0L).intValue(),
                        counts.getOrDefault("reading",     0L).intValue(),
                        counts.getOrDefault("kinesthetic", 0L).intValue()
                );
            } catch (Exception e) {
                log.warn("Could not persist learning style for {}: {}", jwt.getSubject(), e.getMessage());
            }
        }
        return ResponseEntity.ok(response);
    }
}
