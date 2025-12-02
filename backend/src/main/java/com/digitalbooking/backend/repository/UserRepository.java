package com.digitalbooking.backend.repository;

import com.digitalbooking.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);


    @Query("SELECT u FROM User u " +
           "LEFT JOIN FETCH u.roles " +
           "LEFT JOIN FETCH u.favoritos " + 
           "WHERE u.email = :email")
    Optional<User> findByEmailWithRolesAndFavoritos(String email);

    Boolean existsByEmail(String email);
}