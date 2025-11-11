package com.moveinsync.billing.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "billing_records", indexes = {
        @Index(name = "idx_billing_period", columnList = "billingMonth,billingYear")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingRecord extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    @JsonIgnoreProperties({"billingConfiguration", "client", "trips"})
    private Vendor vendor;

    @Column(nullable = false)
    private Integer billingMonth;

    @Column(nullable = false)
    private Integer billingYear;

    @Column(nullable = false)
    private Integer totalTrips;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalDistance;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalDuration;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal baseBilling;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalIncentives;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    @Builder.Default
    private LocalDate generatedDate = LocalDate.now();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "billing_record_id")
    @JsonIgnoreProperties({"vendor", "employee"})
    @Builder.Default
    private List<Trip> trips = new ArrayList<>();
}
