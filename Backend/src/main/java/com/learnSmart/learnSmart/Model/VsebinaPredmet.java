package com.learnSmart.learnSmart.Model;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.*;

@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "vsebina_predmet")
public class VsebinaPredmet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "uuid")
    private UUID vsebinaPredmetId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "predmet_id", nullable = false)
    private Predmet predmet;

    @Column(name = "ucni_tip", nullable = false, columnDefinition = "text")
    private String ucniTip;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "vsebina", nullable = true, columnDefinition = "jsonb")
    private Map<String, Object> vsebina;

    @Column(name = "posodobljen_ob", nullable = true)
    private OffsetDateTime posodobljenOb;

}
