package com.learnSmart.learnSmart.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.learnSmart.learnSmart.Model.Profil;
import com.learnSmart.learnSmart.Model.QuizResult;
import com.learnSmart.learnSmart.Repository.ProfilRepository;
import com.learnSmart.learnSmart.Repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "User identity and registration endpoints — JWT Bearer required")
public class AuthControler {

    private final ProfilRepository profilRepository;
    private final QuizResultRepository quizResultRepository;

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_SERVICE_KEY}")
    private String supabaseServiceKey;

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Returns basic identity claims from the Supabase JWT (id, email, full name).")
    @ApiResponse(responseCode = "200", description = "User info returned", content = @Content(schema = @Schema(example = "{\"id\": \"uuid\", \"email\": \"user@example.com\", \"name\": \"Jane Doe\"}")))
    @ApiResponse(responseCode = "401", description = "Missing or invalid JWT")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> userMetadata = jwt.getClaimAsMap("user_metadata");
        String fullName = userMetadata != null ? (String) userMetadata.get("full_name") : null;
        return Map.of(
                "id", jwt.getSubject(),
                "email", jwt.getClaimAsString("email") != null ? jwt.getClaimAsString("email") : "",
                "name", fullName != null ? fullName : ""
        );
    }

    @GetMapping("/me/status")
    @Operation(summary = "Get user registration status", description = "Checks Supabase whether the user has completed registration (set username + role). " + "Returns isNewUser=true if the profile is incomplete.")
    @ApiResponse(responseCode = "200", description = "Status returned", content = @Content(schema = @Schema(example = "{\"isNewUser\": false, \"vloga\": \"ucenec\", \"username\": \"janez\"}")))
    @ApiResponse(responseCode = "401", description = "Missing or invalid JWT")
    public ResponseEntity<Map<String, Object>> getUserStatus(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseServiceKey);
        headers.set("Authorization", "Bearer " + supabaseServiceKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Object[]> response = restTemplate.exchange(
                supabaseUrl + "/rest/v1/profili?id=eq." + userId + "&select=username,vloga,ucni_tip,vark_visual,vark_auditory,vark_reading,vark_kinesthetic,xp,nivo",
                HttpMethod.GET,
                entity,
                Object[].class
        );

        Object[] results = response.getBody();
        if (results != null && results.length > 0) {
            @SuppressWarnings("unchecked")
            Map<String, Object> profil = (Map<String, Object>) results[0];
            boolean isNewUser = profil.get("username") == null;
            return ResponseEntity.ok(Map.of(
                    "isNewUser", isNewUser,
                    "vloga", profil.get("vloga") != null ? profil.get("vloga") : "ucenec",
                    "username", profil.get("username") != null ? profil.get("username") : "",
                    "ucniTip", profil.get("ucni_tip") != null ? profil.get("ucni_tip") : "",
                    "varkVisual",      profil.getOrDefault("vark_visual",      0),
                    "varkAuditory",    profil.getOrDefault("vark_auditory",    0),
                    "varkReading",     profil.getOrDefault("vark_reading",     0),
                    "varkKinesthetic", profil.getOrDefault("vark_kinesthetic", 0),
                    "xp",   profil.getOrDefault("xp",   0),
                    "nivo", profil.getOrDefault("nivo", 1)
            ));
        }
        return ResponseEntity.ok(Map.of("isNewUser", true, "vloga", "ucenec", "username", ""));
    }

    @DeleteMapping("/me")
    @Operation(summary = "Delete current user", description = "Deletes the authenticated user from Supabase Auth and their profile data.")
    @ApiResponse(responseCode = "204", description = "Account deleted")
    @ApiResponse(responseCode = "401", description = "Missing or invalid JWT")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseServiceKey);
        headers.set("Authorization", "Bearer " + supabaseServiceKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        restTemplate.exchange(
                supabaseUrl + "/auth/v1/admin/users/" + userId,
                HttpMethod.DELETE,
                entity,
                Void.class
        );

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/me/complete-registration")
    @Operation(summary = "Complete user registration", description = "Sets the username and role (ucenec/ucitelj) on the user's Supabase profile. " + "Called once after first Google OAuth login.")
    @ApiResponse(responseCode = "200", description = "Registration completed", content = @Content(schema = @Schema(example = "{\"success\": true, \"vloga\": \"ucenec\"}")))
    @ApiResponse(responseCode = "401", description = "Missing or invalid JWT")
    public ResponseEntity<Map<String, Object>> completeRegistration(
            @AuthenticationPrincipal Jwt jwt,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Username and role selection",
                content = @Content(schema = @Schema(example = "{\"username\": \"janez\", \"vloga\": \"ucenec\"}"))
            )
            @RequestBody Map<String, String> body) {

        String userId = jwt.getSubject();
        String username = body.get("username");
        String vloga = body.get("vloga");

        RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory());
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseServiceKey);
        headers.set("Authorization", "Bearer " + supabaseServiceKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Prefer", "return=minimal");

        Map<String, String> updateBody = "ucitelj".equals(vloga)
                ? Map.of("username", username, "vloga", vloga, "ucni_tip", "uncategorized")
                : Map.of("username", username, "vloga", vloga);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(updateBody, headers);

        restTemplate.exchange(
                supabaseUrl + "/rest/v1/profili?id=eq." + userId,
                HttpMethod.PATCH,
                entity,
                Void.class
        );
        return ResponseEntity.ok(Map.of("success", true, "vloga", vloga));
    }

    @GetMapping("/leaderboard")
    @Operation(summary = "Get XP leaderboard", description = "Returns all students ranked by total XP descending. The current user is marked with isMe=true.")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard(@AuthenticationPrincipal Jwt jwt) {
        UUID meId = UUID.fromString(jwt.getSubject());
        List<Profil> students = profilRepository.findByVlogaOrderByXpDesc("ucenec");

        // Bulk-fetch all quiz results for these students (single query)
        List<UUID> studentIds = students.stream().map(Profil::getId).toList();
        List<QuizResult> allResults = studentIds.isEmpty()
                ? List.of()
                : quizResultRepository.findByUporabnikIdIn(studentIds);

        // Group results by student
        java.util.Map<UUID, List<QuizResult>> resultsByStudent = allResults.stream()
                .collect(java.util.stream.Collectors.groupingBy(QuizResult::getUporabnikId));

        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < students.size(); i++) {
            Profil p = students.get(i);
            List<QuizResult> studentResults = resultsByStudent.getOrDefault(p.getId(), List.of());
            int quizzesTaken = studentResults.size();
            int avgScore = quizzesTaken == 0 ? 0 : (int) Math.round(
                    studentResults.stream()
                            .mapToDouble(r -> r.getSkupajVprasanj() > 0
                                    ? (double) r.getTocke() / r.getSkupajVprasanj() * 100 : 0)
                            .average().orElse(0));
            result.add(Map.of(
                    "rank", i + 1,
                    "username", p.getUsername() != null ? p.getUsername() : "—",
                    "xp", p.getXp() != null ? p.getXp() : 0,
                    "nivo", p.getNivo() != null ? p.getNivo() : 1,
                    "quizzesTaken", quizzesTaken,
                    "avgScore", avgScore,
                    "isMe", p.getId().equals(meId)
            ));
        }
        return ResponseEntity.ok(result);
    }
}
