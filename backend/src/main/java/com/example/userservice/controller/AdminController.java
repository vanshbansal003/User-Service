package com.example.userservice.controller;

import com.example.userservice.dto.UserProfileDto;
import com.example.userservice.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getGlobalStats() {
        return ResponseEntity.ok(adminService.getGlobalStats());
    }

    @GetMapping("/all-profiles")
    public ResponseEntity<List<UserProfileDto>> getAllUserProfiles() {
        return ResponseEntity.ok(adminService.getAllProfiles());
    }

    @PostMapping("/claims/{username}/approve")
    public ResponseEntity<?> approveClaim(@PathVariable String username, @RequestBody Map<String, Double> payload) {
        adminService.processClaim(username, payload.get("amount"), "APPROVED");
        return ResponseEntity.ok("Claim approved successfully");
    }

    @PostMapping("/claims/{username}/reject")
    public ResponseEntity<?> rejectClaim(@PathVariable String username) {
        adminService.processClaim(username, 0.0, "REJECTED");
        return ResponseEntity.ok("Claim rejected successfully");
    }

    @PostMapping("/policies/{username}")
    public ResponseEntity<?> addPolicy(@PathVariable String username, @RequestBody Map<String, Object> payload) {
        String policyNumber = (String) payload.get("policyNumber");
        Double premiumCharge = payload.get("premiumCharge") != null
                ? Double.valueOf(payload.get("premiumCharge").toString())
                : null;
        adminService.addPolicy(username, policyNumber, premiumCharge);
        return ResponseEntity.ok("Policy added successfully");
    }

    @PutMapping("/policies/{username}/{oldPolicyId}")
    public ResponseEntity<?> updatePolicy(@PathVariable String username, @PathVariable String oldPolicyId,
            @RequestBody Map<String, String> payload) {
        adminService.updatePolicy(username, oldPolicyId, payload.get("newPolicyId"));
        return ResponseEntity.ok("Policy updated successfully");
    }

    @DeleteMapping("/policies/{username}/{policyId}")
    public ResponseEntity<?> removePolicy(@PathVariable String username, @PathVariable String policyId) {
        adminService.removePolicy(username, policyId);
        return ResponseEntity.ok("Policy removed successfully");
    }
}
