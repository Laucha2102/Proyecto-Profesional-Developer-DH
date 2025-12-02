package com.digitalbooking.backend.controller;

import com.digitalbooking.backend.model.Producto;
import com.digitalbooking.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/usuarios")
public class UserController {

    @Autowired
    private UserService userService;

    private String getEmailFromPrincipal(UserDetails userDetails) {
        return userDetails.getUsername();
    }

    @GetMapping("/favoritos")
    public ResponseEntity<Set<Producto>> getMisFavoritos(@AuthenticationPrincipal UserDetails userDetails) {
        String email = getEmailFromPrincipal(userDetails);
        Set<Producto> favoritos = userService.getFavoritos(email);
        return ResponseEntity.ok(favoritos);
    }

    @PostMapping("/favoritos/{productoId}")
    public ResponseEntity<Set<Producto>> toggleFavorito(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productoId) {
        
        String email = getEmailFromPrincipal(userDetails);
        Set<Producto> favoritosActualizados = userService.toggleFavorito(email, productoId);
        return ResponseEntity.ok(favoritosActualizados);
    }
}