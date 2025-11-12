package com.example.Campus_Track_LostFound.repository;

import com.example.Campus_Track_LostFound.model.ChatRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRequestRepository extends MongoRepository<ChatRequest, String> {
    List<ChatRequest> findByReceiverEmailAndStatus(String receiverEmail, String status);
    List<ChatRequest> findBySenderEmailAndReceiverEmailAndStatus(String sender, String receiver, String status);
}