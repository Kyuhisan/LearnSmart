package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.Vpis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface VpisRepository extends JpaRepository<Vpis, UUID> {}