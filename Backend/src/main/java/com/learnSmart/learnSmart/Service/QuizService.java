package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Quiz.*;
import com.learnSmart.learnSmart.Model.*;
import com.learnSmart.learnSmart.Repository.*;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
    private final QuizResultRepository quizResultRepository;
    private final ProfilRepository profilRepository;
    private final ObvestiloService obvestiloService;

    private static final String PREDMET_NE_OBSTAJA = "Module does not exist";

    public List<QuizGeminiService.GeneratedQuestion> generirajVprasanja(
            UUID predmetId, int steviloVprasanj, String tezavnost) {
        Predmet predmet = predmetRepository.findById(predmetId)
                .orElseThrow(() -> new RuntimeException(PREDMET_NE_OBSTAJA));
        if (predmet.getZdruzenTranscript() == null || predmet.getZdruzenTranscript().isBlank()) {
            throw new RuntimeException("Module has no transcript yet");
        }
        return quizGeminiService.generirajVprasanja(predmet.getZdruzenTranscript(), steviloVprasanj, tezavnost);
    }

    public QuizResponseDTO shraniKviz(UUID predmetId, String naziv, Integer casIzvajanja,
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
            question.setPredmetId(predmetId);
            question.setBesediloVprasanja(q.besediloVprasanja());
            question.setMoznosti(q.moznosti());
            question.setIndeksPravilnegaOdgovora(q.indeksPravilnegaOdgovora());
            question.setRazlaga(q.razlaga());
            questionRepository.save(question);
        }
        log.info("Saved {} questions to quiz {}", odobrenVprasanja.size(), shranjeniKviz.getId());
        return new QuizResponseDTO(shranjeniKviz.getId(), shranjeniKviz.getNaziv(),
                shranjeniKviz.getStatus(), shranjeniKviz.getCasIzvajanja(),
                predmetId, shranjeniKviz.getUstvarjenOb());
    }

    public List<QuestionResponseDTO> shraniVprasanjaVBanko(
            UUID predmetId, List<QuestionSaveRequestDTO.QuestionItemDTO> vprasanja) {
        predmetRepository.findById(predmetId)
                .orElseThrow(() -> new RuntimeException(PREDMET_NE_OBSTAJA));
        List<QuestionResponseDTO> result = new ArrayList<>();
        for (var q : vprasanja) {
            Question question = new Question();
            question.setPredmetId(predmetId);
            question.setQuiz(null);
            question.setBesediloVprasanja(q.getBesediloVprasanja());
            question.setMoznosti(q.getMoznosti());
            question.setIndeksPravilnegaOdgovora(q.getIndeksPravilnegaOdgovora());
            question.setRazlaga(q.getRazlaga());
            Question saved = questionRepository.save(question);
            result.add(new QuestionResponseDTO(saved.getId(), saved.getBesediloVprasanja(),
                    saved.getMoznosti(), saved.getIndeksPravilnegaOdgovora(), saved.getRazlaga()));
        }
        log.info("Saved {} questions to bank for predmet {}", result.size(), predmetId);
        return result;
    }

    public List<QuestionResponseDTO> getVprasanjaBanka(UUID predmetId) {
        return questionRepository.findByPredmetId(predmetId).stream()
                .map(q -> new QuestionResponseDTO(q.getId(), q.getBesediloVprasanja(),
                        q.getMoznosti(), q.getIndeksPravilnegaOdgovora(), q.getRazlaga()))
                .toList();
    }

    public QuizResponseDTO ustvariKviz(UUID predmetId, String naziv,
                                       Integer casIzvajanja, List<UUID> vprasanjaIds) {
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
        for (UUID vprasanjeId : vprasanjaIds) {
            questionRepository.findById(vprasanjeId).ifPresent(q -> {
                q.setQuiz(shranjeniKviz);
                questionRepository.save(q);
            });
        }
        log.info("Created quiz {} with {} questions", shranjeniKviz.getId(), vprasanjaIds.size());
        return new QuizResponseDTO(shranjeniKviz.getId(), shranjeniKviz.getNaziv(),
                shranjeniKviz.getStatus(), shranjeniKviz.getCasIzvajanja(),
                predmetId, shranjeniKviz.getUstvarjenOb());
    }

    public void dodajVprasanjeNaKviz(UUID kvizId, UUID vprasanjeId) {
        Quiz quiz = quizRepository.findById(kvizId)
                .orElseThrow(() -> new RuntimeException("Quiz does not exist"));
        questionRepository.findById(vprasanjeId).ifPresent(q -> {
            q.setQuiz(quiz);
            questionRepository.save(q);
        });
    }

    public void odstraniVprasanjeIzKviza(UUID vprasanjeId) {
        questionRepository.findById(vprasanjeId).ifPresent(q -> {
            q.setQuiz(null);
            questionRepository.save(q);
        });
    }

    public QuizResponseDTO objaviKviz(UUID kvizId) {
        Quiz quiz = quizRepository.findById(kvizId)
                .orElseThrow(() -> new RuntimeException("Quiz does not exist"));
        quiz.setStatus("PUBLISHED");
        Quiz saved = quizRepository.save(quiz);

        // ── OBVESTILA: obvesti vse vpisane učence ──
        List<Vpis> vpisi = vpisRepository.findByPredmetId(saved.getPredmet().getId());
        for (Vpis vpis : vpisi) {
            obvestiloService.ustvari(
                    vpis.getUcenecId(),
                    "QUIZ",
                    "New quiz available " + saved.getNaziv(),
                    "The teacher has published a new quiz in the module " + saved.getPredmet().getNaziv(),
                    "/kvizi"
            );
        }
        log.info("Notifications sent to {} students for quiz {}", vpisi.size(), saved.getId());

        return new QuizResponseDTO(saved.getId(), saved.getNaziv(), saved.getStatus(),
                saved.getCasIzvajanja(), saved.getPredmet().getId(), saved.getUstvarjenOb());
    }

    public List<QuizResponseDTO> getKviziZaPredmet(UUID predmetId) {
        return quizRepository.findByPredmetId(predmetId).stream()
                .map(q -> new QuizResponseDTO(q.getId(), q.getNaziv(), q.getStatus(),
                        q.getCasIzvajanja(), predmetId, q.getUstvarjenOb()))
                .toList();
    }

    public void izbrisiVprasanje(UUID vprasanjeId) {
        questionRepository.deleteById(vprasanjeId);
    }

    public List<QuestionResponseDTO> getVprasanjaZaKviz(UUID kvizId) {
        return questionRepository.findByQuizId(kvizId).stream()
                .map(q -> new QuestionResponseDTO(q.getId(), q.getBesediloVprasanja(),
                        q.getMoznosti(), q.getIndeksPravilnegaOdgovora(), q.getRazlaga()))
                .toList();
    }

    public List<QuizResponseDTO> getKviziZaUcenca(UUID ucenecId) {
        List<Vpis> vpisi = vpisRepository.findByUcenecId(ucenecId);
        List<UUID> predmetIds = vpisi.stream().map(v -> v.getPredmet().getId()).toList();
        return predmetIds.stream()
                .flatMap(predmetId -> quizRepository.findByPredmetId(predmetId).stream()
                        .map(q -> new QuizResponseDTO(q.getId(), q.getNaziv(), q.getStatus(),
                                q.getCasIzvajanja(), predmetId, q.getUstvarjenOb())))
                .toList();
    }

    public QuizResultResponseDTO shraniRezultat(UUID kvizId, UUID ucenecId, QuizResultRequestDTO dto) {
        Quiz quiz = quizRepository.findById(kvizId)
                .orElseThrow(() -> new RuntimeException("Quiz does not exist"));
        List<Question> vprasanja = questionRepository.findByQuizId(kvizId);
        int tocke = 0;
        for (int i = 0; i < dto.getOdgovori().size() && i < vprasanja.size(); i++) {
            if (dto.getOdgovori().get(i).equals(vprasanja.get(i).getIndeksPravilnegaOdgovora())) tocke++;
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

        // ── NOTIFY PROFESSOR ──
        UUID uciteljId = quiz.getPredmet().getUciteljId();
        String imeUcenca = profilRepository.findById(ucenecId)
                .map(p -> p.getImePriimek() != null ? p.getImePriimek() : "A student")
                .orElse("A student");

        obvestiloService.ustvari(
                uciteljId,
                "QUIZ",
                "Student completed a quiz",
                imeUcenca + " completed the quiz \"" + quiz.getNaziv() + "\" with " + odstotek + "%.",
                "/kvizi"
        );

        return new QuizResultResponseDTO(shranjen.getId(), kvizId, quiz.getNaziv(),
                tocke, skupaj, odstotek, dto.getCasResevanjaS(), shranjen.getOddanoOb(), dto.getOdgovori());
    }

    public List<QuizResultResponseDTO> getMojiRezultati(UUID ucenecId) {
        return quizResultRepository.findByUporabnikId(ucenecId).stream()
                .map(r -> {
                    int odstotek = r.getSkupajVprasanj() > 0
                            ? Math.round((float) r.getTocke() / r.getSkupajVprasanj() * 100) : 0;
                    return new QuizResultResponseDTO(r.getId(), r.getQuiz().getId(), r.getQuiz().getNaziv(),
                            r.getTocke(), r.getSkupajVprasanj(), odstotek, r.getCasResevanjaS(),
                            r.getOddanoOb(), r.getOdgovori());
                })
                .toList();
    }

    public List<QuizResponseDTO> getKviziZaUcitelja(UUID uciteljId) {
        List<UUID> predmetIds = predmetRepository.findByUciteljId(uciteljId)
                .stream().map(Predmet::getId).toList();
        if (predmetIds.isEmpty()) return List.of();
        return quizRepository.findByPredmetIdIn(predmetIds).stream()
                .map(q -> new QuizResponseDTO(q.getId(), q.getNaziv(), q.getStatus(),
                        q.getCasIzvajanja(), q.getPredmet().getId(), q.getUstvarjenOb()))
                .toList();
    }

    private AnalyticsStatsDTO computeStats(List<UUID> predmetIds) {
        List<Vpis> vpisi = vpisRepository.findByPredmetIdInAndJeAktivenTrue(predmetIds);
        Set<UUID> enrolledStudents = vpisi.stream().map(Vpis::getUcenecId).collect(Collectors.toSet());
        int totalStudents = enrolledStudents.size();
        List<Quiz> kvizi = quizRepository.findByPredmetIdIn(predmetIds);
        if (kvizi.isEmpty()) return new AnalyticsStatsDTO(totalStudents, 0, 0, 0);
        List<UUID> kvizIds = kvizi.stream().map(Quiz::getId).toList();
        List<QuizResult> rezultati = quizResultRepository.findByQuizIdIn(kvizIds);
        if (rezultati.isEmpty()) return new AnalyticsStatsDTO(totalStudents, 0, 0, 0);
        int avgScore = (int) Math.round(rezultati.stream()
                .mapToDouble(r -> r.getSkupajVprasanj() > 0 ? (double) r.getTocke() / r.getSkupajVprasanj() * 100 : 0)
                .average().orElse(0));
        long passed = rezultati.stream()
                .filter(r -> r.getSkupajVprasanj() > 0 && (double) r.getTocke() / r.getSkupajVprasanj() >= 0.5)
                .count();
        int passRate = (int) Math.round((double) passed / rezultati.size() * 100);
        Set<UUID> studentsWithPass = rezultati.stream()
                .filter(r -> r.getSkupajVprasanj() > 0 && (double) r.getTocke() / r.getSkupajVprasanj() >= 0.5)
                .map(QuizResult::getUporabnikId)
                .collect(Collectors.toSet());
        int avgCompletion = totalStudents == 0 ? 0
                : (int) Math.round((double) studentsWithPass.size() / totalStudents * 100);
        return new AnalyticsStatsDTO(totalStudents, avgScore, avgCompletion, passRate);
    }

    public AnalyticsStatsDTO getAnalyticsStatsZaUcitelja(UUID uciteljId) {
        List<UUID> predmetIds = predmetRepository.findByUciteljId(uciteljId)
                .stream().map(Predmet::getId).toList();
        if (predmetIds.isEmpty()) return new AnalyticsStatsDTO(0, 0, 0, 0);
        return computeStats(predmetIds);
    }

    public AnalyticsStatsDTO getAnalyticsStatsZaPredmet(UUID predmetId) {
        return computeStats(List.of(predmetId));
    }

    public List<TopStudentDTO> getTopStudentsZaUcitelja(UUID uciteljId) {
        List<UUID> predmetIds = predmetRepository.findByUciteljId(uciteljId)
                .stream().map(Predmet::getId).toList();
        if (predmetIds.isEmpty()) return List.of();
        List<Quiz> kvizi = quizRepository.findByPredmetIdIn(predmetIds);
        if (kvizi.isEmpty()) return List.of();
        Map<UUID, Integer> casMap = kvizi.stream()
                .collect(Collectors.toMap(Quiz::getId, q -> q.getCasIzvajanja() != null ? q.getCasIzvajanja() : 0));
        List<UUID> kvizIds = kvizi.stream().map(Quiz::getId).toList();
        List<QuizResult> rezultati = quizResultRepository.findByQuizIdIn(kvizIds);
        if (rezultati.isEmpty()) return List.of();
        Map<UUID, Double> scoreByStudent = rezultati.stream()
                .collect(Collectors.groupingBy(QuizResult::getUporabnikId,
                        Collectors.averagingDouble(r -> {
                            if (r.getSkupajVprasanj() == null || r.getSkupajVprasanj() == 0) return 0.0;
                            double accuracy = (double) r.getTocke() / r.getSkupajVprasanj();
                            int allowedMin = casMap.getOrDefault(r.getQuiz().getId(), 0);
                            double timeBonus = 0.0;
                            if (allowedMin > 0 && r.getCasResevanjaS() != null && r.getCasResevanjaS() > 0) {
                                double allowedSec = allowedMin * 60.0;
                                double speedRatio = Math.min(1.0, r.getCasResevanjaS() / allowedSec);
                                timeBonus = (1.0 - speedRatio) * 0.3;
                            }
                            return accuracy * (1.0 + timeBonus) * 100.0;
                        })));
        Map<UUID, Profil> profilMap = profilRepository.findAllById(scoreByStudent.keySet())
                .stream().collect(Collectors.toMap(Profil::getId, p -> p));
        return scoreByStudent.entrySet().stream()
                .sorted(Map.Entry.<UUID, Double>comparingByValue(Comparator.reverseOrder()))
                .limit(5)
                .map(e -> {
                    Profil p = profilMap.get(e.getKey());
                    String ime = p != null ? p.getImePriimek() : e.getKey().toString();
                    String ucniTip = p != null ? p.getUcniTip() : null;
                    return new TopStudentDTO(e.getKey(), ime, ucniTip, (int) Math.round(e.getValue()));
                })
                .toList();
    }
}