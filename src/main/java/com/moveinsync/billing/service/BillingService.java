package com.moveinsync.billing.service;

import com.moveinsync.billing.exception.ResourceNotFoundException;
import com.moveinsync.billing.model.entity.*;
import com.moveinsync.billing.repository.*;
import com.moveinsync.billing.strategy.BillingStrategy;
import com.moveinsync.billing.strategy.BillingStrategyFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

/**
 * Core billing service implementing business logic.
 * Demonstrates separation of concerns and single responsibility (SOLID principles).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BillingService {

    private final TripRepository tripRepository;
    private final VendorRepository vendorRepository;
    private final BillingConfigurationRepository configRepository;
    private final BillingRecordRepository billingRecordRepository;
    private final BillingStrategyFactory strategyFactory;

    /**
     * Process billing for a specific vendor and month.
     * Time Complexity: O(n) where n is number of trips
     * Space Complexity: O(n) for storing trip list
     */
    @Transactional
    public BillingRecord processBillingForVendor(Long vendorId, int month, int year) {
        log.info("Processing billing for vendor {} for {}/{}", vendorId, month, year);

        // Check if billing already exists for this period
        Optional<BillingRecord> existingRecord = billingRecordRepository
                .findByVendorIdAndBillingMonthAndBillingYear(vendorId, month, year);

        if (existingRecord.isPresent()) {
            log.warn("Billing record already exists for vendor {} in {}/{}",
                    vendorId, month, year);
            throw new IllegalStateException(
                    String.format("Billing already processed for vendor %d in %d/%d. " +
                            "Delete existing record to reprocess.", vendorId, month, year)
            );
        }

        // Fetch vendor with billing configuration
        Vendor vendor = vendorRepository.findByIdWithBillingConfig(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + vendorId));

        BillingConfiguration config = vendor.getBillingConfiguration();
        if (config == null) {
            throw new IllegalStateException("Billing configuration not found for vendor: " + vendorId);
        }

        // Get trips for the month - O(n) query with index optimization
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        List<Trip> trips = tripRepository.findByVendorIdAndTripDateBetween(
                vendorId, startDate, endDate
        );

        if (trips.isEmpty()) {
            log.warn("No trips found for vendor {} in {}/{}", vendorId, month, year);
            return null;
        }

        // Get appropriate billing strategy - O(1) map lookup
        BillingStrategy strategy = strategyFactory.getStrategy(config.getBillingModelType());

        // Calculate billing - O(n) time complexity
        BigDecimal totalAmount = strategy.calculateBilling(trips, config);

        // Calculate aggregates - O(n) traversal
        BigDecimal totalDistance = trips.stream()
                .map(Trip::getDistanceKm)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDuration = trips.stream()
                .map(Trip::getDurationHours)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalIncentives = trips.stream()
                .map(trip -> trip.getVendorIncentive().add(trip.getEmployeeIncentive()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Mark trips as processed
        trips.forEach(trip -> trip.setProcessed(true));
        tripRepository.saveAll(trips);

        // Create billing record
        BillingRecord record = BillingRecord.builder()
                .vendor(vendor)
                .billingMonth(month)
                .billingYear(year)
                .totalTrips(trips.size())
                .totalDistance(totalDistance)
                .totalDuration(totalDuration)
                .baseBilling(totalAmount.subtract(totalIncentives))
                .totalIncentives(totalIncentives)
                .totalAmount(totalAmount)
                .trips(trips)
                .build();

        return billingRecordRepository.save(record);
    }

    /**
     * Process billing for all vendors in a given month.
     * Time Complexity: O(v * n) where v is vendors, n is avg trips per vendor
     */
    @Transactional
    public void processBillingForAllVendors(int month, int year) {
        log.info("Processing billing for all vendors for {}/{}", month, year);

        List<Vendor> vendors = vendorRepository.findAll();

        for (Vendor vendor : vendors) {
            try {
                processBillingForVendor(vendor.getId(), month, year);
            } catch (Exception e) {
                log.error("Failed to process billing for vendor {}: {}",
                        vendor.getId(), e.getMessage());
                // Continue processing other vendors (fault tolerance)
            }
        }
    }
}
