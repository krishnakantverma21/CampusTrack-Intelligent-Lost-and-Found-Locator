package com.example.Campus_Track_LostFound.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.Campus_Track_LostFound.model.Item;
import com.example.Campus_Track_LostFound.model.Message;
import com.example.Campus_Track_LostFound.model.User;
import com.example.Campus_Track_LostFound.model.Flag;
import com.example.Campus_Track_LostFound.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    private boolean isAdmin(String email) {
        return "kkverma@university.edu".equalsIgnoreCase(email);
    }

    // 👥 User Management
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("X-User-Email") String email) {
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/user/{email}")
    public ResponseEntity<?> deleteUser(@RequestHeader("X-User-Email") String requesterEmail, @PathVariable String email) {
        if (!isAdmin(requesterEmail)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        adminService.deleteUserByEmail(email);
        return ResponseEntity.ok("User deleted");
    }

    // 📦 Item Management
    @GetMapping("/items")
    public ResponseEntity<?> getAllItems(@RequestHeader("X-User-Email") String email) {
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        return ResponseEntity.ok(adminService.getAllItems());
    }

    @DeleteMapping("/item/{id}")
    public ResponseEntity<?> deleteItem(@RequestHeader("X-User-Email") String email, @PathVariable String id) {
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        adminService.deleteItemById(id);
        return ResponseEntity.ok("Item deleted");
    }

    // 💬 Message Management
    @GetMapping("/messages")
    public ResponseEntity<?> getAllMessages(@RequestHeader("X-User-Email") String email) {
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        return ResponseEntity.ok(adminService.getAllMessages());
    }

    @DeleteMapping("/message/{id}")
    public ResponseEntity<?> deleteMessage(@RequestHeader("X-User-Email") String email, @PathVariable String id) {
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        adminService.deleteMessageById(id);
        return ResponseEntity.ok("Message deleted");
    }

    // 🚩 Flagged Posts
    @GetMapping("/flags")
    public ResponseEntity<?> getFlaggedPosts(@RequestHeader("X-User-Email") String email) {
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        return ResponseEntity.ok(adminService.getFlaggedPosts());
    }

    @PutMapping("/flags/{id}/review")
    public ResponseEntity<?> markFlagAsReviewed(@RequestHeader("X-User-Email") String email, @PathVariable String id) {
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        adminService.markFlagAsReviewed(id);
        return ResponseEntity.ok("Flag marked as reviewed");
    }

    // 📊 Analytics
    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(@RequestHeader("X-User-Email") String email) {
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}