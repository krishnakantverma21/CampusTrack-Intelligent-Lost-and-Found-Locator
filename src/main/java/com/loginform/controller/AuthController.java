package com.loginform.controller;

import java.util.Map;

import com.loginform.entity.User;
import com.loginform.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication-related endpoints.
 */
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService service;

    /**
     * Health check endpoint to verify backend is running.
     */
    @GetMapping
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of("message", "Backend is running"));
    }

    /**
     * Signup endpoint: Registers a new user.
     * @param user User object from request body
     * @return Success or error message
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            String msg = service.signup(user);
            return ResponseEntity.ok(Map.of("message", msg));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Login endpoint: Authenticates user credentials.
     * @param payload Map containing email and password
     * @return Success or error message
     */
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        try {
            String msg = service.login(payload.get("email"), payload.get("password"));
            return ResponseEntity.ok(Map.of("message", msg));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}