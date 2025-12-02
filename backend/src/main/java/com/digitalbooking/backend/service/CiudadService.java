package com.digitalbooking.backend.service;

import com.digitalbooking.backend.model.Ciudad;
import com.digitalbooking.backend.repository.CiudadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CiudadService {

    @Autowired
    private CiudadRepository ciudadRepository;

    public List<Ciudad> listarTodas() {
        return ciudadRepository.findAll();
    }
}