package com.example.Campus_Track_LostFound.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.Campus_Track_LostFound.model.Item;
import com.example.Campus_Track_LostFound.repository.ItemRepository;
import com.example.Campus_Track_LostFound.utils.StringSimilarity;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemRepository itemRepo;

    private final String uploadDir = "uploads/";

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

    @PostMapping(value = "/lost", consumes = {"multipart/form-data"})
    public ResponseEntity<?> postLostItem(
        @RequestParam("name") String name,
        @RequestParam("description") String description,
        @RequestParam("location") String location,
        @RequestParam("date") String date,
        @RequestParam("type") String type,
        @RequestParam("userEmail") String userEmail,
        @RequestParam(value = "image", required = false) MultipartFile image,
        @RequestParam(value = "category", required = false) String category,
        @RequestParam(value = "tags", required = false) String tags
    ) {
        Item item = new Item(name, description, location, type, userEmail);
        item.setImageUrl(saveImage(image));
        item.setCategory(category);
        item.setTags(tags);
        item.setDate(LocalDateTime.parse(date + "T00:00:00"));
        itemRepo.save(item);

        List<Item> candidates = itemRepo.findByType("found");
        for (Item candidate : candidates) {
            if (candidate.getMatchedWith() == null && isPotentialMatch(item, candidate)) {
                item.setMatchedWith(candidate.getId());
                candidate.setMatchedWith(item.getId());
                itemRepo.save(item);
                itemRepo.save(candidate);
                break;
            }
        }

        return ResponseEntity.ok("Lost item posted");
    }

    @PostMapping(value = "/found", consumes = {"multipart/form-data"})
    public ResponseEntity<?> postFoundItem(
        @RequestParam("name") String name,
        @RequestParam("description") String description,
        @RequestParam("location") String location,
        @RequestParam("date") String date,
        @RequestParam("type") String type,
        @RequestParam("userEmail") String userEmail,
        @RequestParam(value = "image", required = false) MultipartFile image,
        @RequestParam(value = "category", required = false) String category,
        @RequestParam(value = "tags", required = false) String tags
    ) {
        Item item = new Item(name, description, location, type, userEmail);
        item.setImageUrl(saveImage(image));
        item.setCategory(category);
        item.setTags(tags);
        item.setDate(LocalDateTime.parse(date + "T00:00:00"));
        itemRepo.save(item);

        List<Item> candidates = itemRepo.findByType("lost");
        for (Item candidate : candidates) {
            if (candidate.getMatchedWith() == null && isPotentialMatch(item, candidate)) {
                item.setMatchedWith(candidate.getId());
                candidate.setMatchedWith(item.getId());
                itemRepo.save(item);
                itemRepo.save(candidate);
                break;
            }
        }

        return ResponseEntity.ok("Found item posted");
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateItem(
        @PathVariable String id,
        @RequestParam("name") String name,
        @RequestParam("description") String description,
        @RequestParam("location") String location,
        @RequestParam("date") String date,
        @RequestParam("type") String type,
        @RequestParam("userEmail") String userEmail,
        @RequestParam(value = "image", required = false) MultipartFile image,
        @RequestParam(value = "category", required = false) String category,
        @RequestParam(value = "tags", required = false) String tags
    ) {
        return itemRepo.findById(id).map(item -> {
            item.setName(name);
            item.setDescription(description);
            item.setLocation(location);
            try {
                item.setDate(LocalDateTime.parse(date + "T00:00:00"));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Invalid date format: " + date);
            }
            item.setType(type);
            item.setUserEmail(userEmail);
            item.setCategory(category);
            item.setTags(tags);
            if (image != null && !image.isEmpty()) {
                item.setImageUrl(saveImage(image));
            }
            itemRepo.save(item);
            return ResponseEntity.ok("Item updated");
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/lost")
    public List<Item> getLostItems() {
        return itemRepo.findByType("lost");
    }

    @GetMapping("/found")
    public List<Item> getFoundItems() {
        return itemRepo.findByType("found");
    }

    @GetMapping("/history/{email}")
    public List<Item> getUserHistory(@PathVariable String email) {
        return itemRepo.findByUserEmail(email);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable String id) {
        Optional<Item> item = itemRepo.findById(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/matches/{itemId}")
    public List<Item> getMatchedItems(@PathVariable String itemId) {
        Optional<Item> optionalTarget = itemRepo.findById(itemId);
        if (optionalTarget.isEmpty()) return List.of();
        Item target = optionalTarget.get();
        List<Item> candidates = itemRepo.findByType(
            target.getType().equalsIgnoreCase("lost") ? "found" : "lost"
        );
        return candidates.stream()
            .filter(candidate -> isPotentialMatch(target, candidate))
            .collect(Collectors.toList());
    }

    @PostMapping("/match")
    public ResponseEntity<String> markItemsAsMatched(@RequestBody Map<String, String> payload) {
        String itemId = payload.get("itemId");
        String matchedId = payload.get("matchedId");
        Optional<Item> optionalItem = itemRepo.findById(itemId);
        Optional<Item> optionalMatch = itemRepo.findById(matchedId);
        if (optionalItem.isEmpty() || optionalMatch.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item not found");
        }
        Item item = optionalItem.get();
        Item matched = optionalMatch.get();
        item.setMatchedWith(matchedId);
        matched.setMatchedWith(itemId);
        itemRepo.save(item);
        itemRepo.save(matched);
        return ResponseEntity.ok("Items marked as matched");
    }

    @GetMapping("/confirmed-matches/{itemId}")
    public List<Item> getConfirmedMatches(@PathVariable String itemId) {
        Optional<Item> optionalItem = itemRepo.findById(itemId);
        if (optionalItem.isEmpty()) return List.of();
        Item item = optionalItem.get();
        String matchedId = item.getMatchedWith();
        if (matchedId == null || matchedId.isEmpty()) return List.of();
        return itemRepo.findById(matchedId)
                       .map(List::of)
                       .orElse(List.of());
    }

    @GetMapping("/confirmed-history/{email}")
    public List<Item> getConfirmedMatchesForUser(@PathVariable String email) {
        List<Item> userItems = itemRepo.findByUserEmail(email);
        return userItems.stream()
            .filter(item -> item.getMatchedWith() != null && !item.getMatchedWith().isEmpty())
            .collect(Collectors.toList());
    }

    @GetMapping("/matched-pairs/{email}")
    public List<Item> getMatchedPairs(@PathVariable String email) {
        List<Item> userItems = itemRepo.findByUserEmail(email);
        Set<String> userItemIds = userItems.stream()
            .map(Item::getId)
            .collect(Collectors.toSet());
        List<Item> matchedUserItems = userItems.stream()
            .filter(item -> item.getMatchedWith() != null && !item.getMatchedWith().isEmpty())
            .collect(Collectors.toList());

        List<Item> matchedToUserItems = itemRepo.findAll().stream()
            .filter(item -> item.getMatchedWith() != null && userItemIds.contains(item.getMatchedWith()))
            .collect(Collectors.toList());

        Set<String> seen = new HashSet<>();
        List<Item> result = new ArrayList<>();

        for (Item item : matchedUserItems) {
            if (seen.contains(item.getId()) || seen.contains(item.getMatchedWith())) continue;
            result.add(item);
            itemRepo.findById(item.getMatchedWith()).ifPresent(result::add);
            seen.add(item.getId());
            seen.add(item.getMatchedWith());
        }

        for (Item item : matchedToUserItems) {
            if (seen.contains(item.getId()) || seen.contains(item.getMatchedWith())) continue;
            result.add(item);
            itemRepo.findById(item.getMatchedWith()).ifPresent(result::add);
            seen.add(item.getId());
            seen.add(item.getMatchedWith());
        }
         return result;
    }

    private boolean isPotentialMatch(Item a, Item b) {
        boolean locationMatch = a.getLocation().equalsIgnoreCase(b.getLocation());
        boolean categoryMatch = a.getCategory() != null && a.getCategory().equalsIgnoreCase(b.getCategory());
        boolean dateClose = Math.abs(ChronoUnit.DAYS.between(a.getDate(), b.getDate())) <= 3;

        double nameSim = StringSimilarity.similarity(a.getName(), b.getName());
        double tagSim = StringSimilarity.similarity(
            a.getTags() != null ? a.getTags() : "",
            b.getTags() != null ? b.getTags() : ""
        );

        return locationMatch && categoryMatch && dateClose && (nameSim > 0.6 || tagSim > 0.6);
    }
}

