package com.moveinsync.billing.service;

import com.moveinsync.billing.dto.ClientReportDTO;
import com.moveinsync.billing.dto.EmployeeIncentiveDTO;
import com.moveinsync.billing.dto.VendorReportDTO;
import com.moveinsync.billing.model.entity.BillingRecord;
import com.moveinsync.billing.model.entity.Trip;
import com.moveinsync.billing.repository.BillingRecordRepository;
import com.moveinsync.billing.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Report generation service.
 * Time Complexity Analysis:
 * - Client Report: O(r) where r is billing records
 * - Vendor Report: O(1) single record lookup
 * - Employee Report: O(t) where t is employee trips
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final BillingRecordRepository billingRecordRepository;
    private final TripRepository tripRepository;

    /**
     * Generate client-level monthly report.
     * Shows all vendor payments for a client.
     * Time Complexity: O(r + v) where r is records, v is vendors
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "clientReports", key = "#clientId + '-' + #month + '-' + #year")
    public ClientReportDTO generateClientReport(Long clientId, int month, int year) {
        log.info("Generating client report for client {} for {}/{}", clientId, month, year);

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        // Get all trips for this client in the period
        List<Trip> clientTrips = tripRepository.findByClientIdAndDateRange(
                clientId, startDate, endDate
        );

        // Group by vendor and calculate totals
        Map<Long, List<Trip>> tripsByVendor = clientTrips.stream()
                .collect(Collectors.groupingBy(trip -> trip.getVendor().getId()));

        BigDecimal totalAmount = BigDecimal.ZERO;
        int totalTrips = clientTrips.size();

        List<VendorReportDTO> vendorReports = tripsByVendor.entrySet().stream()
                .map(entry -> {
                    Long vendorId = entry.getKey();
                    List<Trip> trips = entry.getValue();

                    // Handle null totalCost values - filter nulls and sum
                    BigDecimal vendorTotal = trips.stream()
                            .map(Trip::getTotalCost)
                            .filter(cost -> cost != null)  // Filter out null values
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return VendorReportDTO.builder()
                            .vendorId(vendorId)
                            .vendorName(trips.get(0).getVendor().getName())
                            .totalTrips(trips.size())
                            .totalAmount(vendorTotal)
                            .build();
                })
                .collect(Collectors.toList());

        totalAmount = vendorReports.stream()
                .map(VendorReportDTO::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ClientReportDTO.builder()
                .clientId(clientId)
                .month(month)
                .year(year)
                .totalTrips(totalTrips)
                .totalAmount(totalAmount)
                .vendorReports(vendorReports)
                .build();
    }

    /**
     * Generate vendor-level monthly report.
     * Shows detailed trip breakdown and payment.
     * Time Complexity: O(1) direct lookup with cached result
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "vendorReports", key = "#vendorId + '-' + #month + '-' + #year")
    public VendorReportDTO generateVendorReport(Long vendorId, int month, int year) {
        log.info("Generating vendor report for vendor {} for {}/{}", vendorId, month, year);

        BillingRecord record = billingRecordRepository
                .findByVendorIdAndBillingMonthAndBillingYear(vendorId, month, year)
                .orElse(null);

        if (record == null) {
            return VendorReportDTO.builder()
                    .vendorId(vendorId)
                    .month(month)
                    .year(year)
                    .totalTrips(0)
                    .totalAmount(BigDecimal.ZERO)
                    .build();
        }

        return VendorReportDTO.builder()
                .vendorId(vendorId)
                .vendorName(record.getVendor().getName())
                .month(month)
                .year(year)
                .totalTrips(record.getTotalTrips())
                .totalDistance(record.getTotalDistance())
                .totalDuration(record.getTotalDuration())
                .baseBilling(record.getBaseBilling())
                .totalIncentives(record.getTotalIncentives())
                .totalAmount(record.getTotalAmount())
                .build();
    }

    /**
     * Generate employee incentive report.
     * Shows earned incentives from extra hours/trips.
     * Time Complexity: O(t) where t is employee trips
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "employeeReports", key = "#employeeId + '-' + #month + '-' + #year")
    public EmployeeIncentiveDTO generateEmployeeIncentiveReport(
            Long employeeId, int month, int year) {
        log.info("Generating employee report for employee {} for {}/{}",
                employeeId, month, year);

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        List<Trip> trips = tripRepository.findByEmployeeIdAndTripDateBetween(
                employeeId, startDate, endDate
        );

        // Handle null employee incentives - filter nulls before summing
        BigDecimal totalIncentive = trips.stream()
                .map(Trip::getEmployeeIncentive)
                .filter(incentive -> incentive != null)  // Filter out null values
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Handle null extra hours - filter nulls before summing
        BigDecimal totalExtraHours = trips.stream()
                .map(trip -> trip.getExtraHours() != null ? trip.getExtraHours() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String employeeName = trips.isEmpty() ? "" : trips.get(0).getEmployee().getName();

        return EmployeeIncentiveDTO.builder()
                .employeeId(employeeId)
                .employeeName(employeeName)
                .month(month)
                .year(year)
                .totalTrips(trips.size())
                .totalExtraHours(totalExtraHours)
                .totalIncentive(totalIncentive)
                .build();
    }
}
