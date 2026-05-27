package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.Quiz.QuestionResponseDTO;
import com.learnSmart.learnSmart.DTO.Quiz.QuizGenerateRequestDTO;
import com.learnSmart.learnSmart.DTO.Quiz.QuizResponseDTO;
import com.learnSmart.learnSmart.DTO.Quiz.QuizSaveRequestDTO;
import com.learnSmart.learnSmart.DTO.Quiz.QuizResultRequestDTO;
import com.learnSmart.learnSmart.Model.Profil;
import com.learnSmart.learnSmart.Repository.ProfilRepository;
import com.learnSmart.learnSmart.Service.QuizGeminiService;
import com.learnSmart.learnSmart.Service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/kvizi")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final ProfilRepository profilRepository;

    private static final String VLOGA_UCITELJ = "ucitelj";
    private static final String DOSTOP_ZAVRNJEN = "Dostop zavrnjen";

    private String getVloga(UUID userId) {
        return profilRepository.findById(userId)
                .map(Profil::getVloga)
                .orElse("");
    }

    @PostMapping("/generiraj")
    public ResponseEntity<?> generiraj(
            @RequestBody QuizGenerateRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) {
            return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        }
        List<QuizGeminiService.GeneratedQuestion> vprasanja =
                quizService.generirajVprasanja(dto.getPredmetId(), dto.getSteviloVprasanj(), dto.getTezavnost());
        return ResponseEntity.ok(vprasanja);
    }

    @PostMapping("/shrani")
    public ResponseEntity<?> shrani(
            @RequestBody QuizSaveRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) {
            return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        }
        QuizResponseDTO kviz = quizService.shraniKviz(
                dto.getPredmetId(),
                dto.getNaziv(),
                dto.getCasIzvajanja(),
                dto.getVprasanja()
        );
        return ResponseEntity.ok(kviz);
    }

    @PatchMapping("/{id}/objavi")
    public ResponseEntity<?> objavi(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) {
            return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        }
        return ResponseEntity.ok(quizService.objaviKviz(id));
    }

    @GetMapping("/predmet/{predmetId}")
    public ResponseEntity<List<QuizResponseDTO>> getKvizi(@PathVariable UUID predmetId) {
        return ResponseEntity.ok(quizService.getKviziZaPredmet(predmetId));
    }

    @DeleteMapping("/vprasanje/{id}")
    public ResponseEntity<?> izbrisiVprasanje(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) {
            return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        }
        quizService.izbrisiVprasanje(id);
        return ResponseEntity.noContent().build();
    }
    // Kvizi za ucenca in prof
    @GetMapping("/{kvizId}/vprasanja")
    public ResponseEntity<List<QuestionResponseDTO>> getVprasanja(@PathVariable UUID kvizId) {
        return ResponseEntity.ok(quizService.getVprasanjaZaKviz(kvizId));
    }

    // Kvizi za ucenca
    @GetMapping("/moji")
    public ResponseEntity<List<QuizResponseDTO>> getMojiKvizi(
            @AuthenticationPrincipal Jwt jwt) {
        UUID ucenecId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(quizService.getKviziZaUcenca(ucenecId));
    }
    @PostMapping("/{kvizId}/rezultat")
    public ResponseEntity<?> shraniRezultat(
            @PathVariable UUID kvizId,
            @RequestBody QuizResultRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        UUID ucenecId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(quizService.shraniRezultat(kvizId, ucenecId, dto));
    }

    // Zgodovina rezultatov ucenca
    @GetMapping("/rezultati/moji")
    public ResponseEntity<?> getMojiRezultati(
            @AuthenticationPrincipal Jwt jwt) {
        UUID ucenecId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(quizService.getMojiRezultati(ucenecId));
    }
}