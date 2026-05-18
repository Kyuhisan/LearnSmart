package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.Vsebina;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface VsebinaRepository extends JpaRepository<Vsebina, UUID> {}