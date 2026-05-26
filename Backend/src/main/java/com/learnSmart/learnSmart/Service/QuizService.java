package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.Model.*;
import com.learnSmart.learnSmart.Repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
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

    public Quiz shraniKviz(
            UUID predmetId,
            String naziv,
            Integer casIzvajanja,
            List<QuizGeminiService.GeneratedQuestion> odobrenVprasanja) {

        Predmet predmet = predmetRepository.findById(predmetId)
                .orElseThrow(() -> new RuntimeException(PREDMET_NE_OBSTAJA));

        Quiz quiz = new Quiz();
        quiz.setPredmet(predmet);
        quiz.setNaziv(naziv);
        quiz.setGeneriranZAi(true);
        quiz.setStatus("DRAFT");
        quiz.setCasIzvajanja(casIzvajanja);
        quiz.setUstvarjenOb(OffsetDateTime.now());
        Quiz shranjeniKviz = quizRepository.save(quiz);

        for (QuizGeminiService.GeneratedQuestion q : odobrenVprasanja) {
            Question question = new Question();
            question.setQuiz(shranjeniKviz);
            question.setBesediloVprasanja(q.besediloVprasanja());
            question.setMoznosti(q.moznosti());
            question.setIndeksPravilnegaOdgovora(q.indeksPravilnegaOdgovora());
            question.setRazlaga(q.razlaga());
            questionRepository.save(question);
        }

        log.info("Saved quiz {} with {} questions", shranjeniKviz.getId(), odobrenVprasanja.size());
        return shranjeniKviz;
    }

    public Quiz objaviKviz(UUID kvizId) {
        Quiz quiz = quizRepository.findById(kvizId)
                .orElseThrow(() -> new RuntimeException("Quiz does not exist"));
        quiz.setStatus("PUBLISHED");
        return quizRepository.save(quiz);
    }

    public List<Quiz> getKviziZaPredmet(UUID predmetId) {
        return quizRepository.findByPredmetId(predmetId);
    }
}