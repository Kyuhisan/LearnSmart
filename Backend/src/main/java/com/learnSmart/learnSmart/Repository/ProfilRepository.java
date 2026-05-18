package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ProfilRepository extends JpaRepository<Profil, UUID> {}
