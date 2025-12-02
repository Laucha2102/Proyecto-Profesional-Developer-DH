package com.digitalbooking.backend.security;

import com.digitalbooking.backend.dto.AuthResponse;
import com.digitalbooking.backend.dto.LoginRequest;
import com.digitalbooking.backend.dto.RegisterRequest;
import com.digitalbooking.backend.model.Role;
import com.digitalbooking.backend.model.User;
import com.digitalbooking.backend.repository.RoleRepository;
import com.digitalbooking.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Error: El email ya está registrado.");
        }
        Role userRole = roleRepository.findByNombre("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Rol 'ROLE_USER' no encontrado."));
        
        User user = new User();
        user.setNombre(request.getNombre());
        user.setApellido(request.getApellido());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of(userRole)); 
        
        userRepository.save(user);
        
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getNombre()))
                .collect(Collectors.toSet())
        );
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder().token(token).build();
    }

    
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        UserDetails userDetails = userRepository.findByEmailWithRolesAndFavoritos(request.getEmail()) 
            .map(user -> new org.springframework.security.core.userdetails.User(
                    user.getEmail(), user.getPassword(), user.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority(role.getNombre()))
                    .collect(Collectors.toSet())
            ))
            .orElseThrow(() -> new RuntimeException("Error inesperado durante el login."));

        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder().token(token).build();
    }
}