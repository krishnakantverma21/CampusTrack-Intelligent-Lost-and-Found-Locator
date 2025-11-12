package com.example.Campus_Track_LostFound.controller;

import com.example.Campus_Track_LostFound.model.User;
import com.example.Campus_Track_LostFound.repository.UserRepository;
import com.example.Campus_Track_LostFound.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3001")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    private final String uploadDir = "uploads/";

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        Map<String, Object> result = authService.signup(user);
        if ((boolean) result.getOrDefault("success", false)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Map<String, Object> result = authService.login(
            loginRequest.getEmail(),
            loginRequest.getPasswordHash()
        );
        if ((boolean) result.getOrDefault("success", false)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    @PatchMapping(value = "/{email}/profile-image", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateProfileImage(
        @PathVariable String email,
        @RequestParam("profileImage") MultipartFile profileImage
    ) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        String imageUrl = saveImage(profileImage);
        User user = userOpt.get();
        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("profileImageUrl", imageUrl));
    }

    @GetMapping("/{email}/profile-image")
    public ResponseEntity<?> getProfileImage(@PathVariable String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        String imageUrl = userOpt.get().getProfileImageUrl();
        if (imageUrl == null || imageUrl.isBlank()) {
            imageUrl = "http://localhost:8088/assets/default-profile.png";
        }

        return ResponseEntity.ok(Map.of("profileImageUrl", imageUrl));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();
        String imageUrl = user.getProfileImageUrl();
        if (imageUrl == null || imageUrl.isBlank()) {
            imageUrl = "http://localhost:8088/assets/default-profile.png";
        }

        String name = user.getName();
        if (name == null || name.isBlank()) {
            name = email;
        }

        return ResponseEntity.ok(Map.of(
            "name", name,
            "email", user.getEmail(),
            "profileImageUrl", imageUrl
        ));
    }

    private String saveImage(MultipartFile image) {
        if (image == null || image.isEmpty()) return null;
        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(image.getInputStream(), filePath);
            return "http://localhost:8088/uploads/" + fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}