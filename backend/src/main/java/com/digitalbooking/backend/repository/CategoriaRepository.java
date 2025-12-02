package com.digitalbooking.backend.repository; 

import com.digitalbooking.backend.model.Categoria; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}