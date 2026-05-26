package com.learnSmart.learnSmart.Model;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "kvizi")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "predmet_id", nullable = false)
    private Predmet predmet;

    @Column(name = "naziv", nullable = false)
    private String naziv;

    @Column(name = "generiran_z_ai", nullable = false)
    private boolean generiranZAi = false;

    @Column(name = "status", nullable = false)
    private String status = "DRAFT"; // DRAFT / PUBLISHED

    @Column(name = "cas_izvajanja")
    private Integer casIzvajanja; // minute

    @Column(name = "ustvarjen_ob")
    private OffsetDateTime ustvarjenOb;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<Question> vprasanja;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<QuizResult> rezultati;
}