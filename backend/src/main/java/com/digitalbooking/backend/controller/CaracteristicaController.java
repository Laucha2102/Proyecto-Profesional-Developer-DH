package com.digitalbooking.backend.controller;

import com.digitalbooking.backend.exception.ResourceNotFoundException; 
import com.digitalbooking.backend.model.Caracteristica;
import com.digitalbooking.backend.service.CaracteristicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; 
import java.util.List;

@RestController
@RequestMapping("/api/caracteristicas") 
@CrossOrigin(origins = "http://localhost:5173")
public class CaracteristicaController {

    @Autowired
    private CaracteristicaService caracteristicaService;

    @GetMapping
    public ResponseEntity<List<Caracteristica>> listarTodas() {
        List<Caracteristica> caracteristicas = caracteristicaService.listarTodas();
        return ResponseEntity.ok(caracteristicas);
    }

    @PostMapping
    public ResponseEntity<Caracteristica> crearCaracteristica(@RequestBody Caracteristica caracteristica) {
        Caracteristica nueva = caracteristicaService.crearCaracteristica(caracteristica);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCaracteristica(@PathVariable Long id, @RequestBody Caracteristica caracteristicaDetalles) {
        try {
            Caracteristica actualizada = caracteristicaService.actualizarCaracteristica(id, caracteristicaDetalles);
            return ResponseEntity.ok(actualizada);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCaracteristica(@PathVariable Long id) {
        try {
            caracteristicaService.eliminarCaracteristica(id);
            return ResponseEntity.ok("Característica eliminada exitosamente con ID: " + id);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}