package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Enum.BadgeType;
import com.learnSmart.learnSmart.Model.Znacka;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ZnackaRepository extends JpaRepository<Znacka, UUID> {
    boolean existsByProfilIdAndType(UUID profilId, BadgeType type);
    List<Znacka> findByProfilId(UUID profilId);
}
