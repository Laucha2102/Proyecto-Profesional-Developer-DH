package com.digitalbooking.backend.service;

import com.digitalbooking.backend.model.Producto;
import com.digitalbooking.backend.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService; 

    @Test
    void deberiaGuardarProducto() {
        // GIVEN (Dado un producto nuevo)
        Producto producto = new Producto();
        producto.setNombre("Hotel de Prueba");
        producto.setDescripcion("Descripción válida de prueba");
        producto.setPrecio(100.0);

        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        Producto guardado = productoService.crearProducto(producto);        
        assertNotNull(guardado);
        assertEquals("Hotel de Prueba", guardado.getNombre());
        verify(productoRepository, times(1)).save(any(Producto.class));
    }
}
