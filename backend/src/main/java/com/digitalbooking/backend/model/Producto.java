package com.digitalbooking.backend.model;

import jakarta.persistence.*;
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


    @Column(name = "nombre", unique = true, nullable = false) 
    private String nombre;

    @Lob 
    @Column(name = "descripcion", length = 2000) 
                                                  
    private String descripcion;

    @Column(name = "direccion", nullable = false) 
    private String direccion;

    @Column(name = "precio", nullable = false) 
    private double precio;


    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

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