package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.Predmet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PredmetRepository extends JpaRepository<Predmet, UUID> {
    Optional<Predmet> findByKodaVpisa(String kodaVpisa);
}