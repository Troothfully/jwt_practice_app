package com.example.jwtapi.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of(
                "message",
                "This is a public endpoint"
        );
    }

    @GetMapping("/user")
    public Map<String, String> user(Authentication authentication) {
        return Map.of(
                "message",
                "Welcome, " + authentication.getName(),
                "access",
                "You have user access"
        );
    }

    @GetMapping("/admin")
    public Map<String, String> admin(Authentication authentication) {
        return Map.of(
                "message",
                "Welcome, " + authentication.getName(),
                "access",
                "You have administrator access"
        );
    }
}