package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.Quiz.*;
import com.learnSmart.learnSmart.Model.Profil;
import com.learnSmart.learnSmart.Repository.ProfilRepository;
import com.learnSmart.learnSmart.Service.QuizService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizControllerTest {

    @Mock private QuizService quizService;
    @Mock private ProfilRepository profilRepository;
    @Mock private Jwt jwt;

    @InjectMocks
    private QuizController quizController;

    private UUID uciteljId;
    private UUID ucenecId;
    private UUID predmetId;
    private UUID kvizId;
    private UUID vprasanjeId;
    private Profil ucitelj;
    private Profil ucenec;
    private QuizResponseDTO quizResponseDTO;
    private QuestionResponseDTO questionResponseDTO;

    @BeforeEach
    void setUp() {
        uciteljId   = UUID.randomUUID();
        ucenecId    = UUID.randomUUID();
        predmetId   = UUID.randomUUID();
        kvizId      = UUID.randomUUID();
        vprasanjeId = UUID.randomUUID();

        ucitelj = new Profil();
        ucitelj.setId(uciteljId);
        ucitelj.setVloga("ucitelj");

        ucenec = new Profil();
        ucenec.setId(ucenecId);
        ucenec.setVloga("ucenec");

        quizResponseDTO = new QuizResponseDTO();
        quizResponseDTO.setId(kvizId);
        quizResponseDTO.setNaziv("Test Quiz");
        quizResponseDTO.setStatus("DRAFT");

        questionResponseDTO = new QuestionResponseDTO();
        questionResponseDTO.setId(vprasanjeId);
        questionResponseDTO.setBesediloVprasanja("What is 2+2?");
    }

    // ── generiraj ─────────────────────────────────────────────────────────────

    @Test
    void generiraj_teacherGenerates() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        when(quizService.generirajVprasanja(any(), anyInt(), any())).thenReturn(List.of());

        QuizGenerateRequestDTO dto = new QuizGenerateRequestDTO();
        dto.setPredmetId(predmetId); dto.setSteviloVprasanj(5); dto.setTezavnost("MEDIUM");

        ResponseEntity<?> response = quizController.generiraj(dto, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void generiraj_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        QuizGenerateRequestDTO dto = new QuizGenerateRequestDTO();

        ResponseEntity<?> response = quizController.generiraj(dto, jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    // ── shraniVBanko ──────────────────────────────────────────────────────────

    @Test
    void shraniVBanko_teacherSaves() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        when(quizService.shraniVprasanjaVBanko(any(), any())).thenReturn(List.of(questionResponseDTO));

        QuestionSaveRequestDTO dto = new QuestionSaveRequestDTO();
        dto.setPredmetId(predmetId); dto.setVprasanja(List.of());

        ResponseEntity<?> response = quizController.shraniVBanko(dto, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void shraniVBanko_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        ResponseEntity<?> response = quizController.shraniVBanko(new QuestionSaveRequestDTO(), jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    // ── getBanka ──────────────────────────────────────────────────────────────

    @Test
    void getBanka_teacherGetsQuestions() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        when(quizService.getVprasanjaBanka(predmetId)).thenReturn(List.of(questionResponseDTO));

        ResponseEntity<List<QuestionResponseDTO>> response = quizController.getBanka(predmetId, jwt);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getBanka_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        ResponseEntity<List<QuestionResponseDTO>> response = quizController.getBanka(predmetId, jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    // ── ustvari ───────────────────────────────────────────────────────────────

    @Test
    void ustvari_teacherCreatesQuiz() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        when(quizService.ustvariKviz(any(), any(), any(), any())).thenReturn(quizResponseDTO);

        QuizCreateRequestDTO dto = new QuizCreateRequestDTO();
        dto.setPredmetId(predmetId); dto.setNaziv("Quiz"); dto.setCasIzvajanja(10); dto.setVprasanjaIds(List.of());

        ResponseEntity<?> response = quizController.ustvari(dto, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void ustvari_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        ResponseEntity<?> response = quizController.ustvari(new QuizCreateRequestDTO(), jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    // ── dodajVprasanje ────────────────────────────────────────────────────────

    @Test
    void dodaj_teacherAddsQuestion() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        doNothing().when(quizService).dodajVprasanjeNaKviz(kvizId, vprasanjeId);

        ResponseEntity<?> response = quizController.dodajVprasanje(kvizId, vprasanjeId, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void dodaj_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        ResponseEntity<?> response = quizController.dodajVprasanje(kvizId, vprasanjeId, jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    // ── odstraniIzKviza ───────────────────────────────────────────────────────

    @Test
    void odstrani_teacherRemovesQuestion() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        doNothing().when(quizService).odstraniVprasanjeIzKviza(vprasanjeId);

        ResponseEntity<?> response = quizController.odstraniIzKviza(vprasanjeId, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void odstrani_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        ResponseEntity<?> response = quizController.odstraniIzKviza(vprasanjeId, jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    // ── objavi ────────────────────────────────────────────────────────────────

    @Test
    void objavi_teacherPublishes() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        when(quizService.objaviKviz(kvizId)).thenReturn(quizResponseDTO);

        ResponseEntity<?> response = quizController.objavi(kvizId, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void objavi_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        ResponseEntity<?> response = quizController.objavi(kvizId, jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    // ── getKvizi ──────────────────────────────────────────────────────────────

    @Test
    void getKvizi_returnsQuizzes() {
        when(quizService.getKviziZaPredmet(predmetId)).thenReturn(List.of(quizResponseDTO));

        ResponseEntity<List<QuizResponseDTO>> response = quizController.getKvizi(predmetId);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    // ── izbrisiVprasanje ──────────────────────────────────────────────────────

    @Test
    void izbrisi_teacherDeletes() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        doNothing().when(quizService).izbrisiVprasanje(vprasanjeId);

        ResponseEntity<?> response = quizController.izbrisiVprasanje(vprasanjeId, jwt);

        assertEquals(204, response.getStatusCode().value());
    }

    @Test
    void izbrisi_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        ResponseEntity<?> response = quizController.izbrisiVprasanje(vprasanjeId, jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    // ── getVprasanja ──────────────────────────────────────────────────────────

    @Test
    void getVprasanja_returnsQuestions() {
        when(quizService.getVprasanjaZaKviz(kvizId)).thenReturn(List.of(questionResponseDTO));

        ResponseEntity<List<QuestionResponseDTO>> response = quizController.getVprasanja(kvizId);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    // ── getMojiKvizi ──────────────────────────────────────────────────────────

    @Test
    void getMojiKvizi_returnsStudentQuizzes() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(quizService.getKviziZaUcenca(ucenecId)).thenReturn(List.of(quizResponseDTO));

        ResponseEntity<List<QuizResponseDTO>> response = quizController.getMojiKvizi(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    // ── shraniRezultat ────────────────────────────────────────────────────────

    @Test
    void shraniRezultat_savesResult() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        QuizResultRequestDTO dto = new QuizResultRequestDTO();
        dto.setOdgovori(List.of(2)); dto.setCasResevanjaS(60);
        QuizResultResponseDTO resultDTO = new QuizResultResponseDTO();
        when(quizService.shraniRezultat(kvizId, ucenecId, dto)).thenReturn(resultDTO);

        ResponseEntity<?> response = quizController.shraniRezultat(kvizId, dto, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    // ── getMojiRezultati ──────────────────────────────────────────────────────

    @Test
    void getMojiRezultati_returnsResults() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(quizService.getMojiRezultati(ucenecId)).thenReturn(List.of());

        ResponseEntity<?> response = quizController.getMojiRezultati(jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    // ── getKviziUcitelja ──────────────────────────────────────────────────────

    @Test
    void getKviziUcitelja_teacherGetsQuizzes() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        when(quizService.getKviziZaUcitelja(uciteljId)).thenReturn(List.of(quizResponseDTO));

        ResponseEntity<List<QuizResponseDTO>> response = quizController.getKviziUcitelja(jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void getKviziUcitelja_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        ResponseEntity<List<QuizResponseDTO>> response = quizController.getKviziUcitelja(jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    // ── getTopStudents ────────────────────────────────────────────────────────

    @Test
    void getTopStudents_teacherGetsStudents() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        when(quizService.getTopStudentsZaUcitelja(uciteljId)).thenReturn(List.of());

        ResponseEntity<List<TopStudentDTO>> response = quizController.getTopStudents(jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void getTopStudents_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        ResponseEntity<List<TopStudentDTO>> response = quizController.getTopStudents(jwt);

        assertEquals(403, response.getStatusCode().value());
    }
    // ── getProgressStats ──────────────────────────────────────────────────────

    @Test
    void getProgressStats_studentGets200() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        ProgressStatsDTO dto = new ProgressStatsDTO(List.of(), List.of(), 0, 0);
        when(quizService.getProgressStatsZaUcenca(ucenecId)).thenReturn(dto);

        ResponseEntity<ProgressStatsDTO> response = quizController.getProgressStats(jwt);

        assertEquals(200, response.getStatusCode().value());
    }

// ── getWeeklyStats ────────────────────────────────────────────────────────

    @Test
    void getWeeklyStats_teacherGets200() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        WeeklyStatsDTO dto = new WeeklyStatsDTO(List.of());
        when(quizService.getWeeklyStatsZaProfesoria(uciteljId, null)).thenReturn(dto);

        ResponseEntity<WeeklyStatsDTO> response = quizController.getWeeklyStats(null, jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void getWeeklyStats_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        ResponseEntity<WeeklyStatsDTO> response = quizController.getWeeklyStats(null, jwt);

        assertEquals(403, response.getStatusCode().value());
    }

    @Test
    void getWeeklyStats_teacherFiltersByModule() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        WeeklyStatsDTO dto = new WeeklyStatsDTO(List.of());
        when(quizService.getWeeklyStatsZaProfesoria(uciteljId, predmetId)).thenReturn(dto);

        ResponseEntity<WeeklyStatsDTO> response = quizController.getWeeklyStats(predmetId, jwt);

        assertEquals(200, response.getStatusCode().value());
        verify(quizService).getWeeklyStatsZaProfesoria(uciteljId, predmetId);
    }

// ── getProfActivity ───────────────────────────────────────────────────────

    @Test
    void getProfActivity_teacherGets200() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(profilRepository.findById(uciteljId)).thenReturn(Optional.of(ucitelj));
        when(quizService.getActivityZaProfesoria(uciteljId)).thenReturn(List.of());

        ResponseEntity<List<ActivityItemDTO>> response = quizController.getProfActivity(jwt);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void getProfActivity_studentGets403() {
        when(jwt.getSubject()).thenReturn(ucenecId.toString());
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(ucenec));

        ResponseEntity<List<ActivityItemDTO>> response = quizController.getProfActivity(jwt);

        assertEquals(403, response.getStatusCode().value());
    }
}