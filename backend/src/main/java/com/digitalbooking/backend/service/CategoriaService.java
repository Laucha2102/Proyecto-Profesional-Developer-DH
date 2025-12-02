package com.digitalbooking.backend.service;

import com.digitalbooking.backend.exception.ResourceNotFoundException; 
import com.digitalbooking.backend.model.Categoria;
import com.digitalbooking.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    public Categoria crearCategoria(Categoria categoria) {
        // Criterio US #21: La categoría tiene título, descripción e imagen
        return categoriaRepository.save(categoria);
    }

    public void eliminarCategoria(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría no encontrada con ID: " + id);
        }
        categoriaRepository.deleteById(id);
    }
    
}