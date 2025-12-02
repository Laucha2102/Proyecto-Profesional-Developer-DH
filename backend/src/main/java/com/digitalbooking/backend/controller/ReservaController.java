package com.digitalbooking.backend.controller;

import com.digitalbooking.backend.dto.ReservaRequest; 
import com.digitalbooking.backend.model.Reserva;
import com.digitalbooking.backend.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails; 
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;


    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Reserva>> getReservasPorProducto(@PathVariable Long productoId) {
        List<Reserva> reservas = reservaService.listarReservasPorProducto(productoId);
        return ResponseEntity.ok(reservas);
    }

    @PostMapping
    public ResponseEntity<?> crearReserva(
            @RequestBody ReservaRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            String userEmail = userDetails.getUsername();
            Reserva nuevaReserva = reservaService.crearReserva(request, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaReserva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear la reserva.");
        }
    }

    @GetMapping("/mis-reservas")
    public ResponseEntity<List<Reserva>> getMisReservas(@AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        List<Reserva> reservas = reservaService.listarReservasPorUsuario(userEmail);
        return ResponseEntity.ok(reservas);
    }
}