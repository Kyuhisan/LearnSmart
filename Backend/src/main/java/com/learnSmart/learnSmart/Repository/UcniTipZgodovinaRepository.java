package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.UcniTipZgodovina;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UcniTipZgodovinaRepository extends JpaRepository<UcniTipZgodovina, UUID> {
}
