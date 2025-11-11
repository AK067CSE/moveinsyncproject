package com.moveinsync.billing.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips", indexes = {
        @Index(name = "idx_trip_date", columnList = "tripDate"),
        @Index(name = "idx_vendor_date", columnList = "vendor_id,tripDate"),
        @Index(name = "idx_employee_date", columnList = "employee_id,tripDate")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String tripCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    @JsonIgnoreProperties({"trips", "client", "billingConfiguration"})
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnoreProperties({"trips", "client"})
    private Employee employee;

    @Column(nullable = false)
    private LocalDateTime tripDate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal distanceKm;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal durationHours;

    private String source;

    private String destination;

    @Column(precision = 10, scale = 2)
    private BigDecimal extraKilometers;

    @Column(precision = 10, scale = 2)
    private BigDecimal extraHours;

    @Column(nullable = false)
    @Builder.Default
    private Boolean processed = false;

    // Calculated fields (computed during billing)
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal baseCost = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal vendorIncentive = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal employeeIncentive = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalCost = BigDecimal.ZERO;
}
