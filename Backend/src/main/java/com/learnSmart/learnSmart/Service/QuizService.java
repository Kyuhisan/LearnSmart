package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Quiz.QuestionResponseDTO;
import com.learnSmart.learnSmart.DTO.Quiz.QuizResponseDTO;
import com.learnSmart.learnSmart.DTO.Quiz.QuizResultResponseDTO;
import com.learnSmart.learnSmart.DTO.Quiz.QuizResultResponseDTO;
import com.learnSmart.learnSmart.DTO.Quiz.QuizResultRequestDTO;
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
    private final VpisRepository vpisRepository;
    private final  QuizResultRepository quizResultRepository;

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
                predmetId,
                shranjeniKviz.getUstvarjenOb()
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
                saved.getPredmet().getId(),
                saved.getUstvarjenOb()
        );
    }

    public List<QuizResponseDTO> getKviziZaPredmet(UUID predmetId) {
        return quizRepository.findByPredmetId(predmetId).stream()
                .map(q -> new QuizResponseDTO(
                        q.getId(),
                        q.getNaziv(),
                        q.getStatus(),
                        q.getCasIzvajanja(),
                        predmetId,
                        q.getUstvarjenOb()
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
    //ZA ucenca dalje
    public List<QuizResponseDTO> getKviziZaUcenca(UUID ucenecId) {
        // Pridobi vpise ucenca
        List<Vpis> vpisi = vpisRepository.findByUcenecId(ucenecId);
        List<UUID> predmetIds = vpisi.stream()
                .map(v -> v.getPredmet().getId())
                .toList();

        // Pridobi kvize za te predmete
        return predmetIds.stream()
                .flatMap(predmetId -> quizRepository.findByPredmetId(predmetId).stream()
                        .map(q -> new QuizResponseDTO(
                                q.getId(),
                                q.getNaziv(),
                                q.getStatus(),
                                q.getCasIzvajanja(),
                                predmetId,
                                q.getUstvarjenOb()
                        )))
                .toList();
    }

    public QuizResultResponseDTO shraniRezultat(
            UUID kvizId, UUID ucenecId, QuizResultRequestDTO dto) {

        Quiz quiz = quizRepository.findById(kvizId)
                .orElseThrow(() -> new RuntimeException("Quiz does not exist"));

        List<Question> vprasanja = questionRepository.findByQuizId(kvizId);

        // Izracunaj tocke
        int tocke = 0;
        for (int i = 0; i < dto.getOdgovori().size() && i < vprasanja.size(); i++) {
            if (dto.getOdgovori().get(i).equals(vprasanja.get(i).getIndeksPravilnegaOdgovora())) {
                tocke++;
            }
        }

        int skupaj = vprasanja.size();
        int odstotek = skupaj > 0 ? Math.round((float) tocke / skupaj * 100) : 0;

        QuizResult rezultat = new QuizResult();
        rezultat.setQuiz(quiz);
        rezultat.setUporabnikId(ucenecId);
        rezultat.setTocke(tocke);
        rezultat.setSkupajVprasanj(skupaj);
        rezultat.setOddanoOb(OffsetDateTime.now());
        rezultat.setOdgovori(dto.getOdgovori());
        rezultat.setCasResevanjaS(dto.getCasResevanjaS());
        QuizResult shranjen = quizResultRepository.save(rezultat);

        return new QuizResultResponseDTO(
                shranjen.getId(), kvizId, quiz.getNaziv(),
                tocke, skupaj, odstotek,
                dto.getCasResevanjaS(), shranjen.getOddanoOb(),
                dto.getOdgovori()
        );
    }

    public List<QuizResultResponseDTO> getMojiRezultati(UUID ucenecId) {
        return quizResultRepository.findByUporabnikId(ucenecId).stream()
                .map(r -> {
                    int odstotek = r.getSkupajVprasanj() > 0
                            ? Math.round((float) r.getTocke() / r.getSkupajVprasanj() * 100)
                            : 0;
                    return new QuizResultResponseDTO(
                            r.getId(), r.getQuiz().getId(), r.getQuiz().getNaziv(),
                            r.getTocke(), r.getSkupajVprasanj(), odstotek, r.getCasResevanjaS(), r.getOddanoOb(), r.getOdgovori()
                    );
                })
                .toList();
    }
}