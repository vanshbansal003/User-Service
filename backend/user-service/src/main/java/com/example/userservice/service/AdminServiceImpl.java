package com.example.userservice.service;

import com.example.userservice.dto.UserProfileDto;
import com.example.userservice.model.User;
import com.example.userservice.model.UserProfile;
import com.example.userservice.repository.UserProfileRepository;
import com.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    UserService userService; // For mapping utility

    @Override
    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", userProfileRepository.sumTotalRevenue());
        stats.put("totalPayouts", userProfileRepository.sumTotalPayouts());
        stats.put("totalUsers", userRepository.count());
        stats.put("activePolicies", userProfileRepository.findAll().stream()
                .mapToLong(p -> p.getPolicies() != null ? p.getPolicies().size() : 0)
                .sum());
        return stats;
    }

    @Override
    public List<UserProfileDto> getAllProfiles() {
        return userProfileRepository.findAll().stream()
                .map(profile -> {
                    // Quick map manual for now or use existing mapping if public
                    UserProfileDto dto = new UserProfileDto();
                    User user = profile.getUser();
                    dto.setId(user.getId());
                    dto.setUsername(user.getUsername());
                    dto.setEmail(user.getEmail());
                    dto.setFullName(profile.getFullName());
                    dto.setPolicies(profile.getPolicies());
                    dto.setClaims(profile.getClaims());
                    dto.setMonthlyPremium(profile.getMonthlyPremium());
                    dto.setTotalClaimsAmount(profile.getTotalClaimsAmount());
                    dto.setRole(user.getRole());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void processClaim(String username, Double amount, String status) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if ("APPROVED".equals(status)) {
            Double currentTotal = profile.getTotalClaimsAmount() != null ? profile.getTotalClaimsAmount() : 0.0;
            profile.setTotalClaimsAmount(currentTotal + amount);
        }

        userProfileRepository.save(profile);
    }

    @Override
    @Transactional
    public void addPolicy(String username, String policyNumber, Double premiumCharge) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.getPolicies().add(policyNumber);
        Double currentPremium = profile.getMonthlyPremium() != null ? profile.getMonthlyPremium() : 0.0;
        profile.setMonthlyPremium(currentPremium + (premiumCharge != null ? premiumCharge : 75.0));

        userProfileRepository.save(profile);
    }

    @Override
    @Transactional
    public void updatePolicy(String username, String oldPolicyId, String newPolicyId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        int index = profile.getPolicies().indexOf(oldPolicyId);
        if (index != -1) {
            profile.getPolicies().set(index, newPolicyId);
            userProfileRepository.save(profile);
        } else {
            throw new RuntimeException("Old policy ID not found for user: " + username);
        }
    }

    @Override
    @Transactional
    public void removePolicy(String username, String policyId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (profile.getPolicies().remove(policyId)) {
            // Decrement premium by a default amount since we don't store per-policy pricing
            Double currentPremium = profile.getMonthlyPremium() != null ? profile.getMonthlyPremium() : 0.0;
            profile.setMonthlyPremium(Math.max(0, currentPremium - 75.0));
            userProfileRepository.save(profile);
        } else {
            throw new RuntimeException("Policy ID not found for user: " + username);
        }
    }
}
