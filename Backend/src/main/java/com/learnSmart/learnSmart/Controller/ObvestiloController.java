package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.Obvestilo.ObvestiloResponseDTO;
import com.learnSmart.learnSmart.Service.ObvestiloService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/obvestila")
@RequiredArgsConstructor
public class ObvestiloController {

    private final ObvestiloService obvestiloService;

    @GetMapping
    public ResponseEntity<List<ObvestiloResponseDTO>> getMoja(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(obvestiloService.getMoja(userId));
    }

    @GetMapping("/stevilo")
    public ResponseEntity<Long> getStevilo(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(obvestiloService.getNeprebranaStevilo(userId));
    }

    @PatchMapping("/{id}/prebrano")
    public ResponseEntity<?> oznациPrebrano(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt) {
        obvestiloService.oznaciPrebrano(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/vse-prebrano")
    public ResponseEntity<?> oznациVsePrebrano(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        obvestiloService.oznaciVsePrebrano(userId);
        return ResponseEntity.ok().build();
    }
}