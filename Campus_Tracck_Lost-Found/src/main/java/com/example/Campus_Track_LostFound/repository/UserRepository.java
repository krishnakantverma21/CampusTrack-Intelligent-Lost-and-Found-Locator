package com.example.Campus_Track_LostFound.repository;

import com.example.Campus_Track_LostFound.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    void deleteByEmail(String email);
}