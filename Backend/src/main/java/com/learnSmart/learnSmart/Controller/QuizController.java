package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.Quiz.*;
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
        return profilRepository.findById(userId).map(Profil::getVloga).orElse("");
    }

    @PostMapping("/generiraj")
    public ResponseEntity<?> generiraj(@RequestBody QuizGenerateRequestDTO dto,
                                       @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        List<QuizGeminiService.GeneratedQuestion> vprasanja =
                quizService.generirajVprasanja(dto.getPredmetId(), dto.getSteviloVprasanj(), dto.getTezavnost());
        return ResponseEntity.ok(vprasanja);
    }

    // ── STARO: ohranjen za backward compatibility ──
    @PostMapping("/shrani")
    public ResponseEntity<?> shrani(@RequestBody QuizSaveRequestDTO dto,
                                    @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        return ResponseEntity.ok(quizService.shraniKviz(
                dto.getPredmetId(), dto.getNaziv(), dto.getCasIzvajanja(), dto.getVprasanja()));
    }

    // ── NOVO: Shrani odobrena vprašanja v banko ──
    @PostMapping("/vprasanja/banka")
    public ResponseEntity<?> shraniVBanko(@RequestBody QuestionSaveRequestDTO dto,
                                          @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        return ResponseEntity.ok(quizService.shraniVprasanjaVBanko(dto.getPredmetId(), dto.getVprasanja()));
    }

    // ── NOVO: Pridobi vsa vprašanja v banki za predmet ──
    @GetMapping("/vprasanja/banka/{predmetId}")
    public ResponseEntity<List<QuestionResponseDTO>> getBanka(@PathVariable UUID predmetId,
                                                              @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(quizService.getVprasanjaBanka(predmetId));
    }

    // ── NOVO: Ustvari nov kviz iz izbranih vprašanj ──
    @PostMapping("/ustvari")
    public ResponseEntity<?> ustvari(@RequestBody QuizCreateRequestDTO dto,
                                     @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        return ResponseEntity.ok(quizService.ustvariKviz(
                dto.getPredmetId(), dto.getNaziv(), dto.getCasIzvajanja(), dto.getVprasanjaIds()));
    }

    // ── NOVO: Dodaj vprašanje iz banke na kviz ──
    @PostMapping("/{kvizId}/dodaj/{vprasanjeId}")
    public ResponseEntity<?> dodajVprasanje(@PathVariable UUID kvizId,
                                            @PathVariable UUID vprasanjeId, @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        quizService.dodajVprasanjeNaKviz(kvizId, vprasanjeId);
        return ResponseEntity.ok().build();
    }

    // ── NOVO: Odstrani vprašanje iz kviza (vrne v banko) ──
    @PatchMapping("/vprasanje/{vprasanjeId}/odstrani")
    public ResponseEntity<?> odstraniIzKviza(@PathVariable UUID vprasanjeId,
                                             @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        quizService.odstraniVprasanjeIzKviza(vprasanjeId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/objavi")
    public ResponseEntity<?> objavi(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        return ResponseEntity.ok(quizService.objaviKviz(id));
    }

    @GetMapping("/predmet/{predmetId}")
    public ResponseEntity<List<QuizResponseDTO>> getKvizi(@PathVariable UUID predmetId) {
        return ResponseEntity.ok(quizService.getKviziZaPredmet(predmetId));
    }

    @DeleteMapping("/vprasanje/{id}")
    public ResponseEntity<?> izbrisiVprasanje(@PathVariable UUID id,
                                              @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        quizService.izbrisiVprasanje(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> izbrisiKviz(@PathVariable UUID id,
                                         @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).body(DOSTOP_ZAVRNJEN);
        quizService.izbrisiKviz(id, uciteljId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{kvizId}/vprasanja")
    public ResponseEntity<List<QuestionResponseDTO>> getVprasanja(@PathVariable UUID kvizId) {
        return ResponseEntity.ok(quizService.getVprasanjaZaKviz(kvizId));
    }

    @GetMapping("/moji")
    public ResponseEntity<List<QuizResponseDTO>> getMojiKvizi(@AuthenticationPrincipal Jwt jwt) {
        UUID ucenecId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(quizService.getKviziZaUcenca(ucenecId));
    }

    @PostMapping("/{kvizId}/rezultat")
    public ResponseEntity<?> shraniRezultat(@PathVariable UUID kvizId,
                                            @RequestBody QuizResultRequestDTO dto, @AuthenticationPrincipal Jwt jwt) {
        UUID ucenecId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(quizService.shraniRezultat(kvizId, ucenecId, dto));
    }

    @GetMapping("/rezultati/moji")
    public ResponseEntity<?> getMojiRezultati(@AuthenticationPrincipal Jwt jwt) {
        UUID ucenecId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(quizService.getMojiRezultati(ucenecId));
    }

    @GetMapping("/ucitelj/vsi")
    public ResponseEntity<List<QuizResponseDTO>> getKviziUcitelja(@AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(quizService.getKviziZaUcitelja(uciteljId));
    }

    @GetMapping("/ucitelj/analyticsStats")
    public ResponseEntity<AnalyticsStatsDTO> getAnalyticsStats(@AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(quizService.getAnalyticsStatsZaUcitelja(uciteljId));
    }

    @GetMapping("/ucitelj/analyticsStats/{predmetId}")
    public ResponseEntity<AnalyticsStatsDTO> getAnalyticsStatsByModule(@PathVariable UUID predmetId,
                                                                        @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(quizService.getAnalyticsStatsZaPredmet(predmetId));
    }

    @GetMapping("/ucitelj/topStudents")
    public ResponseEntity<List<TopStudentDTO>> getTopStudents(@AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        if (!getVloga(uciteljId).equals(VLOGA_UCITELJ)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(quizService.getTopStudentsZaUcitelja(uciteljId));
    }
}