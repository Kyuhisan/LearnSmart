package com.learnSmart.learnSmart.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Auth", description = "User identity and registration endpoints — JWT Bearer required")
public class AuthControler {

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
                supabaseUrl + "/rest/v1/profili?id=eq." + userId + "&select=username,vloga",
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
                    "username", profil.get("username") != null ? profil.get("username") : ""
            ));
        }
        return ResponseEntity.ok(Map.of("isNewUser", true, "vloga", "ucenec", "username", ""));
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
}
