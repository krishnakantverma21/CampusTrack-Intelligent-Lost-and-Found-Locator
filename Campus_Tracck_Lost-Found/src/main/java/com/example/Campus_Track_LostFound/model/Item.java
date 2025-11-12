package com.example.Campus_Track_LostFound.model;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "items")
public class Item {

    @Id
    private String id;

    private String name;
    private String description;
    private String location;
    private String type; // "lost" or "found"
    private String userEmail;
    private LocalDateTime date = LocalDateTime.now();
    private String imageUrl;
    private String category;
    private String tags;
    private String matchedWith; // ID of the matched item
    private boolean recovered = false; // ✅ New field

    public Item() {}

    public Item(String name, String description, String location, String type, String userEmail) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.type = type;
        this.userEmail = userEmail;
        this.date = LocalDateTime.now();
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public String getType() { return type; }
    public String getUserEmail() { return userEmail; }
    public LocalDateTime getDate() { return date; }
    public String getImageUrl() { return imageUrl; }
    public String getCategory() { return category; }
    public String getTags() { return tags; }
    public String getMatchedWith() { return matchedWith; }
    public boolean isRecovered() { return recovered; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setType(String type) { this.type = type; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setCategory(String category) { this.category = category; }
    public void setTags(String tags) { this.tags = tags; }
    public void setMatchedWith(String matchedWith) { this.matchedWith = matchedWith; }
    public void setRecovered(boolean recovered) { this.recovered = recovered; }
}