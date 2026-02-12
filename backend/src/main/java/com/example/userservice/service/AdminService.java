package com.example.userservice.service;

import com.example.userservice.dto.UserProfileDto;
import java.util.List;
import java.util.Map;

public interface AdminService {
    Map<String, Object> getGlobalStats();

    List<UserProfileDto> getAllProfiles();

    void processClaim(String username, Double amount, String status);

    void addPolicy(String username, String policyNumber, Double premiumCharge);

    void updatePolicy(String username, String oldPolicyId, String newPolicyId);

    void removePolicy(String username, String policyId);
}
