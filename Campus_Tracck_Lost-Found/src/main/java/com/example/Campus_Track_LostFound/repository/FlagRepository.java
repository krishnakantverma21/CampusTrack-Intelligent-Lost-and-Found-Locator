package com.example.Campus_Track_LostFound.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.Campus_Track_LostFound.model.Flag;
import java.util.List;
import java.util.Optional;

public interface FlagRepository extends MongoRepository<Flag, String> {
    List<Flag> findByReviewedFalse();

    Optional<Flag> findById(Long id);
}