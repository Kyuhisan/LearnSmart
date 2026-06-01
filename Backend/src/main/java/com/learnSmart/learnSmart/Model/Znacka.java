package com.learnSmart.learnSmart.Model;

import com.learnSmart.learnSmart.Enum.BadgeType;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "znacka")
public class Znacka {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profil_id", nullable = false)
    private Profil profil;

    @Enumerated(EnumType.STRING)
    @Column(name = "tip", nullable = false)
    private BadgeType tip;

    @Column(name = "pridobljen_ob", nullable = false)
    private OffsetDateTime pridobljenOb;

    @Column(name = "opis", nullable = false)
    private String opis;
}
