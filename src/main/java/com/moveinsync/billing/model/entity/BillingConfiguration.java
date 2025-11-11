package com.moveinsync.billing.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.moveinsync.billing.model.enums.BillingModelType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "billing_configurations")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingConfiguration extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"billingConfiguration", "client", "trips"})
    private Vendor vendor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillingModelType billingModelType;

    // Package Model Fields
    @Column(precision = 10, scale = 2)
    private BigDecimal fixedMonthlyCost;

    private Integer includedTrips;

    @Column(precision = 10, scale = 2)
    private BigDecimal includedKilometers;

    // Trip Model Fields
    @Column(precision = 10, scale = 2)
    private BigDecimal costPerTrip;

    @Column(precision = 10, scale = 2)
    private BigDecimal costPerKilometer;

    // Incentive Rates
    @Column(precision = 10, scale = 2)
    private BigDecimal extraKilometerRate;

    @Column(precision = 10, scale = 2)
    private BigDecimal extraHourRate;

    // Standard Limits
    @Column(precision = 10, scale = 2)
    private BigDecimal standardKilometersPerTrip;

    @Column(precision = 10, scale = 2)
    private BigDecimal standardHoursPerTrip;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
