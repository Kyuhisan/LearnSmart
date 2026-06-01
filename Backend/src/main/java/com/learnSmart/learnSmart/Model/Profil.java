package com.learnSmart.learnSmart.Model;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.OffsetDateTime;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "profili")
public class Profil {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "email")
    private String email;

    @Column(name = "ime_priimek")
    private String imePriimek;

    @Column(name = "slika_url")
    private String slikaUrl;

    @Column(name = "vloga")
    private String vloga;

    @Column(name = "ustvarjen_ob")
    private OffsetDateTime ustvarjenOb;

    @Column(name = "username")
    private String username;

    @Column(name = "ucni_tip")
    private String ucniTip;

    @Column(name = "vark_visual")
    private Integer varkVisual;

    @Column(name = "vark_auditory")
    private Integer varkAuditory;

    @Column(name = "vark_reading")
    private Integer varkReading;

    @Column(name = "vark_kinesthetic")
    private Integer varkKinesthetic;

    @Column(name = "xp", nullable = false, columnDefinition = "integer default 0")
    private Integer xp = 0;

    @Column(name = "nivo", nullable = false, columnDefinition = "integer default 1")
    private Integer nivo = 1;

    @OneToMany(mappedBy = "profil", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<Znacka> znacke = new ArrayList<>();
}