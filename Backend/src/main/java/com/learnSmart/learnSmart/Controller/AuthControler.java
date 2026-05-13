package com.learnSmart.learnSmart.Controller;

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
public class AuthControler {

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_SERVICE_KEY}")
    private String supabaseServiceKey;

    @GetMapping("/me")
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
    public ResponseEntity<Map<String, Object>> completeRegistration(
            @AuthenticationPrincipal Jwt jwt,
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