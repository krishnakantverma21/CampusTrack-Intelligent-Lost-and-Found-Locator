package com.example.Campus_Track_LostFound.repository;

import com.example.Campus_Track_LostFound.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findBySenderEmailAndReceiverEmailOrderByTimestampAsc(String sender, String receiver);

    List<Message> findByReceiverEmailAndSeenFalse(String receiverEmail);

    List<Message> findBySenderEmailOrReceiverEmail(String userEmail, String userEmail2);

    List<Message> findBySenderEmailOrReceiverEmailOrderByTimestampAsc(String userEmail, String userEmail2);

    void deleteById(Long id);
}