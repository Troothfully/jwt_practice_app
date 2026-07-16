package com.example.jwtapi.controller;

import com.example.jwtapi.dto.UserResponse;
import com.example.jwtapi.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return adminUserService.getAllUsers();
    }

    @PatchMapping("/{userId}/promote")
    public UserResponse promoteUser(
            @PathVariable String userId,
            Authentication authentication
    ) {
        return adminUserService.promoteToAdmin(
                userId,
                authentication.getName()
        );
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable String userId,
            Authentication authentication
    ) {
        adminUserService.deleteUser(
                userId,
                authentication.getName()
        );

        return ResponseEntity.ok(
                Map.of("message", "User deleted successfully")
        );
    }
}