package com.learnSmart.learnSmart.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

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

}
