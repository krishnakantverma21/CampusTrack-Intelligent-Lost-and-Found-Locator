package com.example.Campus_Track_LostFound.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    private String senderEmail;
    private String receiverEmail;
    private String itemId;
    private String content;
    private String type;
    private String filename;
    private LocalDateTime timestamp;
    private boolean seen;

    // ✅ New: Track users who deleted this message for themselves
    private List<String> deletedFor = new ArrayList<>();

    public Message() {
        this.timestamp = LocalDateTime.now();
        this.seen = false;
    }

    public Message(String senderEmail, String receiverEmail, String itemId, String content) {
        this.senderEmail = senderEmail;
        this.receiverEmail = receiverEmail;
        this.itemId = itemId;
        this.content = content;
        this.timestamp = LocalDateTime.now();
        this.seen = false;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }

    public String getReceiverEmail() { return receiverEmail; }
    public void setReceiverEmail(String receiverEmail) { this.receiverEmail = receiverEmail; }

    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public boolean isSeen() { return seen; }
    public void setSeen(boolean seen) { this.seen = seen; }

    public List<String> getDeletedFor() { return deletedFor; }
    public void setDeletedFor(List<String> deletedFor) { this.deletedFor = deletedFor; }
}