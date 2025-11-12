package com.example.Campus_Track_LostFound.controller;

import com.example.Campus_Track_LostFound.model.Message;
import com.example.Campus_Track_LostFound.model.ChatRequest;
import com.example.Campus_Track_LostFound.repository.MessageRepository;
import com.example.Campus_Track_LostFound.repository.ChatRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRequestRepository chatRequestRepository;

    // ✅ Send a message
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        message.setTimestamp(LocalDateTime.now());
        message.setSeen(false);
        messageRepository.save(message);
        return ResponseEntity.ok(message);
    }

    // ✅ Get chat history between two users
    @GetMapping("/history")
    public ResponseEntity<?> getChatHistory(@RequestParam String user1, @RequestParam String user2) {
        List<Message> messages = new ArrayList<>();
        messages.addAll(messageRepository.findBySenderEmailAndReceiverEmailOrderByTimestampAsc(user1, user2));
        messages.addAll(messageRepository.findBySenderEmailAndReceiverEmailOrderByTimestampAsc(user2, user1));
        messages.sort(Comparator.comparing(Message::getTimestamp));
        return ResponseEntity.ok(messages);
    }

    // ✅ Get unseen messages for receiver
    @GetMapping("/notifications")
    public ResponseEntity<?> getUnseenMessages(@RequestParam String receiverEmail) {
        List<Message> unseen = messageRepository.findByReceiverEmailAndSeenFalse(receiverEmail);
        return ResponseEntity.ok(unseen);
    }

    // ✅ Mark messages as seen
    @PostMapping("/mark-seen")
    public ResponseEntity<?> markMessagesAsSeen(@RequestBody List<String> messageIds) {
        List<Message> messages = messageRepository.findAllById(messageIds);
        for (Message msg : messages) {
            msg.setSeen(true);
        }
        messageRepository.saveAll(messages);
        return ResponseEntity.ok("Messages marked as seen");
    }

    // ✅ Get all conversations for a user
    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(@RequestParam String userEmail) {
        List<Message> messages = messageRepository
            .findBySenderEmailOrReceiverEmailOrderByTimestampAsc(userEmail, userEmail);
        return ResponseEntity.ok(messages);
    }

    // ✅ Delete message for all
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable String id) {
        if (!messageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        messageRepository.deleteById(id);
        return ResponseEntity.ok("Message deleted for all");
    }

    // ✅ Delete message for me
    @PutMapping("/delete-for-me/{id}")
    public ResponseEntity<?> deleteForMe(@PathVariable String id, @RequestParam String userEmail) {
        Optional<Message> msgOpt = messageRepository.findById(id);
        if (msgOpt.isEmpty()) return ResponseEntity.notFound().build();
        Message msg = msgOpt.get();
        if (!msg.getDeletedFor().contains(userEmail)) {
            msg.getDeletedFor().add(userEmail);
            messageRepository.save(msg);
        }
        return ResponseEntity.ok("Message hidden for user");
    }

    // ✅ Edit message content
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editMessage(@PathVariable String id, @RequestBody String newContent) {
        Optional<Message> msgOpt = messageRepository.findById(id);
        if (msgOpt.isEmpty()) return ResponseEntity.notFound().build();
        Message msg = msgOpt.get();
        msg.setContent(newContent);
        messageRepository.save(msg);
        return ResponseEntity.ok("Message updated");
    }

    // ✅ Send chat request
    @PostMapping("/request")
    public ResponseEntity<?> sendChatRequest(@RequestBody ChatRequest request) {
        request.setTimestamp(LocalDateTime.now());
        request.setStatus("pending");
        chatRequestRepository.save(request);
        return ResponseEntity.ok("Chat request sent");
    }

    // ✅ Get pending requests for receiver
    @GetMapping("/requests")
    public ResponseEntity<?> getPendingRequests(@RequestParam String receiverEmail) {
        List<ChatRequest> requests = chatRequestRepository.findByReceiverEmailAndStatus(receiverEmail, "pending");
        return ResponseEntity.ok(requests);
    }

    // ✅ Accept chat request
    @PutMapping("/request/{id}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable String id) {
        Optional<ChatRequest> reqOpt = chatRequestRepository.findById(id);
        if (reqOpt.isEmpty()) return ResponseEntity.notFound().build();
        ChatRequest req = reqOpt.get();
        req.setStatus("accepted");
        chatRequestRepository.save(req);
        return ResponseEntity.ok("Chat request accepted");
    }

    // ✅ Reject chat request
    @PutMapping("/request/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable String id) {
        Optional<ChatRequest> reqOpt = chatRequestRepository.findById(id);
        if (reqOpt.isEmpty()) return ResponseEntity.notFound().build();
        ChatRequest req = reqOpt.get();
        req.setStatus("rejected");
        chatRequestRepository.save(req);
        return ResponseEntity.ok("Chat request rejected");
    }

    // ✅ Check if chat is allowed
    @GetMapping("/allowed")
    public ResponseEntity<?> isChatAllowed(@RequestParam String userA, @RequestParam String userB) {
        List<ChatRequest> accepted = chatRequestRepository
            .findBySenderEmailAndReceiverEmailAndStatus(userA, userB, "accepted");
        boolean allowed = !accepted.isEmpty();
        return ResponseEntity.ok(Map.of("allowed", allowed));
    }
}