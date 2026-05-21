package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface IzvornaDatotekaRepository extends JpaRepository<IzvornaDatoteka, UUID> {}