package com.example.Campus_Track_LostFound.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.Campus_Track_LostFound.model.Item;

public interface ItemRepository extends MongoRepository<Item, String> {
    List<Item> findByType(String type);
    List<Item> findByUserEmail(String email);

    List<Item> findByMatchedWithNotNull();
    List<Item> findByMatchedWith(String itemId);

    void deleteById(String id); // MongoDB uses String for _id

    long countByMatchedWithNotNull(); // ✅ Counts matched items
    long countByRecoveredTrue();      // ✅ Counts recovered items
}