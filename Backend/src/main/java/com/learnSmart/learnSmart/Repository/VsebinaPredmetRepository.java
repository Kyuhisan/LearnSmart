package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Model.VsebinaPredmet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VsebinaPredmetRepository extends JpaRepository<VsebinaPredmet, UUID> {
    void deleteByPredmetId(UUID predmetId);

    Iterable<UUID> predmet(Predmet predmet);
    List<VsebinaPredmet> findByPredmetId(UUID predmetId);
}
