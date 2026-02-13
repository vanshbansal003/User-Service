package com.example.userservice.repository;

import com.example.userservice.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserId(Long userId);

    @Query("SELECT SUM(p.monthlyPremium) FROM UserProfile p")
    Double sumTotalRevenue();

    @Query("SELECT SUM(p.totalClaimsAmount) FROM UserProfile p")
    Double sumTotalPayouts();
}
