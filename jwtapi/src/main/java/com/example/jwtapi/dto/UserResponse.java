package com.example.jwtapi.dto;

import com.example.jwtapi.model.Role;

public class UserResponse {

    private String id;
    private String username;
    private Role role;

    public UserResponse() {
    }

    public UserResponse(String id, String username, Role role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public Role getRole() {
        return role;
    }
}