package com.example.jwtapi.service;

import com.example.jwtapi.dto.UserResponse;
import com.example.jwtapi.model.AppUser;
import com.example.jwtapi.model.Role;
import com.example.jwtapi.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse promoteToAdmin(
            String userId,
            String currentAdminUsername
    ) {
        AppUser user = findUser(userId);

        if (user.getUsername().equals(currentAdminUsername)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You are already an administrator"
            );
        }

        if (user.getRole() == Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User is already an administrator"
            );
        }

        user.setRole(Role.ADMIN);

        AppUser updatedUser = userRepository.save(user);

        return toResponse(updatedUser);
    }

    public void deleteUser(
            String userId,
            String currentAdminUsername
    ) {
        AppUser user = findUser(userId);

        if (user.getUsername().equals(currentAdminUsername)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot delete your own account"
            );
        }

        userRepository.delete(user);
    }

    private AppUser findUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );
    }

    private UserResponse toResponse(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole()
        );
    }
}