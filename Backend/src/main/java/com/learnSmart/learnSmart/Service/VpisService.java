package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.DTO.Predmet.ModuleStudentsDTO;
import com.learnSmart.learnSmart.DTO.Predmet.StudentSummaryDTO;
import com.learnSmart.learnSmart.DTO.Predmet.VpisResponseDTO;
import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Model.Profil;
import com.learnSmart.learnSmart.Model.Quiz;
import com.learnSmart.learnSmart.Model.QuizResult;
import com.learnSmart.learnSmart.Model.Vpis;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
import com.learnSmart.learnSmart.Repository.ProfilRepository;
import com.learnSmart.learnSmart.Repository.QuizRepository;
import com.learnSmart.learnSmart.Repository.QuizResultRepository;
import com.learnSmart.learnSmart.Repository.VpisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VpisService {

    private static final String PREDMET_NE_OBSTAJA = "Module does not exist";
    private static final String ZE_VPISAN = "Already enrolled";
    private static final String NAPACNA_KODA = "Invalid enrollment code";
    private static final String VPIS_NE_OBSTAJA = "Enrollment does not exist";

    private final VpisRepository vpisRepository;
    private final PredmetRepository predmetRepository;
    private final ProfilRepository profilRepository;
    private final QuizRepository quizRepository;
    private final QuizResultRepository quizResultRepository;

    // Vpis z kodo
    public VpisResponseDTO vpisZKodo(String kodaVpisa, UUID ucenecId) {
        Predmet predmet = predmetRepository.findByKodaVpisa(kodaVpisa)
                .orElseThrow(() -> new RuntimeException(NAPACNA_KODA));

        if (vpisRepository.existsByUcenecIdAndPredmetIdAndJeAktivenTrue(ucenecId, predmet.getId())) {
            throw new RuntimeException(ZE_VPISAN);
        }

        Vpis vpis = new Vpis();
        vpis.setUcenecId(ucenecId);
        vpis.setPredmet(predmet);
        vpis.setVpisanOb(OffsetDateTime.now());
        vpis.setCasNaModulu(0);

        return toResponse(vpisRepository.save(vpis));
    }

    // Moji vpisi
    public List<VpisResponseDTO> getMojiVpisi(UUID ucenecId) {
        return vpisRepository.findByUcenecIdAndJeAktivenTrue(ucenecId).stream()
                .map(this::toResponse)
                .toList();
    }

    // Posodobi cas na modulu
    public VpisResponseDTO posodobiCas(UUID predmetId, UUID ucenecId, Integer cas) {
        Vpis vpis = vpisRepository.findByUcenecIdAndPredmetIdAndJeAktivenTrue(ucenecId, predmetId)
                .orElseThrow(() -> new RuntimeException(VPIS_NE_OBSTAJA));
        vpis.setCasNaModulu((vpis.getCasNaModulu() == null ? 0 : vpis.getCasNaModulu()) + cas);
        return toResponse(vpisRepository.save(vpis));
    }

    // Stevilo vpisanih ucencev za modul
    public long steviloVpisanih(UUID predmetId) {
        return vpisRepository.countByPredmetIdAndJeAktivenTrue(predmetId);
    }

    // Stil mix za ucitelja (unique students across all professor modules)
    public Map<String, Long> getStilMixZaUcitelja(UUID uciteljId) {
        List<UUID> predmetIds = predmetRepository.findByUciteljId(uciteljId)
                .stream().map(Predmet::getId).toList();

        if (predmetIds.isEmpty()) return Map.of();

        Set<UUID> ucenecIds = vpisRepository.findByPredmetIdInAndJeAktivenTrue(predmetIds)
                .stream().map(Vpis::getUcenecId).collect(Collectors.toSet());

        Map<String, Long> result = new LinkedHashMap<>();
        result.put("visual", 0L);
        result.put("reading", 0L);
        result.put("auditory", 0L);
        result.put("kinesthetic", 0L);

        profilRepository.findAllById(ucenecIds).stream()
                .map(Profil::getUcniTip)
                .filter(t -> t != null && result.containsKey(t))
                .forEach(t -> result.merge(t, 1L, Long::sum));

        result.put("_total", (long) ucenecIds.size());
        return result;
    }

    // Shared helper: compute avgScore map (ucenecId → avg accuracy %) for a professor's quizzes
    private Map<UUID, Integer> avgScoreMap(List<UUID> predmetIds) {
        List<UUID> kvizIds = quizRepository.findByPredmetIdIn(predmetIds)
                .stream().map(Quiz::getId).toList();
        if (kvizIds.isEmpty()) return Map.of();
        return quizResultRepository.findByQuizIdIn(kvizIds).stream()
                .filter(r -> r.getSkupajVprasanj() != null && r.getSkupajVprasanj() > 0)
                .collect(Collectors.groupingBy(
                        QuizResult::getUporabnikId,
                        Collectors.collectingAndThen(
                                Collectors.averagingDouble(r ->
                                        (double) r.getTocke() / r.getSkupajVprasanj() * 100.0),
                                avg -> (int) Math.round(avg)
                        )
                ));
    }

    // Flat list of unique students enrolled in any of the professor's modules
    public List<StudentSummaryDTO> getStudentiZaUcitelja(UUID uciteljId) {
        List<Predmet> predmeti = predmetRepository.findByUciteljId(uciteljId);
        if (predmeti.isEmpty()) return List.of();
        List<UUID> predmetIds = predmeti.stream().map(Predmet::getId).toList();

        List<Vpis> vpisi = vpisRepository.findByPredmetIdInAndJeAktivenTrue(predmetIds);
        if (vpisi.isEmpty()) return List.of();

        Map<UUID, Long> moduliCount = vpisi.stream()
                .collect(Collectors.groupingBy(Vpis::getUcenecId, Collectors.counting()));
        Map<UUID, Integer> avgScore = avgScoreMap(predmetIds);
        Map<UUID, Profil> profilMap = profilRepository.findAllById(moduliCount.keySet())
                .stream().collect(Collectors.toMap(Profil::getId, p -> p));

        return moduliCount.entrySet().stream()
                .map(e -> {
                    Profil p = profilMap.get(e.getKey());
                    return new StudentSummaryDTO(
                            e.getKey(),
                            p != null ? p.getImePriimek() : e.getKey().toString(),
                            p != null ? p.getUcniTip() : null,
                            avgScore.getOrDefault(e.getKey(), 0),
                            e.getValue().intValue()
                    );
                })
                .sorted(Comparator.comparing(StudentSummaryDTO::getImePriimek))
                .toList();
    }

    // Students grouped by each of the professor's modules
    public List<ModuleStudentsDTO> getStudentiPoModulihZaUcitelja(UUID uciteljId) {
        List<Predmet> predmeti = predmetRepository.findByUciteljId(uciteljId);
        if (predmeti.isEmpty()) return List.of();
        List<UUID> predmetIds = predmeti.stream().map(Predmet::getId).toList();

        List<Vpis> vpisi = vpisRepository.findByPredmetIdInAndJeAktivenTrue(predmetIds);
        Map<UUID, Integer> avgScore = avgScoreMap(predmetIds);

        Map<UUID, List<UUID>> byModule = vpisi.stream()
                .collect(Collectors.groupingBy(
                        v -> v.getPredmet().getId(),
                        Collectors.mapping(Vpis::getUcenecId, Collectors.toList())
                ));

        Set<UUID> allIds = vpisi.stream().map(Vpis::getUcenecId).collect(Collectors.toSet());
        Map<UUID, Profil> profilMap = profilRepository.findAllById(allIds)
                .stream().collect(Collectors.toMap(Profil::getId, p -> p));

        return predmeti.stream()
                .map(predmet -> {
                    List<UUID> ids = byModule.getOrDefault(predmet.getId(), List.of());
                    List<StudentSummaryDTO> students = ids.stream()
                            .map(id -> {
                                Profil p = profilMap.get(id);
                                return new StudentSummaryDTO(
                                        id,
                                        p != null ? p.getImePriimek() : id.toString(),
                                        p != null ? p.getUcniTip() : null,
                                        avgScore.getOrDefault(id, 0),
                                        1
                                );
                            })
                            .sorted(Comparator.comparing(StudentSummaryDTO::getImePriimek))
                            .toList();
                    return new ModuleStudentsDTO(predmet.getId(), predmet.getNaziv(), students);
                })
                .toList();
    }

    // Odjava iz modula (soft delete)
    public void odjava(UUID predmetId, UUID ucenecId) {
        Vpis vpis = vpisRepository.findByUcenecIdAndPredmetIdAndJeAktivenTrue(ucenecId, predmetId)
                .orElseThrow(() -> new RuntimeException(VPIS_NE_OBSTAJA));
        vpis.setJeAktiven(false);
        vpis.setOdjavljenOb(OffsetDateTime.now());
        vpisRepository.save(vpis);
    }

    private VpisResponseDTO toResponse(Vpis vpis) {
        VpisResponseDTO dto = new VpisResponseDTO();
        dto.setId(vpis.getId());
        dto.setPredmetId(vpis.getPredmet().getId());
        dto.setPredmetNaziv(vpis.getPredmet().getNaziv());
        dto.setVpisanOb(vpis.getVpisanOb());
        dto.setCasNaModulu(vpis.getCasNaModulu());
        return dto;
    }
}