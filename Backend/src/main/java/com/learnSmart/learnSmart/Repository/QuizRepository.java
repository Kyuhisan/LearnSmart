
package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    List<Quiz> findByPredmetId(UUID predmetId);
    List<Quiz> findByPredmetIdAndStatus(UUID predmetId, String status);
    List<Quiz> findByPredmetIdIn(Collection<UUID> predmetIds);
}