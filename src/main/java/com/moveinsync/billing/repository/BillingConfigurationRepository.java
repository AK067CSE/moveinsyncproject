package com.moveinsync.billing.repository;

import com.moveinsync.billing.model.entity.BillingConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BillingConfigurationRepository extends JpaRepository<BillingConfiguration, Long> {
    Optional<BillingConfiguration> findByVendorId(Long vendorId);
}
