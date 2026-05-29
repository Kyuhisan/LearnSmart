package com.learnSmart.learnSmart.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.OffsetDateTime;
import java.util.Map;

@Service
public class UserService {

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_SERVICE_KEY}")
    private String supabaseServiceKey;

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseServiceKey);
        headers.set("Authorization", "Bearer " + supabaseServiceKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Prefer", "return=minimal");
        return headers;
    }

    public void updateLearningStyle(String userId, String style,
            int visual, int auditory, int reading, int kinesthetic) {
        RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory());

        try {
            Map<String, Object> updateBody = Map.of(
                    "ucni_tip", style,
                    "vark_visual", visual,
                    "vark_auditory", auditory,
                    "vark_reading", reading,
                    "vark_kinesthetic", kinesthetic
            );
            restTemplate.exchange(
                    supabaseUrl + "/rest/v1/profili?id=eq." + userId,
                    HttpMethod.PATCH,
                    new HttpEntity<>(updateBody, buildHeaders()),
                    Void.class
            );

            Map<String, String> historyBody = Map.of(
                    "uporabik_id", userId,
                    "ucni_tip", style,
                    "ustvarjen_ob", OffsetDateTime.now().toString(),
                    "vir", "QUESTIONNAIRE"
            );
            restTemplate.exchange(
                    supabaseUrl + "/rest/v1/ucni_tip_zgodovina",
                    HttpMethod.POST,
                    new HttpEntity<>(historyBody, buildHeaders()),
                    Void.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to update learning style: " + e.getMessage());
        }
    }
}
