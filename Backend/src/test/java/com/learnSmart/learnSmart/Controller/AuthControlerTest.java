package com.learnSmart.learnSmart.Controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControlerTest {

    @InjectMocks
    private AuthControler authControler;

    @Mock
    private Jwt jwt;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authControler, "supabaseUrl", "https://test.supabase.co");
        ReflectionTestUtils.setField(authControler, "supabaseServiceKey", "test-key");
    }

    @Test
    void getCurrentUser_returnsUserData() {
        when(jwt.getSubject()).thenReturn("user-123");
        when(jwt.getClaimAsString("email")).thenReturn("test@example.com");
        when(jwt.getClaimAsMap("user_metadata")).thenReturn(Map.of("full_name", "Test User"));

        Map<String, Object> result = authControler.getCurrentUser(jwt);

        assertEquals("user-123", result.get("id"));
        assertEquals("test@example.com", result.get("email"));
        assertEquals("Test User", result.get("name"));
    }

    @Test
    void getCurrentUser_handlesNullMetadata() {
        when(jwt.getSubject()).thenReturn("user-123");
        when(jwt.getClaimAsString("email")).thenReturn("test@example.com");
        when(jwt.getClaimAsMap("user_metadata")).thenReturn(null);

        Map<String, Object> result = authControler.getCurrentUser(jwt);

        assertEquals("", result.get("name"));
    }

    @Test
    void getCurrentUser_handlesNullEmail() {
        when(jwt.getSubject()).thenReturn("user-123");
        when(jwt.getClaimAsString("email")).thenReturn(null);
        when(jwt.getClaimAsMap("user_metadata")).thenReturn(null);

        Map<String, Object> result = authControler.getCurrentUser(jwt);

        assertEquals("", result.get("email"));
    }

    @Test
    void getUserStatus_throwsWhenSupabaseUnavailable() {
        when(jwt.getSubject()).thenReturn("user-123");

        assertThrows(Exception.class, () ->
                authControler.getUserStatus(jwt)
        );
    }

    @Test
    void completeRegistration_throwsWhenSupabaseUnavailable() {
        when(jwt.getSubject()).thenReturn("user-123");
        Map<String, String> body = Map.of("username", "testuser", "vloga", "ucenec");

        assertThrows(Exception.class, () ->
                authControler.completeRegistration(jwt, body)
        );
    }
}