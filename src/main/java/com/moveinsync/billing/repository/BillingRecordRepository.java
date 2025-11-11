package com.moveinsync.billing.repository;

import com.moveinsync.billing.model.entity.BillingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillingRecordRepository extends JpaRepository<BillingRecord, Long> {

    Optional<BillingRecord> findByVendorIdAndBillingMonthAndBillingYear(
            Long vendorId, Integer month, Integer year
    );

    List<BillingRecord> findByBillingMonthAndBillingYear(Integer month, Integer year);

    List<BillingRecord> findByVendorId(Long vendorId);
}
