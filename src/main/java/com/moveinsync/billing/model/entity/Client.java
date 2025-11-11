package com.moveinsync.billing.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String clientCode;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String address;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"client", "billingConfiguration", "trips"})
    @Builder.Default
    private List<Vendor> vendors = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"client", "trips"})
    @Builder.Default
    private List<Employee> employees = new ArrayList<>();

    // Business logic methods
    public void addVendor(Vendor vendor) {
        vendors.add(vendor);
        vendor.setClient(this);
    }

    public void removeVendor(Vendor vendor) {
        vendors.remove(vendor);
        vendor.setClient(null);
    }
}
