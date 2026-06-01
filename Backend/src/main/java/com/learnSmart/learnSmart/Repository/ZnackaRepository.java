package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.Znacka;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ZnackaRepository extends JpaRepository<Znacka, UUID> {
}
