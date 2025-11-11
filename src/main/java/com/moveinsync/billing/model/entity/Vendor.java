package com.moveinsync.billing.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vendors")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String vendorCode;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String address;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnoreProperties({"vendors", "employees"})
    private Client client;

    @OneToOne(mappedBy = "vendor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("vendor")
    private BillingConfiguration billingConfiguration;

    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"vendor", "employee"})
    @Builder.Default
    private List<Trip> trips = new ArrayList<>();
}
