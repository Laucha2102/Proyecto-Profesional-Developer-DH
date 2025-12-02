package com.digitalbooking.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore; 
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "imagenes")
public class Imagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    @Lob 
    @Column(columnDefinition = "VARCHAR(MAX)") 
    private String urlImagen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    @JsonIgnore 
    private Producto producto;
}