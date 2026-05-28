package com.learnSmart.learnSmart.Repository;

import com.learnSmart.learnSmart.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findByPredmetId(UUID predmetId);
    List<Question> findByPredmetIdAndQuizIsNull(UUID predmetId);
    List<Question> findByQuizId(UUID quizId);
    void deleteById(UUID id);
}