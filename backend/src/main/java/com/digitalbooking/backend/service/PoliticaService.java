package com.digitalbooking.backend.service;

import com.digitalbooking.backend.model.Politica;
import com.digitalbooking.backend.repository.PoliticaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PoliticaService {

    @Autowired
    private PoliticaRepository politicaRepository;

    public List<Politica> listarTodas() {
        return politicaRepository.findAll();
    }

}