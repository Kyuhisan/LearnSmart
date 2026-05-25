package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.VsebinaPredmet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VsebinaPredmetRepository extends JpaRepository<VsebinaPredmet, UUID> {
    void deleteByPredmetId(UUID predmetId);
}
