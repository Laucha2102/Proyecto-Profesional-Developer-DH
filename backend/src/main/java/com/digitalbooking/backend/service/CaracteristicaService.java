package com.digitalbooking.backend.service;

import com.digitalbooking.backend.exception.ResourceNotFoundException;
import com.digitalbooking.backend.model.Caracteristica;
import com.digitalbooking.backend.repository.CaracteristicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional; 

@Service
public class CaracteristicaService {

    @Autowired
    private CaracteristicaRepository caracteristicaRepository;

    public List<Caracteristica> listarTodas() {
        return caracteristicaRepository.findAll();
    }

    public Caracteristica crearCaracteristica(Caracteristica caracteristica) {
        return caracteristicaRepository.save(caracteristica);
    }

    public Caracteristica actualizarCaracteristica(Long id, Caracteristica caracteristicaDetalles) {
        Caracteristica caracteristica = caracteristicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Característica no encontrada con ID: " + id));

        caracteristica.setNombre(caracteristicaDetalles.getNombre());
        caracteristica.setIcono(caracteristicaDetalles.getIcono());
        
        return caracteristicaRepository.save(caracteristica);
    }

    public void eliminarCaracteristica(Long id) {
        if (!caracteristicaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Característica no encontrada con ID: " + id);
        }
        caracteristicaRepository.deleteById(id);
    }
}