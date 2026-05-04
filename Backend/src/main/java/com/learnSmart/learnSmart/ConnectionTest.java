package com.learnSmart.learnSmart;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "connection_test")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String message;
}