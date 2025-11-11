package com.moveinsync.billing.repository;

import com.moveinsync.billing.model.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    Optional<Vendor> findByVendorCode(String vendorCode);
    List<Vendor> findByClientId(Long clientId);

    @Query("SELECT v FROM Vendor v JOIN FETCH v.billingConfiguration WHERE v.id = :id")
    Optional<Vendor> findByIdWithBillingConfig(Long id);
}
