package com.example.userservice.service;

import com.example.userservice.dto.JwtResponse;
import com.example.userservice.dto.LoginDto;
import com.example.userservice.dto.MessageResponse;
import com.example.userservice.dto.UserRegistrationDto;

public interface AuthService {
    JwtResponse authenticateUser(LoginDto loginDto);
    MessageResponse registerUser(UserRegistrationDto registrationDto);
}
