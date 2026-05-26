package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.Predmet.VpisRequestDTO;
import com.learnSmart.learnSmart.DTO.Predmet.VpisResponseDTO;
import com.learnSmart.learnSmart.Service.VpisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/vpisi")
@RequiredArgsConstructor
public class VpisController {

    private final VpisService vpisService;

    // Vpis z kodo
    @PostMapping("/vpis")
    public ResponseEntity<?> vpisZKodo(
            @RequestBody VpisRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        UUID ucenecId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(vpisService.vpisZKodo(dto.getKodaVpisa(), ucenecId));
    }

    // Moji vpisi
    @GetMapping("/moji")
    public ResponseEntity<List<VpisResponseDTO>> getMojiVpisi(
            @AuthenticationPrincipal Jwt jwt) {
        UUID ucenecId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(vpisService.getMojiVpisi(ucenecId));
    }

    // Posodobi cas
    @PatchMapping("/{predmetId}/cas")
    public ResponseEntity<?> posodobiCas(
            @PathVariable UUID predmetId,
            @RequestBody Map<String, Integer> body,
            @AuthenticationPrincipal Jwt jwt) {
        UUID ucenecId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(vpisService.posodobiCas(predmetId, ucenecId, body.get("cas")));
    }

    // Odjava
    @DeleteMapping("/{predmetId}")
    public ResponseEntity<?> odjava(
            @PathVariable UUID predmetId,
            @AuthenticationPrincipal Jwt jwt) {
        UUID ucenecId = UUID.fromString(jwt.getSubject());
        vpisService.odjava(predmetId, ucenecId);
        return ResponseEntity.noContent().build();
    }
}