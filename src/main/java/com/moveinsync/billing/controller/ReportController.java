package com.moveinsync.billing.controller;

import com.moveinsync.billing.dto.ClientReportDTO;
import com.moveinsync.billing.dto.EmployeeIncentiveDTO;
import com.moveinsync.billing.dto.VendorReportDTO;
import com.moveinsync.billing.service.ReportService;
import com.moveinsync.billing.model.entity.User;
import com.moveinsync.billing.model.enums.Role;
import com.moveinsync.billing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final UserRepository userRepository;

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClientReportDTO> getClientReport(
            @PathVariable Long clientId,
            @RequestParam int month,
            @RequestParam int year) {
        ClientReportDTO report = reportService.generateClientReport(clientId, month, year);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/vendor/{vendorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDOR')")
    public ResponseEntity<VendorReportDTO> getVendorReport(
            @PathVariable Long vendorId,
            @RequestParam int month,
            @RequestParam int year,
            Authentication authentication) {

        // Get the authenticated user
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If user is VENDOR, ensure they can only access their own report
        if (user.getRole() == Role.VENDOR &&
                !vendorId.equals(user.getVendorId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        VendorReportDTO report = reportService.generateVendorReport(vendorId, month, year);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<EmployeeIncentiveDTO> getEmployeeIncentiveReport(
            @PathVariable Long employeeId,
            @RequestParam int month,
            @RequestParam int year,
            Authentication authentication) {

        // Get the authenticated user
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If user is EMPLOYEE, ensure they can only access their own report
        if (user.getRole() == Role.EMPLOYEE &&
                !employeeId.equals(user.getEmployeeId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        EmployeeIncentiveDTO report = reportService.generateEmployeeIncentiveReport(
                employeeId, month, year);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/vendor/me")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<VendorReportDTO> getMyVendorReport(
            @RequestParam int month,
            @RequestParam int year,
            Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("Logging for {}", user.getVendorId());

        if (user.getVendorId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        VendorReportDTO report = reportService.generateVendorReport(
                user.getVendorId(), month, year);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/employee/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<EmployeeIncentiveDTO> getMyEmployeeReport(
            @RequestParam int month,
            @RequestParam int year,
            Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getEmployeeId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        EmployeeIncentiveDTO report = reportService.generateEmployeeIncentiveReport(
                user.getEmployeeId(), month, year);
        return ResponseEntity.ok(report);
    }
}
