package com.digitalbooking.backend.repository;

import com.digitalbooking.backend.model.Producto;
import org.springframework.data.domain.Page;         
import org.springframework.data.domain.Pageable;      
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate; 
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {


    boolean existsByNombre(String nombre);

    @Query(value = "SELECT p FROM Producto p " +
                   "LEFT JOIN FETCH p.imagenes " +
                   "LEFT JOIN FETCH p.categoria " +
                   "LEFT JOIN FETCH p.ciudad " +
                   "ORDER BY NEWID()", 
           countQuery = "SELECT count(p) FROM Producto p")
    List<Producto> findRandom10();

    @Query("SELECT p FROM Producto p " +
           "LEFT JOIN FETCH p.imagenes " +
           "LEFT JOIN FETCH p.categoria " +
           "LEFT JOIN FETCH p.ciudad " +
           "LEFT JOIN FETCH p.caracteristicas " +
           "LEFT JOIN FETCH p.politicas " + 
           "WHERE p.id = :id")
    Optional<Producto> findByIdWithDetails(Long id);


    @Query(value = "SELECT DISTINCT p FROM Producto p " +
                   "LEFT JOIN FETCH p.imagenes " +
                   "LEFT JOIN FETCH p.categoria " +
                   "LEFT JOIN FETCH p.ciudad",
           countQuery = "SELECT count(p) FROM Producto p")
    Page<Producto> findAllWithDetails(Pageable pageable); 

    @Query("SELECT DISTINCT p FROM Producto p " +
           "LEFT JOIN FETCH p.imagenes " +
           "LEFT JOIN FETCH p.categoria " +
           "LEFT JOIN FETCH p.ciudad " +
           "WHERE p.categoria.id = :categoriaId")
    List<Producto> findByCategoriaIdWithDetails(Long categoriaId); 

    @Query("SELECT DISTINCT p FROM Producto p " +
           "LEFT JOIN FETCH p.imagenes " +
           "LEFT JOIN FETCH p.categoria " +
           "LEFT JOIN FETCH p.ciudad " +
           "WHERE p.ciudad.id = :ciudadId AND NOT EXISTS (" +
           "   SELECT r FROM Reserva r " +
           "   WHERE r.producto.id = p.id AND " +
           "   (r.fechaInicio < :fechaFin AND r.fechaFin > :fechaInicio)" +
           ")")
    List<Producto> findAvailableByCityAndDates(Long ciudadId, LocalDate fechaInicio, LocalDate fechaFin);
}