package com.moveinsync.billing.controller;

import com.moveinsync.billing.model.entity.BillingRecord;
import com.moveinsync.billing.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/billing")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class BillingController {

    private final BillingService billingService;

    @PostMapping("/process/{vendorId}")
    public ResponseEntity<BillingRecord> processBilling(
            @PathVariable Long vendorId,
            @RequestParam int month,
            @RequestParam int year) {
        BillingRecord record = billingService.processBillingForVendor(vendorId, month, year);
        return ResponseEntity.ok(record);
    }

    @PostMapping("/process-all")
    public ResponseEntity<String> processAllBilling(
            @RequestParam int month,
            @RequestParam int year) {
        billingService.processBillingForAllVendors(month, year);
        return ResponseEntity.ok("Billing processed for all vendors");
    }
}
