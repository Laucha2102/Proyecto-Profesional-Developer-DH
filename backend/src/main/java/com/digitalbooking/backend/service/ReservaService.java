package com.digitalbooking.backend.service;

import com.digitalbooking.backend.dto.ReservaRequest;
import com.digitalbooking.backend.exception.ResourceNotFoundException;
import com.digitalbooking.backend.model.Producto;
import com.digitalbooking.backend.model.Reserva;
import com.digitalbooking.backend.model.User;
import com.digitalbooking.backend.repository.ProductoRepository;
import com.digitalbooking.backend.repository.ReservaRepository;
import com.digitalbooking.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Reserva> listarReservasPorProducto(Long productoId) {
        LocalDate fechaActual = LocalDate.now();
        return reservaRepository.findReservasFuturasPorProducto(productoId, fechaActual);
    }

    @Transactional
    public Reserva crearReserva(ReservaRequest request, String userEmail) {
        List<Reserva> overlapping = reservaRepository.findOverlappingReservas(
                request.getProductoId(), request.getFechaInicio(), request.getFechaFin());
        
        if (!overlapping.isEmpty()) {
            throw new IllegalArgumentException("Las fechas seleccionadas ya no están disponibles.");
        }

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Reserva reserva = new Reserva();
        reserva.setProducto(producto);
        reserva.setUser(user);
        reserva.setFechaInicio(request.getFechaInicio());
        reserva.setFechaFin(request.getFechaFin());
        
        return reservaRepository.save(reserva);
    }

    @Transactional(readOnly = true)
    public List<Reserva> listarReservasPorUsuario(String userEmail) {
        return reservaRepository.findByUserEmailWithProducto(userEmail);
    }
}