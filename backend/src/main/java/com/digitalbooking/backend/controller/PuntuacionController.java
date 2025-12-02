package com.digitalbooking.backend.controller;

import com.digitalbooking.backend.model.Puntuacion;
import com.digitalbooking.backend.service.PuntuacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puntuaciones")
public class PuntuacionController {

    @Autowired
    private PuntuacionService puntuacionService;

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Puntuacion>> getPuntuacionesPorProducto(@PathVariable Long productoId) {
        List<Puntuacion> puntuaciones = puntuacionService.listarPuntuacionesPorProducto(productoId);
        return ResponseEntity.ok(puntuaciones);
    }


    @PostMapping
    public ResponseEntity<?> crearPuntuacion(
            @RequestBody PuntuacionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            String userEmail = userDetails.getUsername();
            Puntuacion nueva = puntuacionService.crearPuntuacion(
                    request.getProductoId(),
                    userEmail,
                    request.getValor(),
                    request.getComentario()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    static class PuntuacionRequest {
        private Long productoId;
        private int valor;
        private String comentario;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public int getValor() { return valor; }
        public void setValor(int valor) { this.valor = valor; }
        public String getComentario() { return comentario; }
        public void setComentario(String comentario) { this.comentario = comentario; }
    }
}