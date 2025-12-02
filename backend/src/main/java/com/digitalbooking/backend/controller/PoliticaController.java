package com.digitalbooking.backend.controller;

import com.digitalbooking.backend.model.Politica;
import com.digitalbooking.backend.service.PoliticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/politicas")
public class PoliticaController {

    @Autowired
    private PoliticaService politicaService;

    @GetMapping
    public ResponseEntity<List<Politica>> listarTodas() {
        List<Politica> politicas = politicaService.listarTodas();
        return ResponseEntity.ok(politicas);
    }

}