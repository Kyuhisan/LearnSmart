package com.learnSmart.learnSmart.Model;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "rezultati_kvizov")
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "uporabnik_id", nullable = false, columnDefinition = "uuid")
    private UUID uporabnikId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kviz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "tocke", nullable = false)
    private Integer tocke;

    @Column(name = "skupaj_vprasanj", nullable = false)
    private Integer skupajVprasanj;

    @Column(name = "oddano_ob")
    private OffsetDateTime oddanoOb;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "odgovori", columnDefinition = "jsonb")
    private List<Integer> odgovori;
}