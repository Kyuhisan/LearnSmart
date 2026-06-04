package com.learnSmart.learnSmart.Model;

import com.learnSmart.learnSmart.Enum.LearningStyleSource;
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
@Table(name = "ucni_tip_zgodovina")
public class UcniTipZgodovina {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profil_id", nullable = false)
    private Profil profil;

    @Column(name = "ucni_tip", nullable = false)
    private String ucniTip;

    @Column(name = "ustvarjen_ob", nullable = false)
    private OffsetDateTime ustvarjenOb;

    @Enumerated(EnumType.STRING)
    @Column(name = "vir", nullable = false)
    private LearningStyleSource vir;

}
