package com.example.Campus_Track_LostFound.service;

import com.example.Campus_Track_LostFound.model.User;
import com.example.Campus_Track_LostFound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> signup(User user) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Check for existing email
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                response.put("success", false);
                response.put("message", "Email already exists");
                return response;
            }

            // Hash password
            String hashed = BCrypt.hashpw(user.getPasswordHash(), BCrypt.gensalt());
            user.setPasswordHash(hashed);

            // Assign role based on email
            if ("kkverma@university.edu".equalsIgnoreCase(user.getEmail())) {
                user.setRole("admin");
            } else {
                user.setRole("user");
            }

            // Save user
            userRepository.save(user);

            response.put("success", true);
            response.put("message", "Signup successful");
        } catch (Exception e) {
            e.printStackTrace(); // Log error to console
            response.put("success", false);
            response.put("message", "Internal error: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> login(String email, String password) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Invalid credentials");
                return response;
            }

            User user = userOpt.get();
            if (BCrypt.checkpw(password, user.getPasswordHash())) {
                response.put("success", true);
                response.put("message", "Login successful");

                // ✅ Include profileImageUrl in response
                response.put("user", Map.of(
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "profileImageUrl", user.getProfileImageUrl() != null
                        ? user.getProfileImageUrl()
                        : "/assets/default-profile.png" // fallback if null
                ));
            } else {
                response.put("success", false);
                response.put("message", "Invalid credentials");
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log error to console
            response.put("success", false);
            response.put("message", "Internal error: " + e.getMessage());
        }

        return response;
    }
}