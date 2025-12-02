package com.digitalbooking.backend.repository;

import com.digitalbooking.backend.model.Puntuacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; 
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PuntuacionRepository extends JpaRepository<Puntuacion, Long> {

    @Query("SELECT p FROM Puntuacion p " +
           "LEFT JOIN FETCH p.user u " +
           "LEFT JOIN FETCH p.producto pr " + 
           "WHERE p.producto.id = :productoId")
    List<Puntuacion> findByProductoIdWithUser(Long productoId);
}