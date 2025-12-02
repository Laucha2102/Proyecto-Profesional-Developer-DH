package com.digitalbooking.backend.service;

import com.digitalbooking.backend.model.Producto;
import com.digitalbooking.backend.model.Puntuacion;
import com.digitalbooking.backend.model.User;
import com.digitalbooking.backend.repository.PuntuacionRepository;
import com.digitalbooking.backend.repository.ProductoRepository;
import com.digitalbooking.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PuntuacionService {

    @Autowired
    private PuntuacionRepository puntuacionRepository;

    @Autowired
    private ProductoRepository productoRepository; 

    @Autowired
    private UserRepository userRepository; 

    public List<Puntuacion> listarPuntuacionesPorProducto(Long productoId) {
        return puntuacionRepository.findByProductoIdWithUser(productoId);
    }

    /**
     * 
     *
     * @param productoId 
     * @param userEmail  
     * @param valor      
     * @param comentario 
     * @return 
     */
    @Transactional
    public Puntuacion crearPuntuacion(Long productoId, String userEmail, int valor, String comentario) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + productoId));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + userEmail));

        Puntuacion puntuacion = new Puntuacion();
        puntuacion.setProducto(producto);
        puntuacion.setUser(user);
        puntuacion.setValor(valor);
        puntuacion.setComentario(comentario);
        puntuacion.setFecha(LocalDate.now()); 

        return puntuacionRepository.save(puntuacion);
    }
}