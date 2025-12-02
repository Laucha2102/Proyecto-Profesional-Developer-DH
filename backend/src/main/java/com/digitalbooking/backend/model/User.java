package com.digitalbooking.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore; 
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email") 
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String email;
    
    @JsonIgnore 
    private String password; 


    @ManyToMany(fetch = FetchType.EAGER) 
    @JoinTable(
        name = "user_roles", 
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    @ManyToMany(fetch = FetchType.LAZY) 
    @JoinTable(
        name = "user_favoritos", 
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "producto_id")
    )
    @JsonIgnore 
    private Set<Producto> favoritos;
}