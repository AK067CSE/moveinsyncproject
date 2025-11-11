package com.moveinsync.billing.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientReportDTO {
    private Long clientId;
    private int month;
    private int year;
    private int totalTrips;
    private BigDecimal totalAmount;
    private List<VendorReportDTO> vendorReports;
}
