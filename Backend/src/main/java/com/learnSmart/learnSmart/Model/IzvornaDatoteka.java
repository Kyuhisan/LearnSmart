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
@Table(name = "izvorne_datoteke")
public class IzvornaDatoteka {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "predmet_id", nullable = false)
    private Predmet predmet;

    @Column(name = "ime_datoteke", nullable = false)
    private String imeDatoteke;

    @Column(name = "url", columnDefinition = "text")
    private String url;

    @Column(name = "tip", nullable = false)
    private String tip; // VIDEO, PDF, TEXT

    @Column(name = "velikost_bytes")
    private Long velikostBytes;

    @Column(name = "processing_status")
    private String processingStatus;

    @Column(name = "ustvarjen_ob")
    private OffsetDateTime ustvarjenOb;

    @Column(name = "manjsi_transcript", columnDefinition = "text")
    private String manjsiTranscript;

    @OneToMany(mappedBy = "izvornaDatoteka", cascade = CascadeType.ALL)
    private List<Interakcija> interakcije;

}