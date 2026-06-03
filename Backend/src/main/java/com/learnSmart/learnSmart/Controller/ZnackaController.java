package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.Znacka.ZnackaResponseDTO;
import com.learnSmart.learnSmart.Model.Znacka;
import com.learnSmart.learnSmart.Repository.ZnackaRepository;
import com.learnSmart.learnSmart.Service.ZnackaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/znacke")
@RequiredArgsConstructor
public class ZnackaController {
    private final ZnackaService znackaService;

    @GetMapping("/moje")
    public ResponseEntity<List<ZnackaResponseDTO>> findAllByProfilId(@AuthenticationPrincipal Jwt jwt) {
        UUID profilId = UUID.fromString(jwt.getSubject());

        return ResponseEntity.ok(znackaService.findAll(profilId));
    }
}
