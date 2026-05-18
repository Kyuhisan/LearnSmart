package com.learnSmart.learnSmart.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "interakcije")
public class Interakcija {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "uporabik_id", nullable = false, columnDefinition = "uuid")
    private UUID uporabikId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vsebina_id", nullable = false)
    private Vsebina vsebina;

    @Column(name = "ogledano_ob")
    private OffsetDateTime ogledanoOb;

    @Column(name = "cas_sekunde")
    private Integer casSekunde;

    @Column(name = "zakljuceno", nullable = false)
    private boolean zakljuceno = false;

}