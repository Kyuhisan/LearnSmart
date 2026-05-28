package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.Vpis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VpisRepository extends JpaRepository<Vpis, UUID> {
    Optional<Vpis> findByUcenecIdAndPredmetId(UUID ucenecId, UUID predmetId);
    Optional<Vpis> findByUcenecIdAndPredmetIdAndJeAktivenTrue(UUID ucenecId, UUID predmetId);
    List<Vpis> findByUcenecId(UUID ucenecId);
    List<Vpis> findByUcenecIdAndJeAktivenTrue(UUID ucenecId);
    boolean existsByUcenecIdAndPredmetId(UUID ucenecId, UUID predmetId);
    boolean existsByUcenecIdAndPredmetIdAndJeAktivenTrue(UUID ucenecId, UUID predmetId);
    long countByPredmetIdAndJeAktivenTrue(UUID predmetId);
    List<Vpis> findByPredmetIdInAndJeAktivenTrue(Collection<UUID> predmetIds);
}