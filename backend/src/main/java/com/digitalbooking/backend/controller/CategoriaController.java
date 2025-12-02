package com.digitalbooking.backend.controller;

import com.digitalbooking.backend.exception.ResourceNotFoundException; 
import com.digitalbooking.backend.model.Categoria;
import com.digitalbooking.backend.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; 
import java.util.List;

@RestController
@RequestMapping("/api/categorias") 
@CrossOrigin(origins = "http://localhost:5173") 
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<Categoria>> listarTodas() {
        List<Categoria> categorias = categoriaService.listarTodas();
        return ResponseEntity.ok(categorias);
    }

    @PostMapping
    public ResponseEntity<Categoria> crearCategoria(@RequestBody Categoria categoria) {
        Categoria nueva = categoriaService.crearCategoria(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Long id) {
        try {
            categoriaService.eliminarCategoria(id);
            return ResponseEntity.ok("Categoría eliminada exitosamente con ID: " + id);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
}