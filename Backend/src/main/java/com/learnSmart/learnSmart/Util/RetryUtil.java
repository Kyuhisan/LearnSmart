package com.learnSmart.learnSmart.Util;

import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.Callable;

@Slf4j
public class RetryUtil {

    private RetryUtil() {}

    public static <T> T executeWithRetry(Callable<T> action, String operationName, int maxAttempts) {
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return action.call();
            } catch(Exception e) {
                log.warn("{} failed (attempt {}/{}): {}", operationName, attempt, maxAttempts, e.getMessage());

                if (attempt < maxAttempts) {
                    try {
                        Thread.sleep(attempt * 10000L);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        return null;
                    }
                }
            }
        }
        return null;
    }
}
