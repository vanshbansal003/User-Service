package com.example.userservice.service;

import com.example.userservice.dto.UserProfileDto;
import com.example.userservice.dto.UserProfileUpdateDto;
import com.example.userservice.model.User;
import com.example.userservice.model.UserProfile;
import com.example.userservice.repository.UserProfileRepository;
import com.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserProfileRepository userProfileRepository;

    @Override
    public UserProfileDto getCurrentUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return mapToDto(user, profile);
    }

    @Override
    @Transactional
    public UserProfileDto updateUserProfile(String username, UserProfileUpdateDto updateDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (updateDto.getFullName() != null)
            profile.setFullName(updateDto.getFullName());
        if (updateDto.getAddress() != null)
            profile.setAddress(updateDto.getAddress());
        if (updateDto.getPhoneNumber() != null)
            profile.setPhoneNumber(updateDto.getPhoneNumber());
        if (updateDto.getDateOfBirth() != null)
            profile.setDateOfBirth(updateDto.getDateOfBirth());
        if (updateDto.getPolicies() != null)
            profile.setPolicies(updateDto.getPolicies());
        if (updateDto.getClaims() != null)
            profile.setClaims(updateDto.getClaims());
        if (updateDto.getMonthlyPremium() != null)
            profile.setMonthlyPremium(updateDto.getMonthlyPremium());
        if (updateDto.getTotalClaimsAmount() != null)
            profile.setTotalClaimsAmount(updateDto.getTotalClaimsAmount());

        UserProfile savedProfile = userProfileRepository.save(profile);

        return mapToDto(user, savedProfile);
    }

    private UserProfileDto mapToDto(User user, UserProfile profile) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(profile.getFullName());
        dto.setAddress(profile.getAddress());
        dto.setPhoneNumber(profile.getPhoneNumber());
        dto.setDateOfBirth(profile.getDateOfBirth());
        dto.setPolicies(profile.getPolicies());
        dto.setClaims(profile.getClaims());
        dto.setMonthlyPremium(profile.getMonthlyPremium());
        dto.setTotalClaimsAmount(profile.getTotalClaimsAmount());
        dto.setRole(user.getRole());
        return dto;
    }
}
