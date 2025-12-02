package com.digitalbooking.backend.dto;

import lombok.Data;
import java.util.Set;

@Data 
public class ProductoDTO {
    private String nombre;
    private String descripcion;
    private Set<ImagenDTO> imagenes;
}