package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.Service.PredmetService;
import com.learnSmart.learnSmart.DTO.Predmet.PredmetRequestDTO;
import com.learnSmart.learnSmart.DTO.Predmet.PredmetResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/moduli")
@RequiredArgsConstructor
public class PredmetController {

    private final PredmetService predmetService;

    @GetMapping
    public ResponseEntity<List<PredmetResponseDTO>> getObjavljene() {
        return ResponseEntity.ok(predmetService.getObjavljene());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PredmetResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(predmetService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ucitelj')")
    public ResponseEntity<PredmetResponseDTO> ustvari(
            @Valid @RequestBody PredmetRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(predmetService.ustvari(dto, uciteljId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ucitelj')")
    public ResponseEntity<PredmetResponseDTO> uredi(
            @PathVariable UUID id,
            @Valid @RequestBody PredmetRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(predmetService.uredi(id, dto, uciteljId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ucitelj')")
    public ResponseEntity<Void> izbrisi(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        predmetService.izbrisi(id, uciteljId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/objavi")
    @PreAuthorize("hasAuthority('ucitelj')")
    public ResponseEntity<PredmetResponseDTO> objavi(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(predmetService.objavi(id, uciteljId));
    }
}
