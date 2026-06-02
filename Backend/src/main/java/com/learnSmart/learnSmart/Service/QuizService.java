package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Quiz.*;
import com.learnSmart.learnSmart.Model.*;
import com.learnSmart.learnSmart.Repository.*;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.Comparator;
import java.util.stream.Collectors;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Locale;

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
            question.setTezavnost(q.getTezavnost());
            Question saved = questionRepository.save(question);
            result.add(new QuestionResponseDTO(saved.getId(), saved.getBesediloVprasanja(),
                    saved.getMoznosti(), saved.getIndeksPravilnegaOdgovora(), saved.getRazlaga(), saved.getTezavnost()));
        }
        log.info("Saved {} questions to bank for predmet {}", result.size(), predmetId);
        return result;
    }

    public List<QuestionResponseDTO> getVprasanjaBanka(UUID predmetId) {
        return questionRepository.findByPredmetId(predmetId).stream()
                .map(q -> new QuestionResponseDTO(q.getId(), q.getBesediloVprasanja(),
                        q.getMoznosti(), q.getIndeksPravilnegaOdgovora(), q.getRazlaga(), q.getTezavnost()))
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

    public void izbrisiKviz(UUID kvizId, UUID uciteljId) {
        Quiz quiz = quizRepository.findById(kvizId)
                .orElseThrow(() -> new RuntimeException("Quiz does not exist"));
        if (!quiz.getPredmet().getUciteljId().equals(uciteljId)) {
            throw new RuntimeException("Dostop zavrnjen");
        }
        quizRepository.delete(quiz);
    }

    public List<QuestionResponseDTO> getVprasanjaZaKviz(UUID kvizId) {
        return questionRepository.findByQuizId(kvizId).stream()
                .map(q -> new QuestionResponseDTO(q.getId(), q.getBesediloVprasanja(),
                        q.getMoznosti(), q.getIndeksPravilnegaOdgovora(), q.getRazlaga(), q.getTezavnost()))
                .toList();
    }

    public List<QuizResponseDTO> getKviziZaUcenca(UUID ucenecId) {
        List<Vpis> vpisi = vpisRepository.findByUcenecIdAndJeAktivenTrue(ucenecId);
        List<UUID> predmetIds = vpisi.stream().map(v -> v.getPredmet().getId()).toList();
        return predmetIds.stream()
                .flatMap(predmetId -> quizRepository.findByPredmetId(predmetId).stream()
                        .map(q -> new QuizResponseDTO(q.getId(), q.getNaziv(), q.getStatus(),
                                q.getCasIzvajanja(), predmetId, q.getUstvarjenOb())))
                .toList();
    }

    @Transactional
    public QuizResultResponseDTO shraniRezultat(UUID kvizId, UUID ucenecId, QuizResultRequestDTO dto) {
        Quiz quiz = quizRepository.findById(kvizId)
                .orElseThrow(() -> new RuntimeException("Quiz does not exist"));
        List<Question> vprasanja = questionRepository.findByQuizId(kvizId);

        // Count prior attempts BEFORE saving this result
        long priorAttempts = quizResultRepository.countByQuiz_IdAndUporabnikId(kvizId, ucenecId);

        // Weighted accuracy
        int weightedCorrect = 0, weightedTotal = 0;
        int tocke = 0;
        for (int i = 0; i < dto.getOdgovori().size() && i < vprasanja.size(); i++) {
            Question q = vprasanja.get(i);
            int w = difficultyWeight(q.getTezavnost());
            weightedTotal += w;
            if (dto.getOdgovori().get(i).equals(q.getIndeksPravilnegaOdgovora())) {
                tocke++;
                weightedCorrect += w;
            }
        }
        int skupaj = vprasanja.size();
        int odstotek = skupaj > 0 ? Math.round((float) tocke / skupaj * 100) : 0;
        int baseXp = weightedTotal > 0 ? Math.round(weightedCorrect * 100f / weightedTotal) : 0;

        double moduleMult = moduleMultiplier(quiz.getPredmet() != null ? quiz.getPredmet().getTezavnost() : null);
        double timeBonus = speedBonus(quiz.getCasIzvajanja(), dto.getCasResevanjaS());
        double retakeMult = retakeMultiplier(priorAttempts);
        int xpZasluzen = (int) Math.round(baseXp * moduleMult * (1 + timeBonus) * retakeMult);

        // Save result
        QuizResult rezultat = new QuizResult();
        rezultat.setQuiz(quiz);
        rezultat.setUporabnikId(ucenecId);
        rezultat.setTocke(tocke);
        rezultat.setSkupajVprasanj(skupaj);
        rezultat.setOddanoOb(OffsetDateTime.now());
        rezultat.setOdgovori(dto.getOdgovori());
        rezultat.setCasResevanjaS(dto.getCasResevanjaS());
        rezultat.setXpZasluzen(xpZasluzen);
        QuizResult shranjen = quizResultRepository.save(rezultat);

        // Update profil XP and nivo
        Profil profil = profilRepository.findById(ucenecId)
                .orElseThrow(() -> new RuntimeException("Profil ne obstaja"));
        int newXp = profil.getXp() + xpZasluzen;
        int newNivo = newXp / 200 + 1;
        profil.setXp(newXp);
        profil.setNivo(newNivo);
        profilRepository.save(profil);

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
                tocke, skupaj, odstotek, dto.getCasResevanjaS(), shranjen.getOddanoOb(),
                dto.getOdgovori(), xpZasluzen, newXp, newNivo);
    }

    private static int difficultyWeight(String tezavnost) {
        if ("HARD".equals(tezavnost)) return 3;
        if ("MEDIUM".equals(tezavnost)) return 2;
        return 1; // EASY or null
    }

    private static double moduleMultiplier(Integer tezavnost) {
        if (tezavnost == null) return 1.0;
        return switch (tezavnost) {
            case 1 -> 0.8;
            case 2 -> 0.9;
            case 4 -> 1.2;
            case 5 -> 1.5;
            default -> 1.0;
        };
    }

    private static double speedBonus(Integer casIzvajanjaMin, Integer casResevanjaS) {
        if (casIzvajanjaMin == null || casResevanjaS == null) return 0.0;
        double speedRatio = casResevanjaS / (casIzvajanjaMin * 60.0);
        if (speedRatio < 0.50) return 0.20;
        if (speedRatio < 0.70) return 0.10;
        return 0.0;
    }

    private static double retakeMultiplier(long priorAttempts) {
        if (priorAttempts == 0) return 1.0;
        if (priorAttempts == 1) return 0.5;
        if (priorAttempts == 2) return 0.25;
        return 0.0;
    }

    @Transactional(readOnly = true)
    public Map<UUID, Map<String, Integer>> getCompletionZaUcenca(UUID ucenecId) {
        List<UUID> predmetIds = vpisRepository.findByUcenecIdAndJeAktivenTrue(ucenecId)
                .stream().map(v -> v.getPredmet().getId()).toList();
        if (predmetIds.isEmpty()) return Map.of();

        List<Quiz> kvizi = quizRepository.findByPredmetIdIn(predmetIds).stream()
                .filter(q -> "PUBLISHED".equals(q.getStatus()))
                .toList();

        Set<UUID> kvizIds = kvizi.stream().map(Quiz::getId).collect(Collectors.toSet());
        List<QuizResult> studentResults = quizResultRepository.findByQuizIdIn(new ArrayList<>(kvizIds)).stream()
                .filter(r -> r.getUporabnikId().equals(ucenecId))
                .toList();

        Map<UUID, UUID> quizToPredmet = kvizi.stream()
                .collect(Collectors.toMap(Quiz::getId, q -> q.getPredmet().getId()));

        Set<UUID> completedKvizIds = studentResults.stream()
                .map(r -> r.getQuiz().getId())
                .collect(Collectors.toSet());

        Map<UUID, Long> totalByPredmet = kvizi.stream()
                .collect(Collectors.groupingBy(q -> q.getPredmet().getId(), Collectors.counting()));
        Map<UUID, Long> completedByPredmet = kvizi.stream()
                .filter(q -> completedKvizIds.contains(q.getId()))
                .collect(Collectors.groupingBy(q -> q.getPredmet().getId(), Collectors.counting()));
        Map<UUID, Integer> avgScoreByPredmet = studentResults.stream()
                .filter(r -> r.getSkupajVprasanj() != null && r.getSkupajVprasanj() > 0)
                .collect(Collectors.groupingBy(
                        r -> quizToPredmet.get(r.getQuiz().getId()),
                        Collectors.collectingAndThen(
                                Collectors.averagingDouble(r -> (double) r.getTocke() / r.getSkupajVprasanj() * 100),
                                avg -> (int) Math.round(avg)
                        )
                ));

        Map<UUID, Map<String, Integer>> result = new LinkedHashMap<>();
        for (UUID predmetId : predmetIds) {
            int total = totalByPredmet.getOrDefault(predmetId, 0L).intValue();
            int completed = completedByPredmet.getOrDefault(predmetId, 0L).intValue();
            int avgScore = avgScoreByPredmet.getOrDefault(predmetId, 0);
            result.put(predmetId, Map.of("total", total, "completed", completed, "avgScore", avgScore));
        }
        return result;
    }

    public List<QuizResultResponseDTO> getRezultatiZaStudenta(UUID ucenecId, int limit) {
        return quizResultRepository.findByUporabnikId(ucenecId).stream()
                .sorted(Comparator.comparing(QuizResult::getOddanoOb).reversed())
                .limit(limit)
                .map(r -> {
                    int odstotek = r.getSkupajVprasanj() > 0
                            ? Math.round((float) r.getTocke() / r.getSkupajVprasanj() * 100) : 0;
                    return new QuizResultResponseDTO(r.getId(), r.getQuiz().getId(), r.getQuiz().getNaziv(),
                            r.getTocke(), r.getSkupajVprasanj(), odstotek, r.getCasResevanjaS(),
                            r.getOddanoOb(), r.getOdgovori(), r.getXpZasluzen(), null, null);
                })
                .toList();
    }

    public List<QuizResultResponseDTO> getMojiRezultati(UUID ucenecId) {
        return quizResultRepository.findByUporabnikId(ucenecId).stream()
                .map(r -> {
                    int odstotek = r.getSkupajVprasanj() > 0
                            ? Math.round((float) r.getTocke() / r.getSkupajVprasanj() * 100) : 0;
                    return new QuizResultResponseDTO(r.getId(), r.getQuiz().getId(), r.getQuiz().getNaziv(),
                            r.getTocke(), r.getSkupajVprasanj(), odstotek, r.getCasResevanjaS(),
                            r.getOddanoOb(), r.getOdgovori(), r.getXpZasluzen(), null, null);
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

    @Transactional(readOnly = true)
    public List<ModulePerformanceDTO> getModulePerformanceZaUcitelja(UUID uciteljId) {
        List<Predmet> predmeti = predmetRepository.findByUciteljId(uciteljId);
        if (predmeti.isEmpty()) return List.of();

        List<UUID> predmetIds = predmeti.stream().map(Predmet::getId).toList();

        // Group enrollments by predmet
        Map<UUID, Long> enrolledByPredmet = vpisRepository.findByPredmetIdInAndJeAktivenTrue(predmetIds)
                .stream().collect(Collectors.groupingBy(v -> v.getPredmet().getId(), Collectors.counting()));

        // Group quizzes by predmet
        Map<UUID, List<Quiz>> kviziByPredmet = quizRepository.findByPredmetIdIn(predmetIds)
                .stream().collect(Collectors.groupingBy(q -> q.getPredmet().getId()));

        // Collect all quiz IDs and fetch results
        List<UUID> allKvizIds = kviziByPredmet.values().stream()
                .flatMap(List::stream).map(Quiz::getId).toList();
        Map<UUID, List<QuizResult>> resultsByKviz = allKvizIds.isEmpty()
                ? Map.of()
                : quizResultRepository.findByQuizIdIn(allKvizIds)
                        .stream().collect(Collectors.groupingBy(r -> r.getQuiz().getId()));

        List<ModulePerformanceDTO> result = new ArrayList<>();
        for (Predmet p : predmeti) {
            int totalStudents = enrolledByPredmet.getOrDefault(p.getId(), 0L).intValue();
            List<Quiz> kvizi = kviziByPredmet.getOrDefault(p.getId(), List.of());

            List<QuizPerformanceDTO> quizDTOs = new ArrayList<>();
            for (Quiz q : kvizi) {
                List<QuizResult> results = resultsByKviz.getOrDefault(q.getId(), List.of());
                int submissions = results.size();
                int avgScore = submissions == 0 ? 0
                        : (int) Math.round(results.stream()
                                .mapToDouble(r -> r.getSkupajVprasanj() > 0 ? (double) r.getTocke() / r.getSkupajVprasanj() * 100 : 0)
                                .average().orElse(0));
                long passed = results.stream()
                        .filter(r -> r.getSkupajVprasanj() > 0 && (double) r.getTocke() / r.getSkupajVprasanj() >= 0.5)
                        .count();
                int passRate = submissions == 0 ? 0 : (int) Math.round((double) passed / submissions * 100);
                quizDTOs.add(new QuizPerformanceDTO(q.getId(), q.getNaziv(), avgScore, submissions, passRate));
            }

            // Module aggregates
            List<QuizResult> allModuleResults = kvizi.stream()
                    .flatMap(q -> resultsByKviz.getOrDefault(q.getId(), List.of()).stream()).toList();
            int totalSubmissions = allModuleResults.size();
            int moduleAvgScore = totalSubmissions == 0 ? 0
                    : (int) Math.round(allModuleResults.stream()
                            .mapToDouble(r -> r.getSkupajVprasanj() > 0 ? (double) r.getTocke() / r.getSkupajVprasanj() * 100 : 0)
                            .average().orElse(0));
            long modulePassed = allModuleResults.stream()
                    .filter(r -> r.getSkupajVprasanj() > 0 && (double) r.getTocke() / r.getSkupajVprasanj() >= 0.5)
                    .count();
            int modulePassRate = totalSubmissions == 0 ? 0
                    : (int) Math.round((double) modulePassed / totalSubmissions * 100);
            Set<UUID> studentsWithPass = allModuleResults.stream()
                    .filter(r -> r.getSkupajVprasanj() > 0 && (double) r.getTocke() / r.getSkupajVprasanj() >= 0.5)
                    .map(QuizResult::getUporabnikId).collect(Collectors.toSet());
            int avgCompletion = totalStudents == 0 ? 0
                    : (int) Math.round((double) studentsWithPass.size() / totalStudents * 100);

            result.add(new ModulePerformanceDTO(p.getId(), p.getNaziv(),
                    totalStudents, moduleAvgScore, avgCompletion, modulePassRate, quizDTOs));
        }
        return result;
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
    @Transactional(readOnly = true)
    public ProgressStatsDTO getProgressStatsZaUcenca(UUID ucenecId) {
        List<QuizResult> vsiRezultati = quizResultRepository.findByUporabnikId(ucenecId);

        LocalDate danes = LocalDate.now(ZoneOffset.UTC);

        // ── BIWEEKLY XP (14 dni nazaj) ──
        LocalDate start14 = danes.minusDays(13);
        Map<LocalDate, Integer> xpPoDateumu = vsiRezultati.stream()
                .filter(r -> r.getOddanoOb() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getOddanoOb().atZoneSameInstant(ZoneOffset.UTC).toLocalDate(),
                        Collectors.summingInt(r -> r.getXpZasluzen() != null ? r.getXpZasluzen() : 0)
                ));

        List<ProgressStatsDTO.DailyXpDTO> biweekly = new ArrayList<>();
        for (int i = 0; i < 14; i++) {
            LocalDate dan = start14.plusDays(i);
            int xp = xpPoDateumu.getOrDefault(dan, 0);
            String label = dan.getMonth().getDisplayName(java.time.format.TextStyle.SHORT, Locale.ENGLISH)
                    + " " + dan.getDayOfMonth();
            biweekly.add(new ProgressStatsDTO.DailyXpDTO(label, xp));
        }

        // ── CALENDAR DAYS (35 dni — 5 tednov, začne prejšnji ponedeljek) ──
        LocalDate ponedeljek = danes.with(java.time.DayOfWeek.MONDAY).minusWeeks(4);
        List<ProgressStatsDTO.CalendarDayDTO> calendar = new ArrayList<>();
        for (int i = 0; i < 35; i++) {
            LocalDate dan = ponedeljek.plusDays(i);
            boolean future = dan.isAfter(danes);
            int xp = future ? 0 : xpPoDateumu.getOrDefault(dan, 0);
            calendar.add(new ProgressStatsDTO.CalendarDayDTO(dan.toString(), xp, future));
        }

        // ── STREAK ──
        int streak = 0;
        LocalDate check = danes;
        while (true) {
            int xp = xpPoDateumu.getOrDefault(check, 0);
            if (xp > 0) { streak++; check = check.minusDays(1); }
            else break;
        }

        int streakBest = 0, current = 0;
        LocalDate oldest = vsiRezultati.stream()
                .filter(r -> r.getOddanoOb() != null)
                .map(r -> r.getOddanoOb().atZoneSameInstant(ZoneOffset.UTC).toLocalDate())
                .min(Comparator.naturalOrder()).orElse(danes);
        for (LocalDate d = oldest; !d.isAfter(danes); d = d.plusDays(1)) {
            if (xpPoDateumu.getOrDefault(d, 0) > 0) {
                current++;
                streakBest = Math.max(streakBest, current);
            } else {
                current = 0;
            }
        }

        return new ProgressStatsDTO(biweekly, calendar, streak, streakBest);
    }
    @Transactional(readOnly = true)
    public WeeklyStatsDTO getWeeklyStatsZaProfesoria(UUID uciteljId, UUID predmetId) {
        // Pridobi predmete profesorja
        List<UUID> predmetIds;
        if (predmetId != null) {
            predmetIds = List.of(predmetId);
        } else {
            predmetIds = predmetRepository.findByUciteljId(uciteljId)
                    .stream().map(Predmet::getId).toList();
        }
        if (predmetIds.isEmpty()) return new WeeklyStatsDTO(buildEmptyWeek());

        // Pridobi vse kvize za te predmete
        List<UUID> kvizIds = quizRepository.findByPredmetIdIn(predmetIds)
                .stream().map(Quiz::getId).toList();
        if (kvizIds.isEmpty()) return new WeeklyStatsDTO(buildEmptyWeek());

        // Zadnjih 7 dni (pon–ned tega tedna)
        LocalDate danes = LocalDate.now(ZoneOffset.UTC);
        LocalDate ponedeljek = danes.with(java.time.DayOfWeek.MONDAY);

        // Pridobi rezultate tega tedna
        OffsetDateTime odKdaj = ponedeljek.atStartOfDay().atOffset(ZoneOffset.UTC);
        List<QuizResult> rezultati = quizResultRepository.findByQuizIdIn(kvizIds).stream()
                .filter(r -> r.getOddanoOb() != null && !r.getOddanoOb().isBefore(odKdaj))
                .toList();

        // Grupiraj po dnevu
        String[] dayNames = {"MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"};
        List<WeeklyStatsDTO.DayStatsDTO> days = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate dan = ponedeljek.plusDays(i);
            final LocalDate finalDan = dan;
            List<QuizResult> danResults = rezultati.stream()
                    .filter(r -> r.getOddanoOb().atZoneSameInstant(ZoneOffset.UTC)
                            .toLocalDate().equals(finalDan))
                    .toList();

            int xpSum = danResults.stream()
                    .mapToInt(r -> r.getXpZasluzen() != null ? r.getXpZasluzen() : 0)
                    .sum();

            int avgScore = danResults.isEmpty() ? 0
                    : (int) Math.round(danResults.stream()
                    .mapToDouble(r -> r.getSkupajVprasanj() != null && r.getSkupajVprasanj() > 0
                            ? (double) r.getTocke() / r.getSkupajVprasanj() * 100 : 0)
                    .average().orElse(0));

            days.add(new WeeklyStatsDTO.DayStatsDTO(dayNames[i], xpSum, avgScore));
        }

        return new WeeklyStatsDTO(days);
    }

    private List<WeeklyStatsDTO.DayStatsDTO> buildEmptyWeek() {
        String[] dayNames = {"MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"};
        List<WeeklyStatsDTO.DayStatsDTO> days = new ArrayList<>();
        for (String d : dayNames) days.add(new WeeklyStatsDTO.DayStatsDTO(d, 0, 0));
        return days;
    }
    @Transactional(readOnly = true)
    public List<ActivityItemDTO> getActivityZaProfesoria(UUID uciteljId) {
        List<UUID> predmetIds = predmetRepository.findByUciteljId(uciteljId)
                .stream().map(Predmet::getId).toList();
        if (predmetIds.isEmpty()) return List.of();

        List<Quiz> kvizi = quizRepository.findByPredmetIdIn(predmetIds);
        List<UUID> kvizIds = kvizi.stream().map(Quiz::getId).toList();

        List<ActivityItemDTO> items = new ArrayList<>();

        // Objavljeni kvizi
        kvizi.stream()
                .filter(q -> "PUBLISHED".equals(q.getStatus()) && q.getUstvarjenOb() != null)
                .forEach(q -> items.add(new ActivityItemDTO(
                        "QUIZ_PUBLISHED",
                        "Published quiz: " + q.getNaziv(),
                        "PUBLISHED",
                        q.getUstvarjenOb()
                )));

        // Rezultati učencev
        if (!kvizIds.isEmpty()) {
            Map<UUID, String> kvizNazivi = kvizi.stream()
                    .collect(Collectors.toMap(Quiz::getId, Quiz::getNaziv));
            Map<UUID, String> profilImena = new HashMap<>();

            quizResultRepository.findByQuizIdIn(kvizIds).forEach(r -> {
                if (r.getOddanoOb() == null) return;
                String ime = profilImena.computeIfAbsent(r.getUporabnikId(), id ->
                        profilRepository.findById(id)
                                .map(p -> p.getImePriimek() != null ? p.getImePriimek() : p.getUsername())
                                .orElse("Student")
                );
                int odstotek = r.getSkupajVprasanj() != null && r.getSkupajVprasanj() > 0
                        ? Math.round((float) r.getTocke() / r.getSkupajVprasanj() * 100) : 0;
                String naziv = kvizNazivi.getOrDefault(r.getQuiz().getId(), "Quiz");
                items.add(new ActivityItemDTO(
                        "QUIZ_RESULT",
                        ime + " completed: " + naziv,
                        odstotek + "%",
                        r.getOddanoOb()
                ));
            });
        }

        return items.stream()
                .sorted(Comparator.comparing(ActivityItemDTO::getDate).reversed())
                .limit(10)
                .toList();
    }
}