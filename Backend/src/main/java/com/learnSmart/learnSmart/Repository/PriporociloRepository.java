package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.Priporocilo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PriporociloRepository extends JpaRepository<Priporocilo, UUID> {
}
