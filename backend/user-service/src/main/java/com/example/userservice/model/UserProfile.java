package com.example.userservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String fullName;
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;

    @ElementCollection
    @CollectionTable(name = "user_policies", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "policy_number")
    private List<String> policies = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_claims", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "claim_number")
    private List<String> claims = new ArrayList<>();

    private Double monthlyPremium;
    private Double totalClaimsAmount;
}
