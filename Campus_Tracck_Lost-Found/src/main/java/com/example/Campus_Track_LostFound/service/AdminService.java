package com.example.Campus_Track_LostFound.service;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Campus_Track_LostFound.model.Item;
import com.example.Campus_Track_LostFound.model.Message;
import com.example.Campus_Track_LostFound.model.User;
import com.example.Campus_Track_LostFound.model.Flag;
import com.example.Campus_Track_LostFound.repository.ItemRepository;
import com.example.Campus_Track_LostFound.repository.MessageRepository;
import com.example.Campus_Track_LostFound.repository.UserRepository;
import com.example.Campus_Track_LostFound.repository.FlagRepository;

@Service
public class AdminService {

    @Autowired private UserRepository userRepo;
    @Autowired private ItemRepository itemRepo;
    @Autowired private MessageRepository messageRepo;
    @Autowired private FlagRepository flagRepo;

    // 👥 User Management
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public void deleteUserByEmail(String email) {
        userRepo.deleteByEmail(email);
    }

    // 📦 Item Management
    public List<Item> getAllItems() {
        return itemRepo.findAll();
    }

    public void deleteItemById(String id) {
        itemRepo.deleteById(id);
    }

    // 💬 Message Management
    public List<Message> getAllMessages() {
        return messageRepo.findAll();
    }

    public void deleteMessageById(String id) {
        messageRepo.deleteById(id);
    }

    // 🚩 Flagged Posts
    public List<Flag> getFlaggedPosts() {
        return flagRepo.findByReviewedFalse();
    }

    public void markFlagAsReviewed(String id) {
        Optional<Flag> flagOpt = flagRepo.findById(id);
        flagOpt.ifPresent(flag -> {
            flag.setReviewed(true);
            flagRepo.save(flag);
        });
    }

    // 📊 Analytics
    public Map<String, Object> getAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("itemsReported", itemRepo.count());
        stats.put("itemsMatched", itemRepo.countByMatchedWithNotNull()); // ✅ fixed
        stats.put("itemsRecovered", itemRepo.countByRecoveredTrue());    // ✅ fixed
        stats.put("activeUsers", userRepo.count());
        stats.put("messageVolume", messageRepo.count());
        return stats;
    }
}