package com.digitalbooking.backend.repository;

import com.digitalbooking.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query("SELECT r FROM Reserva r WHERE r.producto.id = :productoId AND r.fechaFin >= :fechaActual")
    List<Reserva> findReservasFuturasPorProducto(Long productoId, LocalDate fechaActual);

    @Query("SELECT r FROM Reserva r " +
           "WHERE r.producto.id = :productoId AND " +
           "r.fechaInicio < :fechaFin AND r.fechaFin > :fechaInicio")
    List<Reserva> findOverlappingReservas(Long productoId, LocalDate fechaInicio, LocalDate fechaFin);

    @Query("SELECT r FROM Reserva r " +
           "LEFT JOIN FETCH r.producto p " +
           "WHERE r.user.email = :userEmail " +
           "ORDER BY r.fechaInicio DESC")
    List<Reserva> findByUserEmailWithProducto(String userEmail);
}