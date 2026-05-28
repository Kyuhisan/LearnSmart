package com.learnSmart.learnSmart.Model;

import jakarta.persistence.*;
import lombok.*;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.time.OffsetDateTime;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "vpisi")
public class Vpis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "ucenec_id", nullable = false, columnDefinition = "uuid")
    private UUID ucenecId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "predmet_id", nullable = false)
    private Predmet predmet;

    @Column(name = "vpisan_ob")
    private OffsetDateTime vpisanOb;

    @Column(name = "zakljucen_ob")
    private OffsetDateTime zakljucenOb;

    @Column(name = "cas_na_modulu")
    private Integer casNaModulu = 0; // sekunde

    @Column(name = "je_aktiven", columnDefinition = "boolean default true")
    private Boolean jeAktiven = true;

    @Column(name = "odjavljen_ob")
    private OffsetDateTime odjavljenOb;

}
