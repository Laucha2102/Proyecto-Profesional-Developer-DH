package com.digitalbooking.backend.repository;

import com.digitalbooking.backend.model.Politica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PoliticaRepository extends JpaRepository<Politica, Long> {
    
}