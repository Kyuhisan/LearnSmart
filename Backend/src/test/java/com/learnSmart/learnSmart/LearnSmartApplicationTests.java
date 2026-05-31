package com.learnSmart.learnSmart;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("local")
@TestPropertySource(properties = {
		"GMAIL_USERNAME=test@gmail.com",
		"GMAIL_APP_PASSWORD=test-password"
})
class LearnSmartApplicationTests {

	@Test
	void contextLoads() {
	}

}
