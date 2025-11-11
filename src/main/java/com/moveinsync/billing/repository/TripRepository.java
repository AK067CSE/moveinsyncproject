package com.moveinsync.billing.repository;

import com.moveinsync.billing.model.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByVendorIdAndTripDateBetween(
            Long vendorId, LocalDateTime startDate, LocalDateTime endDate
    );

    List<Trip> findByEmployeeIdAndTripDateBetween(
            Long employeeId, LocalDateTime startDate, LocalDateTime endDate
    );

    @Query("SELECT t FROM Trip t WHERE t.vendor.client.id = :clientId " +
            "AND t.tripDate BETWEEN :startDate AND :endDate")
    List<Trip> findByClientIdAndDateRange(
            @Param("clientId") Long clientId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT t FROM Trip t WHERE t.processed = false")
    List<Trip> findUnprocessedTrips();
}
