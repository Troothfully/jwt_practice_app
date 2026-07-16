package com.example.jwtapi.controller;

import com.example.jwtapi.dto.LoginRequest;
import com.example.jwtapi.dto.LoginResponse;
import com.example.jwtapi.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.jwtapi.dto.RegisterRequest;
import com.example.jwtapi.dto.RegisterResponse;
import com.example.jwtapi.model.AppUser;
import com.example.jwtapi.model.Role;
import com.example.jwtapi.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
        AuthenticationManager authenticationManager,
        JwtService jwtService,
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
        )
        {
                this.authenticationManager = authenticationManager;
                this.jwtService = jwtService;
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
        }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest loginRequest
    ) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getUsername(),
                                loginRequest.getPassword()
                        )
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(
                new LoginResponse(token)
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest registerRequest
    ) 
    {
        String username = registerRequest.getUsername();
        String password = registerRequest.getPassword();

        if (username == null || username.isBlank()) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Username is required"
                        ));
        }

        if (password == null || password.length() < 6) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Password must contain at least 6 characters"
                        ));
        }

    String normalizedUsername = username.trim().toLowerCase();

    if (userRepository.existsByUsername(normalizedUsername)) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "message",
                        "Username already exists"
                ));
    }

    AppUser newUser = new AppUser(
            normalizedUsername,
            passwordEncoder.encode(password),
            Role.USER
    );

    userRepository.save(newUser);

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(
                    new RegisterResponse(
                            "Account created successfully",
                            normalizedUsername
                    )
            );
}

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            BadCredentialsException exception
    ) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "status", 401,
                        "error", "Unauthorized",
                        "message", "Invalid username or password"
                ));
    }
}