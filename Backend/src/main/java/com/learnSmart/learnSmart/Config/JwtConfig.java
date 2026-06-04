package com.learnSmart.learnSmart.Config;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.source.DefaultJWKSetCache;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jose.util.DefaultResourceRetriever;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;

import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Configuration
public class JwtConfig {

    private static final String SUPABASE_JWKS_URI =
            "https://xwymzxvwnneooojzouxq.supabase.co/auth/v1/.well-known/jwks.json";
    private static final String ISSUER =
            "https://xwymzxvwnneooojzouxq.supabase.co/auth/v1";

    @Bean
    public JwtDecoder jwtDecoder() throws Exception {
        // --- 1. Local source: loaded once from classpath at startup, zero network cost ---
        ClassPathResource jwksResource = new ClassPathResource("supabase-jwks.json");
        JWKSet localJwkSet;
        try (var is = jwksResource.getInputStream()) {
            localJwkSet = JWKSet.parse(new String(is.readAllBytes(), StandardCharsets.UTF_8));
        }
        ImmutableJWKSet<SecurityContext> localSource = new ImmutableJWKSet<>(localJwkSet);
        log.info("Loaded {} local JWK key(s) from classpath", localJwkSet.getKeys().size());

        // --- 2. Remote source: cached, used only when local key lookup misses (key rotation) ---
        JWKSource<SecurityContext> remoteSource = new RemoteJWKSet<>(
                new URL(SUPABASE_JWKS_URI),
                new DefaultResourceRetriever(5_000, 10_000),   // 5s connect, 10s read
                new DefaultJWKSetCache(10L, 5L, TimeUnit.MINUTES) // cache 10 min, refresh after 5
        );

        // --- 3. Combined source: local first, remote fallback on key miss ---
        JWKSource<SecurityContext> combinedSource = (jwkSelector, context) -> {
            List<JWK> keys = localSource.get(jwkSelector, context);
            if (!keys.isEmpty()) return keys;
            log.warn("Key not found in local JWK set — Supabase may have rotated keys. Falling back to remote JWKS.");
            return remoteSource.get(jwkSelector, context);
        };

        // --- 4. Build decoder using the combined source ---
        ConfigurableJWTProcessor<SecurityContext> jwtProcessor = new DefaultJWTProcessor<>();
        jwtProcessor.setJWSKeySelector(
                new JWSVerificationKeySelector<>(JWSAlgorithm.ES256, combinedSource)
        );

        NimbusJwtDecoder decoder = new NimbusJwtDecoder(jwtProcessor);
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(ISSUER)
        ));
        return decoder;
    }
}
