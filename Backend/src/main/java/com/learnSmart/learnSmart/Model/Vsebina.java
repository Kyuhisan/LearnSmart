package com.learnSmart.learnSmart.Model;

import jakarta.persistence.*;
import lombok.*;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.List;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "vsebine")
public class Vsebina {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "predmet_id", nullable = false)
    private Predmet predmet;

    @Column(name = "naziv", nullable = false)
    private String naziv;

    @Column(name = "tip", nullable = false)
    private String tip; // VIDEO, PDF, TEXT

    @Column(name = "url", columnDefinition = "text")
    private String url;

    @Column(name = "ucni_stil")
    private String ucniStil;

    @Column(name = "vrstni_red")
    private Integer vrstniRed;

    @OneToMany(mappedBy = "vsebina", cascade = CascadeType.ALL)
    private List<Interakcija> interakcije;

}