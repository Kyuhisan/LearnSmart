package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.Enum.LearningStyleSource;
import com.learnSmart.learnSmart.Model.Profil;
import com.learnSmart.learnSmart.Model.UcniTipZgodovina;
import com.learnSmart.learnSmart.Repository.ProfilRepository;
import com.learnSmart.learnSmart.Repository.UcniTipZgodovinaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_SERVICE_KEY}")
    private String supabaseServiceKey;

    private final UcniTipZgodovinaRepository ucniTipZgodovinaRepository;
    private final ProfilRepository profilRepository;

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

            Profil profil = profilRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new IllegalArgumentException("Profile not found."));

            UcniTipZgodovina zgodovina = new UcniTipZgodovina();
            zgodovina.setProfil(profil);
            zgodovina.setUcniTip(style);
            zgodovina.setUstvarjenOb(OffsetDateTime.now());
            zgodovina.setVir(LearningStyleSource.QUESTIONNAIRE);

            ucniTipZgodovinaRepository.save(zgodovina);

        } catch (Exception e) {
            throw new RuntimeException("Failed to update learning style: " + e.getMessage());
        }
    }
}
