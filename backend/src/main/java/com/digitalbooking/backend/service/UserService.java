package com.digitalbooking.backend.service;

import com.digitalbooking.backend.exception.ResourceNotFoundException;
import com.digitalbooking.backend.model.Producto;
import com.digitalbooking.backend.model.User;
import com.digitalbooking.backend.repository.ProductoRepository;
import com.digitalbooking.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional; 
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductoRepository productoRepository;

    @Transactional(readOnly = true) 
    public Set<Producto> getFavoritos(String email) {
        User user = userRepository.findByEmailWithRolesAndFavoritos(email) 
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
        return user.getFavoritos();
    }

    @Transactional 
    public Set<Producto> toggleFavorito(String email, Long productoId) {
        
        User user = userRepository.findByEmailWithRolesAndFavoritos(email) 
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + productoId));
        
        Set<Producto> favoritos = user.getFavoritos();

        Optional<Producto> productoEnSet = favoritos.stream()
            .filter(fav -> fav.getId().equals(productoId))
            .findFirst();

        if (productoEnSet.isPresent()) {
            favoritos.remove(productoEnSet.get());
        } else {
            favoritos.add(producto);
        }
        
        userRepository.save(user); 
        return favoritos; 
    }
}