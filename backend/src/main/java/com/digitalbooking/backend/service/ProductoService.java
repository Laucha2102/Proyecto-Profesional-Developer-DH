package com.digitalbooking.backend.service;

import com.digitalbooking.backend.exception.ResourceNotFoundException;
import com.digitalbooking.backend.model.Producto;
import com.digitalbooking.backend.model.Imagen;
import com.digitalbooking.backend.model.Caracteristica;
import com.digitalbooking.backend.model.Politica;
import com.digitalbooking.backend.repository.ProductoRepository;
import com.digitalbooking.backend.repository.CaracteristicaRepository;
import com.digitalbooking.backend.repository.PoliticaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; 

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CaracteristicaRepository caracteristicaRepository;
    @Autowired
    private PoliticaRepository politicaRepository;


    @Transactional 
    public Producto crearProducto(Producto producto) {
        if (productoRepository.existsByNombre(producto.getNombre())) {
            throw new IllegalArgumentException("Error: Ya existe un producto con el nombre '" + producto.getNombre() + "'");
        }

        if (producto.getImagenes() != null) {
            for (Imagen imagen : producto.getImagenes()) {
                imagen.setProducto(producto);
            }
        }

        if (producto.getCaracteristicas() != null && !producto.getCaracteristicas().isEmpty()) {
            Set<Long> ids = producto.getCaracteristicas().stream()
                              .map(Caracteristica::getId)
                              .collect(Collectors.toSet());
            List<Caracteristica> managedCaracteristicas = caracteristicaRepository.findAllById(ids);
            producto.setCaracteristicas(new HashSet<>(managedCaracteristicas));
        }

        if (producto.getPoliticas() != null && !producto.getPoliticas().isEmpty()) {
            Set<Long> ids = producto.getPoliticas().stream()
                              .map(Politica::getId)
                              .collect(Collectors.toSet());
            List<Politica> managedPoliticas = politicaRepository.findAllById(ids);
            producto.setPoliticas(new HashSet<>(managedPoliticas));
        }

        return productoRepository.save(producto);
    }

    public List<Producto> obtenerProductosAleatorios() { 
        List<Producto> productos = productoRepository.findRandom10();
        return productos.stream().limit(10).toList(); 
    }

    public Page<Producto> listarTodosLosProductos(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productoRepository.findAllWithDetails(pageable);
    }

    @Transactional
    public Producto actualizarProducto(Producto producto) {
        if (!productoRepository.existsById(producto.getId())) {
             throw new ResourceNotFoundException("No existe el producto con ID: " + producto.getId());
        }
        
        if (producto.getImagenes() != null) {
            for (Imagen img : producto.getImagenes()) {
                img.setProducto(producto);
            }
        }
        return productoRepository.save(producto);
    }

    public void eliminarProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se encontró un producto con el ID: " + id);
        }
        productoRepository.deleteById(id);
    }

    public Producto buscarPorId(Long id) {
        return productoRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new ResourceNotFoundException("No se encontró producto con ID: " + id));
    }

    public List<Producto> listarPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaIdWithDetails(categoriaId);
    }

    public List<Producto> listarProductosDisponibles(Long ciudadId, LocalDate fechaInicio, LocalDate fechaFin) {
        return productoRepository.findAvailableByCityAndDates(ciudadId, fechaInicio, fechaFin);
    }

    
}

