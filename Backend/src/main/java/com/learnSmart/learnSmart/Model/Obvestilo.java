package com.learnSmart.learnSmart.Model;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "obvestila")
public class Obvestilo {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "uporabnik_id", nullable = false, columnDefinition = "uuid")
    private UUID uporabnikId;

    @Column(name = "tip", nullable = false)
    private String tip; // QUIZ, MODULE, SYSTEM

    @Column(name = "naslov", nullable = false)
    private String naslov;

    @Column(name = "sporocilo", columnDefinition = "text")
    private String sporocilo;

    @Column(name = "je_prebrano")
    private boolean jePrebrano = false;

    @Column(name = "ustvarjeno_ob")
    private OffsetDateTime ustvarjenoOb;

    @Column(name = "povezava")
    private String povezava;
}