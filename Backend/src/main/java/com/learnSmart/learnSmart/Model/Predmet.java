package com.learnSmart.learnSmart.Model;

import jakarta.persistence.*;
import lombok.*;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "predmeti")
public class Predmet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "ucitelj_id", nullable = false, columnDefinition = "uuid")
    private UUID uciteljId;

    @Column(name = "naziv", nullable = false)
    private String naziv;

    @Column(name = "opis", columnDefinition = "text")
    private String opis;

    @Column(name = "koda_vpisa", unique = true)
    private String kodaVpisa;

    @Column(name = "ustvarjen_ob")
    private OffsetDateTime ustvarjenOb;

    @Column(name = "je_objavljen", nullable = false)
    private boolean jeObjavljen = false;

    @Column(name = "tezavnost")
    private Integer tezavnost;

    @Column(name = "zdruzen_transcript", columnDefinition = "text")
    private String zdruzenTranscript;

    @Column(name = "koraki_obdelave", columnDefinition = "jsonb")
    private String korakiObdelave;

    @Column (name = "status")
    private String status;

    @OneToMany(mappedBy = "predmet", cascade = CascadeType.ALL)
    private List<IzvornaDatoteka> izvorneDatoteke;

    @OneToMany(mappedBy = "predmet", cascade = CascadeType.ALL)
    private List<Vpis> vpisi;

}