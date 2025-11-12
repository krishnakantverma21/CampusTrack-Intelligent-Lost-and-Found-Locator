package com.example.Campus_Track_LostFound.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;
    private String email;

    @JsonProperty("passwordHash")
    private String passwordHash;

    private String role;
    private LocalDateTime createdAt;

    private String profileImageUrl; // ✅ NEW FIELD

    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
        this.role = "student";
    }

    public User(String name, String email, String passwordHash, String role) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role != null ? role : "student";
        this.createdAt = LocalDateTime.now();
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getProfileImageUrl() { return profileImageUrl; } // ✅ Getter

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setRole(String role) { this.role = role; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; } // ✅ Setter
}