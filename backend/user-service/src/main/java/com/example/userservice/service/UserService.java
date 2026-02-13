package com.example.userservice.service;

import com.example.userservice.dto.UserProfileDto;
import com.example.userservice.dto.UserProfileUpdateDto;

public interface UserService {
    UserProfileDto getCurrentUserProfile(String username);
    UserProfileDto updateUserProfile(String username, UserProfileUpdateDto updateDto);
}
