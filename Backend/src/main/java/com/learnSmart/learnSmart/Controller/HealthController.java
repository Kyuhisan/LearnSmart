package com.learnSmart.learnSmart.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@Tag(name = "Health", description = "Service health check — no authentication required")
public class HealthController {

    @GetMapping("/health")
    @SecurityRequirements
    @Operation(summary = "Health check", description = "Returns UP when the service is running. Used by Render for health monitoring.")
    @ApiResponse(responseCode = "200", description = "Service is healthy", content = @Content(schema = @Schema(example = "{\"status\": \"UP\"}")))
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
