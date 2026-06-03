package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuizResultRepository extends JpaRepository<QuizResult, UUID> {
    List<QuizResult> findByQuizId(UUID quizId);
    List<QuizResult> findByUporabnikId(UUID uporabnikId);
    Optional<QuizResult> findByQuizIdAndUporabnikId(UUID quizId, UUID uporabnikId);
    List<QuizResult> findByQuizIdIn(Collection<UUID> quizIds);
    long countByQuiz_IdAndUporabnikId(UUID quizId, UUID uporabnikId);
    long countByUporabnikId(UUID uporabnikId);
    List<QuizResult> findByUporabnikIdIn(Collection<UUID> uporabnikIds);
}