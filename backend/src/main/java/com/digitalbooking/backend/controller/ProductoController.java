package com.digitalbooking.backend.controller;

import org.springframework.data.domain.Page;
import com.digitalbooking.backend.exception.ResourceNotFoundException;
import com.digitalbooking.backend.model.Producto;
import com.digitalbooking.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping("/disponibles")
    public ResponseEntity<List<Producto>> buscarProductosDisponibles(
        @RequestParam Long ciudadId,
        @RequestParam LocalDate fechaInicio,
        @RequestParam LocalDate fechaFin) {
    
    List<Producto> productos = productoService.listarProductosDisponibles(ciudadId, fechaInicio, fechaFin);
    return ResponseEntity.ok(productos);
}

    @PostMapping
    public ResponseEntity<?> crearProducto(@RequestBody Producto producto) {
        try {
            Producto nuevoProducto = productoService.crearProducto(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarProductoPorId(@PathVariable Long id) {
        try {
            Producto producto = productoService.buscarPorId(id);
            return ResponseEntity.ok(producto);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/random")
    public ResponseEntity<List<Producto>> getRandomProductos() {
        List<Producto> productos = productoService.obtenerProductosAleatorios();
        return ResponseEntity.ok(productos);
    }

    @GetMapping
    public ResponseEntity<Page<Producto>> getAllProductos(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

    Page<Producto> productos = productoService.listarTodosLosProductos(page, size);
    return ResponseEntity.ok(productos);
}

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        try {
            productoService.eliminarProducto(id);
            return ResponseEntity.ok("Producto eliminado exitosamente con ID: " + id);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

     @GetMapping("/categoria/{id}")
    public ResponseEntity<List<Producto>> buscarProductosPorCategoria(@PathVariable Long id) {
    List<Producto> productos = productoService.listarPorCategoria(id);
    return ResponseEntity.ok(productos);
    }

    @PutMapping
    public ResponseEntity<?> actualizarProducto(@RequestBody Producto producto) {
        try {
            Producto actualizado = productoService.actualizarProducto(producto);
            return ResponseEntity.ok(actualizado);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar: " + e.getMessage());
        }
    }
}



