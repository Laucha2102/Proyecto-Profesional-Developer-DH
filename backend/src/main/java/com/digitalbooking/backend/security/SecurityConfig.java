package com.digitalbooking.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                
                .requestMatchers("/api/reservas/mis-reservas").authenticated() // US #33
                .requestMatchers(HttpMethod.POST, "/api/reservas").authenticated() // US #32
                .requestMatchers(HttpMethod.POST, "/api/puntuaciones").authenticated() // US #28

                .requestMatchers(HttpMethod.POST, "/api/productos").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/productos").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/caracteristicas").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/caracteristicas/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/caracteristicas/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/categorias").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/puntuaciones/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/ciudades/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/caracteristicas/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reservas/**").permitAll() // US #23 (Calendario)
                .requestMatchers(HttpMethod.GET, "/api/politicas/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/puntuaciones/**").permitAll()

                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration); 
        return source;
    }
}