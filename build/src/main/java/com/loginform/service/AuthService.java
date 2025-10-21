package com.loginform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.loginform.repository.UserRepository;
import com.loginform.entity.User;
@Service
public class AuthService {
    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder encoder;

    public String signup(User user) {
        if (repo.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return "Signed up successfully";
    }

    public String login(String email, String password) {
        User user = repo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return "Login successful";
    }
}