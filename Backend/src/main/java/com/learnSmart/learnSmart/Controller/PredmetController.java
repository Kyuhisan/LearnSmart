package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.Model.Profil;
import com.learnSmart.learnSmart.Repository.ProfilRepository;
import com.learnSmart.learnSmart.Service.PredmetService;
import com.learnSmart.learnSmart.DTO.Predmet.PredmetRequestDTO;
import com.learnSmart.learnSmart.DTO.Predmet.PredmetResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    private final ProfilRepository profilRepository;

    private static final String VLOGA_UCITELJ = "ucitelj";
    private static final String DOSTOP_ZAVRNJEN = "Dostop zavrnjen";

    private String getVloga(UUID userId) {
        return profilRepository.findById(userId)
                .map(Profil::getVloga)
                .orElse("");
    }

    @GetMapping
    public ResponseEntity<List<PredmetResponseDTO>> getObjavljene() {
        return ResponseEntity.ok(predmetService.getObjavljene());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PredmetResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(predmetService.getById(id));
    }

    @GetMapping("/moji")
    public ResponseEntity<?> getMoji(@AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) {
            return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        }
        return ResponseEntity.ok(predmetService.getMoji(uciteljId));
    }

    @PostMapping
    public ResponseEntity<?> ustvari(
            @Valid @RequestBody PredmetRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) {
            return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        }
        return ResponseEntity.ok(predmetService.ustvari(dto, uciteljId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> uredi(
            @PathVariable UUID id,
            @Valid @RequestBody PredmetRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) {
            return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        }
        return ResponseEntity.ok(predmetService.uredi(id, dto, uciteljId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> izbrisi(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) {
            return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        }
        predmetService.izbrisi(id, uciteljId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/objavi")
    public ResponseEntity<?> objavi(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) {
            return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        }
        return ResponseEntity.ok(predmetService.objavi(id, uciteljId));
    }
}