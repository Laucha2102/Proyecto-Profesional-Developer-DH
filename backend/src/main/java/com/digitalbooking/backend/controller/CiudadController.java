package com.digitalbooking.backend.controller;

import com.digitalbooking.backend.model.Ciudad;
import com.digitalbooking.backend.service.CiudadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/ciudades") 
@CrossOrigin(origins = "http://localhost:5173") 
public class CiudadController {

    @Autowired
    private CiudadService ciudadService;

    @GetMapping
    public ResponseEntity<List<Ciudad>> listarTodas() {
        List<Ciudad> ciudades = ciudadService.listarTodas();
        return ResponseEntity.ok(ciudades);
    }
}