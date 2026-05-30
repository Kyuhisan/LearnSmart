package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.Obvestilo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ObvestiloRepository extends JpaRepository<Obvestilo, UUID> {
    List<Obvestilo> findByUporabnikIdOrderByUstvarjenoObDesc(UUID uporabnikId);
    long countByUporabnikIdAndJePrebranoFalse(UUID uporabnikId);
}