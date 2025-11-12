package com.example.Campus_Track_LostFound.model;

import org.springframework.data.annotation.Id;

import jakarta.persistence.*;

@Entity
@Table(name = "flags")
public class Flag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemTitle;
    private String reason;
    private String reportedBy; // ✅ Add this
    private boolean reviewed = false;

    public Flag() {}

    public Flag(String itemTitle, String reason, String reportedBy) {
        this.itemTitle = itemTitle;
        this.reason = reason;
        this.reportedBy = reportedBy;
        this.reviewed = false;
    }

    // Getters and setters for all fields...


    // ✅ Getters and Setters
    public Long getId() {
        return id;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public void setItemTitle(String itemTitle) {
        this.itemTitle = itemTitle;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(String reportedBy) {
        this.reportedBy = reportedBy;
    }

    public boolean isReviewed() {
        return reviewed;
    }

    public void setReviewed(boolean reviewed) {
        this.reviewed = reviewed;
    }
}