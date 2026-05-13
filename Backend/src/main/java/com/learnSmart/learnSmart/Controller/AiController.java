package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.LearningStyleResponse;
import com.learnSmart.learnSmart.Service.GeminiService;
import com.learnSmart.learnSmart.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("ai/")
public class AiController {
    private final GeminiService geminiService;
    private final UserService userService;

    public AiController(GeminiService geminiService, UserService userService) {
        this.geminiService = geminiService;
        this.userService = userService;

    }

    @PostMapping("/classify-style")
    public ResponseEntity<LearningStyleResponse> classifyStyle(@RequestBody Map<String, List<String>> request, @AuthenticationPrincipal Jwt jwt) {
        List<String> answers = request.get("answers");
        LearningStyleResponse response = geminiService.classify(answers);

        String userId = jwt.getSubject();
        userService.updateLearningStyle(userId, response.getLearningStyle());

        return ResponseEntity.ok(response);
    }


}
