package com.moveinsync.billing.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorReportDTO {
    private Long vendorId;
    private String vendorName;
    private int month;
    private int year;
    private int totalTrips;
    private BigDecimal totalDistance;
    private BigDecimal totalDuration;
    private BigDecimal baseBilling;
    private BigDecimal totalIncentives;
    private BigDecimal totalAmount;
}
