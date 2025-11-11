package com.moveinsync.billing.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeIncentiveDTO {
    private Long employeeId;
    private String employeeName;
    private int month;
    private int year;
    private int totalTrips;
    private BigDecimal totalExtraHours;
    private BigDecimal totalIncentive;
}
