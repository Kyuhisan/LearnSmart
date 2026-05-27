package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Quiz.QuestionResponseDTO;
import com.learnSmart.learnSmart.DTO.Quiz.QuizResponseDTO;
import com.learnSmart.learnSmart.Model.*;
import com.learnSmart.learnSmart.Repository.*;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
public class QuizService {

    private final QuizGeminiService quizGeminiService;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final PredmetRepository predmetRepository;

    private static final String PREDMET_NE_OBSTAJA = "Module does not exist";

    public List<QuizGeminiService.GeneratedQuestion> generirajVprasanja(
            UUID predmetId,
            int steviloVprasanj,
            String tezavnost) {

        Predmet predmet = predmetRepository.findById(predmetId)
                .orElseThrow(() -> new RuntimeException(PREDMET_NE_OBSTAJA));

        if (predmet.getZdruzenTranscript() == null || predmet.getZdruzenTranscript().isBlank()) {
            throw new RuntimeException("Module has no transcript yet");
        }

        return quizGeminiService.generirajVprasanja(
                predmet.getZdruzenTranscript(),
                steviloVprasanj,
                tezavnost
        );
    }

    public QuizResponseDTO shraniKviz(
            UUID predmetId,
            String naziv,
            Integer casIzvajanja,
            List<QuizGeminiService.GeneratedQuestion> odobrenVprasanja) {

        Predmet predmet = predmetRepository.findById(predmetId)
                .orElseThrow(() -> new RuntimeException(PREDMET_NE_OBSTAJA));

        List<Quiz> obstojeciKvizi = quizRepository.findByPredmetId(predmetId);
        Quiz quiz;

        if (!obstojeciKvizi.isEmpty()) {

            quiz = obstojeciKvizi.get(0);
        } else {

            quiz = new Quiz();
            quiz.setPredmet(predmet);
            quiz.setNaziv(naziv);
            quiz.setGeneriranZAi(true);
            quiz.setStatus("DRAFT");
            quiz.setCasIzvajanja(casIzvajanja);
            quiz.setUstvarjenOb(OffsetDateTime.now());
            quiz = quizRepository.save(quiz);
        }

        final Quiz shranjeniKviz = quiz;

        for (QuizGeminiService.GeneratedQuestion q : odobrenVprasanja) {
            Question question = new Question();
            question.setQuiz(shranjeniKviz);
            question.setBesediloVprasanja(q.besediloVprasanja());
            question.setMoznosti(q.moznosti());
            question.setIndeksPravilnegaOdgovora(q.indeksPravilnegaOdgovora());
            question.setRazlaga(q.razlaga());
            questionRepository.save(question);
        }

        log.info("Saved {} questions to quiz {}", odobrenVprasanja.size(), shranjeniKviz.getId());
        return new QuizResponseDTO(
                shranjeniKviz.getId(),
                shranjeniKviz.getNaziv(),
                shranjeniKviz.getStatus(),
                shranjeniKviz.getCasIzvajanja(),
                predmetId
        );
    }

    public QuizResponseDTO objaviKviz(UUID kvizId) {
        Quiz quiz = quizRepository.findById(kvizId)
                .orElseThrow(() -> new RuntimeException("Quiz does not exist"));
        quiz.setStatus("PUBLISHED");
        Quiz saved = quizRepository.save(quiz);
        return new QuizResponseDTO(
                saved.getId(),
                saved.getNaziv(),
                saved.getStatus(),
                saved.getCasIzvajanja(),
                saved.getPredmet().getId()
        );
    }

    public List<QuizResponseDTO> getKviziZaPredmet(UUID predmetId) {
        return quizRepository.findByPredmetId(predmetId).stream()
                .map(q -> new QuizResponseDTO(
                        q.getId(),
                        q.getNaziv(),
                        q.getStatus(),
                        q.getCasIzvajanja(),
                        predmetId
                ))
                .toList();
    }

    public void izbrisiVprasanje(UUID vprasanjeId) {
        questionRepository.deleteById(vprasanjeId);
    }

    public List<QuestionResponseDTO> getVprasanjaZaKviz(UUID kvizId) {
        return questionRepository.findByQuizId(kvizId).stream()
                .map(q -> new QuestionResponseDTO(
                        q.getId(),
                        q.getBesediloVprasanja(),
                        q.getMoznosti(),
                        q.getIndeksPravilnegaOdgovora(),
                        q.getRazlaga()
                ))
                .toList();
    }
}