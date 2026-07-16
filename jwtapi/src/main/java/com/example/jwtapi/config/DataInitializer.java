package com.example.jwtapi.config;

import com.example.jwtapi.model.AppUser;
import com.example.jwtapi.model.Role;
import com.example.jwtapi.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            if (!userRepository.existsByUsername("admin")) {
                AppUser admin = new AppUser(
                        "admin",
                        passwordEncoder.encode("admin123"),
                        Role.ADMIN
                );

                userRepository.save(admin);

                System.out.println(
                        "Created initial admin user."
                );
            }

            if (!userRepository.existsByUsername("user")) {
                AppUser user = new AppUser(
                        "user",
                        passwordEncoder.encode("user123"),
                        Role.USER
                );

                userRepository.save(user);

                System.out.println(
                        "Created initial regular user."
                );
            }
        };
    }
}