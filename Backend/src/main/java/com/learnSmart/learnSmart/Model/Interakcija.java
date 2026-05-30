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
@Table(name = "interakcije")
public class Interakcija {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "uporabik_id", nullable = false, columnDefinition = "uuid")
    private UUID uporabikId;

    @Column(name = "ogledano_ob")
    private OffsetDateTime ogledanoOb;

    @Column(name = "cas_sekunde")
    private Integer casSekunde;

    @Column(name = "zakljuceno", nullable = false)
    private boolean zakljuceno = false;

}