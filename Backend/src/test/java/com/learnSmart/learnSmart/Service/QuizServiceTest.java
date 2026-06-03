package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Quiz.*;
import com.learnSmart.learnSmart.Model.*;
import com.learnSmart.learnSmart.Repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock private QuizGeminiService quizGeminiService;
    @Mock private QuizRepository quizRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private PredmetRepository predmetRepository;
    @Mock private VpisRepository vpisRepository;
    @Mock private QuizResultRepository quizResultRepository;
    @Mock private ProfilRepository profilRepository;
    @Mock private ObvestiloService obvestiloService;
    @Mock private ZnackaService znackaService;

    @InjectMocks
    private QuizService quizService;

    private UUID predmetId;
    private UUID kvizId;
    private UUID vprasanjeId;
    private UUID ucenecId;
    private UUID uciteljId;
    private Predmet predmet;
    private Quiz quiz;
    private Question question;
    private QuizResult quizResult;
    private Profil profil;

    @BeforeEach
    void setUp() {
        predmetId   = UUID.randomUUID();
        kvizId      = UUID.randomUUID();
        vprasanjeId = UUID.randomUUID();
        ucenecId    = UUID.randomUUID();
        uciteljId   = UUID.randomUUID();

        predmet = new Predmet();
        predmet.setId(predmetId);
        predmet.setNaziv("Test Module");
        predmet.setZdruzenTranscript("Some transcript content");
        predmet.setUciteljId(uciteljId);

        quiz = new Quiz();
        quiz.setId(kvizId);
        quiz.setNaziv("Test Quiz");
        quiz.setStatus("DRAFT");
        quiz.setCasIzvajanja(10);
        quiz.setPredmet(predmet);
        quiz.setUstvarjenOb(OffsetDateTime.now());

        question = new Question();
        question.setId(vprasanjeId);
        question.setBesediloVprasanja("What is 2+2?");
        question.setMoznosti(List.of("1", "2", "4", "5"));
        question.setIndeksPravilnegaOdgovora(2);
        question.setRazlaga("Because math.");
        question.setPredmetId(predmetId);

        quizResult = new QuizResult();
        quizResult.setId(UUID.randomUUID());
        quizResult.setQuiz(quiz);
        quizResult.setUporabnikId(ucenecId);
        quizResult.setTocke(8);
        quizResult.setSkupajVprasanj(10);
        quizResult.setOddanoOb(OffsetDateTime.now());
        quizResult.setOdgovori(List.of(0,1,2,3,0,1,2,3,0,1));
        quizResult.setCasResevanjaS(120);

        profil = new Profil();
        profil.setId(ucenecId);
        profil.setImePriimek("Test Student");
        profil.setUcniTip("visual");

        doNothing().when(znackaService)
                .awardBadge(any(), any(), anyString());
    }

    // ── generirajVprasanja ────────────────────────────────────────────────────

    @Test
    void generiraj_returnsQuestions() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));
        List<QuizGeminiService.GeneratedQuestion> generated = List.of(
                new QuizGeminiService.GeneratedQuestion("Q1", List.of("A","B","C","D"), 0, "Exp"));
        when(quizGeminiService.generirajVprasanja(any(), anyInt(), any())).thenReturn(generated);

        List<QuizGeminiService.GeneratedQuestion> result =
                quizService.generirajVprasanja(predmetId, 5, "MEDIUM");

        assertEquals(1, result.size());
        assertEquals("Q1", result.get(0).besediloVprasanja());
    }

    @Test
    void generiraj_throwsWhenModuleNotFound() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> quizService.generirajVprasanja(predmetId, 5, "MEDIUM"));
    }

    @Test
    void generiraj_throwsWhenNoTranscript() {
        predmet.setZdruzenTranscript(null);
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));

        assertThrows(RuntimeException.class,
                () -> quizService.generirajVprasanja(predmetId, 5, "MEDIUM"));
    }

    @Test
    void generiraj_throwsWhenBlankTranscript() {
        predmet.setZdruzenTranscript("   ");
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));

        assertThrows(RuntimeException.class,
                () -> quizService.generirajVprasanja(predmetId, 5, "MEDIUM"));
    }

    // ── shraniVprasanjaVBanko ─────────────────────────────────────────────────

    @Test
    void shraniVBanko_savesQuestion() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));
        when(questionRepository.save(any())).thenReturn(question);

        QuestionSaveRequestDTO.QuestionItemDTO item = new QuestionSaveRequestDTO.QuestionItemDTO();
        item.setBesediloVprasanja("What is 2+2?");
        item.setMoznosti(List.of("1","2","4","5"));
        item.setIndeksPravilnegaOdgovora(2);
        item.setRazlaga("Math");

        List<QuestionResponseDTO> result =
                quizService.shraniVprasanjaVBanko(predmetId, List.of(item));

        assertEquals(1, result.size());
        verify(questionRepository, times(1)).save(any());
    }

    @Test
    void shraniVBanko_throwsWhenModuleNotFound() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> quizService.shraniVprasanjaVBanko(predmetId, List.of()));
    }

    @Test
    void shraniVBanko_savesMultipleQuestions() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));
        when(questionRepository.save(any())).thenReturn(question);

        QuestionSaveRequestDTO.QuestionItemDTO i1 = new QuestionSaveRequestDTO.QuestionItemDTO();
        i1.setBesediloVprasanja("Q1"); i1.setMoznosti(List.of("A","B","C","D")); i1.setIndeksPravilnegaOdgovora(0); i1.setRazlaga("R1");

        QuestionSaveRequestDTO.QuestionItemDTO i2 = new QuestionSaveRequestDTO.QuestionItemDTO();
        i2.setBesediloVprasanja("Q2"); i2.setMoznosti(List.of("A","B","C","D")); i2.setIndeksPravilnegaOdgovora(1); i2.setRazlaga("R2");

        List<QuestionResponseDTO> result =
                quizService.shraniVprasanjaVBanko(predmetId, List.of(i1, i2));

        assertEquals(2, result.size());
        verify(questionRepository, times(2)).save(any());
    }

    // ── getVprasanjaBanka ─────────────────────────────────────────────────────

    @Test
    void getBanka_returnsQuestions() {
        when(questionRepository.findByPredmetId(predmetId)).thenReturn(List.of(question));

        List<QuestionResponseDTO> result = quizService.getVprasanjaBanka(predmetId);

        assertEquals(1, result.size());
        assertEquals("What is 2+2?", result.get(0).getBesediloVprasanja());
    }

    @Test
    void getBanka_returnsEmptyWhenNone() {
        when(questionRepository.findByPredmetId(predmetId)).thenReturn(List.of());

        assertTrue(quizService.getVprasanjaBanka(predmetId).isEmpty());
    }

    // ── ustvariKviz ───────────────────────────────────────────────────────────

    @Test
    void ustvari_createsQuiz() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));
        when(quizRepository.save(any())).thenReturn(quiz);
        when(questionRepository.findById(vprasanjeId)).thenReturn(Optional.of(question));
        when(questionRepository.save(any())).thenReturn(question);

        QuizResponseDTO result = quizService.ustvariKviz(predmetId, "New Quiz", 10, List.of(vprasanjeId));

        assertNotNull(result);
        verify(quizRepository, times(1)).save(any());
    }

    @Test
    void ustvari_throwsWhenModuleNotFound() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> quizService.ustvariKviz(predmetId, "Quiz", 10, List.of()));
    }

    @Test
    void ustvari_createsQuizWithNoQuestions() {
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));
        when(quizRepository.save(any())).thenReturn(quiz);

        QuizResponseDTO result = quizService.ustvariKviz(predmetId, "Empty Quiz", 5, List.of());

        assertNotNull(result);
        verify(questionRepository, never()).save(any());
    }

    // ── dodajVprasanjeNaKviz ──────────────────────────────────────────────────

    @Test
    void dodaj_addsQuestionToQuiz() {
        when(quizRepository.findById(kvizId)).thenReturn(Optional.of(quiz));
        when(questionRepository.findById(vprasanjeId)).thenReturn(Optional.of(question));
        when(questionRepository.save(any())).thenReturn(question);

        assertDoesNotThrow(() -> quizService.dodajVprasanjeNaKviz(kvizId, vprasanjeId));
        verify(questionRepository, times(1)).save(any());
    }

    @Test
    void dodaj_throwsWhenQuizNotFound() {
        when(quizRepository.findById(kvizId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> quizService.dodajVprasanjeNaKviz(kvizId, vprasanjeId));
    }

    @Test
    void dodaj_doesNothingWhenQuestionNotFound() {
        when(quizRepository.findById(kvizId)).thenReturn(Optional.of(quiz));
        when(questionRepository.findById(vprasanjeId)).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> quizService.dodajVprasanjeNaKviz(kvizId, vprasanjeId));
        verify(questionRepository, never()).save(any());
    }

    // ── odstraniVprasanjeIzKviza ──────────────────────────────────────────────

    @Test
    void odstrani_removesQuestionFromQuiz() {
        question.setQuiz(quiz);
        when(questionRepository.findById(vprasanjeId)).thenReturn(Optional.of(question));
        when(questionRepository.save(any())).thenReturn(question);

        assertDoesNotThrow(() -> quizService.odstraniVprasanjeIzKviza(vprasanjeId));
        verify(questionRepository, times(1)).save(any());
    }

    @Test
    void odstrani_doesNothingWhenNotFound() {
        when(questionRepository.findById(vprasanjeId)).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> quizService.odstraniVprasanjeIzKviza(vprasanjeId));
        verify(questionRepository, never()).save(any());
    }

    // ── objaviKviz ────────────────────────────────────────────────────────────

    @Test
    void objavi_setsPublished() {
        when(quizRepository.findById(kvizId)).thenReturn(Optional.of(quiz));
        when(quizRepository.save(any())).thenReturn(quiz);
        when(vpisRepository.findByPredmetId(predmetId)).thenReturn(List.of());

        QuizResponseDTO result = quizService.objaviKviz(kvizId);

        assertNotNull(result);
        verify(quizRepository, times(1)).save(any());
    }

    @Test
    void objavi_sendsNotificationsToStudents() {
        Vpis vpis = new Vpis();
        vpis.setUcenecId(ucenecId);
        vpis.setPredmet(predmet);

        when(quizRepository.findById(kvizId)).thenReturn(Optional.of(quiz));
        when(quizRepository.save(any())).thenReturn(quiz);
        when(vpisRepository.findByPredmetId(predmetId)).thenReturn(List.of(vpis));

        quizService.objaviKviz(kvizId);

        verify(obvestiloService, times(1)).ustvari(
                eq(ucenecId), eq("QUIZ"), any(), any(), any());
    }

    @Test
    void objavi_throwsWhenQuizNotFound() {
        when(quizRepository.findById(kvizId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> quizService.objaviKviz(kvizId));
    }

    // ── getKviziZaPredmet ─────────────────────────────────────────────────────

    @Test
    void getKviziZaPredmet_returnsQuizzes() {
        when(quizRepository.findByPredmetId(predmetId)).thenReturn(List.of(quiz));

        List<QuizResponseDTO> result = quizService.getKviziZaPredmet(predmetId);

        assertEquals(1, result.size());
        assertEquals("Test Quiz", result.get(0).getNaziv());
    }

    @Test
    void getKviziZaPredmet_returnsEmptyWhenNone() {
        when(quizRepository.findByPredmetId(predmetId)).thenReturn(List.of());

        assertTrue(quizService.getKviziZaPredmet(predmetId).isEmpty());
    }

    // ── izbrisiVprasanje ──────────────────────────────────────────────────────

    @Test
    void izbrisi_deletesQuestion() {
        assertDoesNotThrow(() -> quizService.izbrisiVprasanje(vprasanjeId));
        verify(questionRepository, times(1)).deleteById(vprasanjeId);
    }

    // ── getVprasanjaZaKviz ────────────────────────────────────────────────────

    @Test
    void getVprasanja_returnsQuestions() {
        when(questionRepository.findByQuizId(kvizId)).thenReturn(List.of(question));

        List<QuestionResponseDTO> result = quizService.getVprasanjaZaKviz(kvizId);

        assertEquals(1, result.size());
        assertEquals("What is 2+2?", result.get(0).getBesediloVprasanja());
    }

    @Test
    void getVprasanja_returnsEmptyWhenNone() {
        when(questionRepository.findByQuizId(kvizId)).thenReturn(List.of());

        assertTrue(quizService.getVprasanjaZaKviz(kvizId).isEmpty());
    }

    // ── getKviziZaUcenca ──────────────────────────────────────────────────────

    @Test
    void getKviziZaUcenca_returnsQuizzes() {
        Vpis vpis = new Vpis();
        vpis.setPredmet(predmet);
        when(vpisRepository.findByUcenecIdAndJeAktivenTrue(ucenecId)).thenReturn(List.of(vpis));
        when(quizRepository.findByPredmetId(predmetId)).thenReturn(List.of(quiz));

        List<QuizResponseDTO> result = quizService.getKviziZaUcenca(ucenecId);

        assertEquals(1, result.size());
    }

    @Test
    void getKviziZaUcenca_returnsEmptyWhenNoEnrollments() {
        when(vpisRepository.findByUcenecIdAndJeAktivenTrue(ucenecId)).thenReturn(List.of());

        assertTrue(quizService.getKviziZaUcenca(ucenecId).isEmpty());
    }

    // ── shraniRezultat ────────────────────────────────────────────────────────

    @Test
    void shraniRezultat_calculatesCorrectScore() {
        when(quizRepository.findById(kvizId)).thenReturn(Optional.of(quiz));
        when(questionRepository.findByQuizId(kvizId)).thenReturn(List.of(question));
        when(quizResultRepository.save(any())).thenReturn(quizResult);
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(profil));

        QuizResultRequestDTO dto = new QuizResultRequestDTO();
        dto.setOdgovori(List.of(2));
        dto.setCasResevanjaS(60);

        QuizResultResponseDTO result = quizService.shraniRezultat(kvizId, ucenecId, dto);

        assertEquals(1, result.getTocke());
        assertEquals(100, result.getOdstotek());
    }

    @Test
    void shraniRezultat_calculatesZeroWhenAllWrong() {
        when(quizRepository.findById(kvizId)).thenReturn(Optional.of(quiz));
        when(questionRepository.findByQuizId(kvizId)).thenReturn(List.of(question));
        when(quizResultRepository.save(any())).thenReturn(quizResult);
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(profil));

        QuizResultRequestDTO dto = new QuizResultRequestDTO();
        dto.setOdgovori(List.of(0));
        dto.setCasResevanjaS(60);

        QuizResultResponseDTO result = quizService.shraniRezultat(kvizId, ucenecId, dto);

        assertEquals(0, result.getTocke());
    }

    @Test
    void shraniRezultat_throwsWhenQuizNotFound() {
        when(quizRepository.findById(kvizId)).thenReturn(Optional.empty());

        QuizResultRequestDTO dto = new QuizResultRequestDTO();
        dto.setOdgovori(List.of(2));
        dto.setCasResevanjaS(60);

        assertThrows(RuntimeException.class,
                () -> quizService.shraniRezultat(kvizId, ucenecId, dto));
    }

    @Test
    void shraniRezultat_handlesEmptyQuiz() {
        when(quizRepository.findById(kvizId)).thenReturn(Optional.of(quiz));
        when(questionRepository.findByQuizId(kvizId)).thenReturn(List.of());
        when(quizResultRepository.save(any())).thenReturn(quizResult);
        when(profilRepository.findById(ucenecId)).thenReturn(Optional.of(profil));

        QuizResultRequestDTO dto = new QuizResultRequestDTO();
        dto.setOdgovori(List.of());
        dto.setCasResevanjaS(10);

        QuizResultResponseDTO result = quizService.shraniRezultat(kvizId, ucenecId, dto);

        assertEquals(0, result.getTocke());
        assertEquals(0, result.getOdstotek());
    }

    // ── getMojiRezultati ──────────────────────────────────────────────────────

    @Test
    void getMojiRezultati_returnsResults() {
        when(quizResultRepository.findByUporabnikId(ucenecId)).thenReturn(List.of(quizResult));

        List<QuizResultResponseDTO> result = quizService.getMojiRezultati(ucenecId);

        assertEquals(1, result.size());
        assertEquals(80, result.get(0).getOdstotek());
    }

    @Test
    void getMojiRezultati_returnsEmptyWhenNone() {
        when(quizResultRepository.findByUporabnikId(ucenecId)).thenReturn(List.of());

        assertTrue(quizService.getMojiRezultati(ucenecId).isEmpty());
    }

    // ── getKviziZaUcitelja ────────────────────────────────────────────────────

    @Test
    void getKviziZaUcitelja_returnsQuizzes() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of(predmet));
        when(quizRepository.findByPredmetIdIn(any())).thenReturn(List.of(quiz));

        List<QuizResponseDTO> result = quizService.getKviziZaUcitelja(uciteljId);

        assertEquals(1, result.size());
    }

    @Test
    void getKviziZaUcitelja_returnsEmptyWhenNoModules() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of());

        assertTrue(quizService.getKviziZaUcitelja(uciteljId).isEmpty());
    }

    // ── getTopStudentsZaUcitelja ──────────────────────────────────────────────

    @Test
    void getTopStudents_returnsStudents() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of(predmet));
        when(quizRepository.findByPredmetIdIn(any())).thenReturn(List.of(quiz));
        when(quizResultRepository.findByQuizIdIn(any())).thenReturn(List.of(quizResult));
        when(profilRepository.findAllById(any())).thenReturn(List.of(profil));

        List<TopStudentDTO> result = quizService.getTopStudentsZaUcitelja(uciteljId);

        assertEquals(1, result.size());
        assertEquals("Test Student", result.get(0).getImePriimek());
    }

    @Test
    void getTopStudents_returnsEmptyWhenNoModules() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of());

        assertTrue(quizService.getTopStudentsZaUcitelja(uciteljId).isEmpty());
    }

    @Test
    void getTopStudents_returnsEmptyWhenNoQuizzes() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of(predmet));
        when(quizRepository.findByPredmetIdIn(any())).thenReturn(List.of());

        assertTrue(quizService.getTopStudentsZaUcitelja(uciteljId).isEmpty());
    }

    @Test
    void getTopStudents_returnsEmptyWhenNoResults() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of(predmet));
        when(quizRepository.findByPredmetIdIn(any())).thenReturn(List.of(quiz));
        when(quizResultRepository.findByQuizIdIn(any())).thenReturn(List.of());

        assertTrue(quizService.getTopStudentsZaUcitelja(uciteljId).isEmpty());
    }

    @Test
    void getTopStudents_limitsToFive() {
        when(predmetRepository.findByUciteljId(uciteljId)).thenReturn(List.of(predmet));
        when(quizRepository.findByPredmetIdIn(any())).thenReturn(List.of(quiz));

        List<QuizResult> many = new ArrayList<>();
        List<Profil> manyProfili = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            UUID sid = UUID.randomUUID();
            QuizResult r = new QuizResult();
            r.setId(UUID.randomUUID()); r.setQuiz(quiz); r.setUporabnikId(sid);
            r.setTocke(i + 1); r.setSkupajVprasanj(10);
            r.setCasResevanjaS(100); r.setOddanoOb(OffsetDateTime.now());
            many.add(r);
            Profil p = new Profil(); p.setId(sid); p.setImePriimek("Student " + i);
            manyProfili.add(p);
        }
        when(quizResultRepository.findByQuizIdIn(any())).thenReturn(many);
        when(profilRepository.findAllById(any())).thenReturn(manyProfili);

        List<TopStudentDTO> result = quizService.getTopStudentsZaUcitelja(uciteljId);

        assertTrue(result.size() <= 5);
    }
}