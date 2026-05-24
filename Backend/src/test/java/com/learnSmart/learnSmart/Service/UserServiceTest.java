package com.learnSmart.learnSmart.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(userService, "supabaseUrl", "https://test.supabase.co");
        ReflectionTestUtils.setField(userService, "supabaseServiceKey", "test-key");
    }

    @Test
    void updateLearningStyle_throwsWhenSupabaseUnavailable() {
        assertThrows(RuntimeException.class, () ->
                userService.updateLearningStyle("user-123", "VISUAL")
        );
    }

    @Test
    void updateLearningStyle_throwsWithInvalidUrl() {
        ReflectionTestUtils.setField(userService, "supabaseUrl", "invalid-url");

        assertThrows(RuntimeException.class, () ->
                userService.updateLearningStyle("user-123", "KINESTHETIC")
        );
    }
}