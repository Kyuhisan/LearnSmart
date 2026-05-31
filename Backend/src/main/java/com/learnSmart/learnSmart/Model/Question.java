package com.learnSmart.learnSmart.Model;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.List;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "vprasanja")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kviz_id", nullable = true)
    private Quiz quiz;

    @Column(name = "predmet_id", columnDefinition = "uuid")
    private UUID predmetId;

    @Column(name = "besedilo_vprasanja", nullable = false, columnDefinition = "text")
    private String besediloVprasanja;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "moznosti", nullable = false, columnDefinition = "jsonb")
    private List<String> moznosti;

    @Column(name = "indeks_pravilnega_odgovora", nullable = false)
    private Integer indeksPravilnegaOdgovora;

    @Column(name = "razlaga", columnDefinition = "text")
    private String razlaga;

    @Column(name = "tezavnost")
    private String tezavnost;
}