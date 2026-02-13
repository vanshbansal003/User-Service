package com.example.userservice.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UserProfileUpdateDto {
    private String fullName;
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;
    private List<String> policies;
    private List<String> claims;
    private Double monthlyPremium;
    private Double totalClaimsAmount;
}
