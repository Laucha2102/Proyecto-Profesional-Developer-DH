package com.digitalbooking.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*; // Importante para las validaciones
import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del producto no puede estar vacío")
    @Size(min = 3, message = "El nombre debe tener al menos 3 caracteres")
    @Column(name = "nombre", unique = true, nullable = false)
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 2000, message = "La descripción no puede superar los 2000 caracteres")
    @Lob
    @Column(name = "descripcion", length = 2000)
    private String descripcion;

    @NotBlank(message = "La dirección es obligatoria")
    @Column(name = "direccion", nullable = false)
    private String direccion;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    @Column(name = "precio", nullable = false)
    private double precio;

    @NotNull(message = "La categoría es obligatoria")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @NotNull(message = "La ciudad es obligatoria")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ciudad_id", nullable = false)
    private Ciudad ciudad;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Imagen> imagenes;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "producto_caracteristica",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "caracteristica_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Caracteristica> caracteristicas;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "producto_politica",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "politica_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Politica> politicas;
}