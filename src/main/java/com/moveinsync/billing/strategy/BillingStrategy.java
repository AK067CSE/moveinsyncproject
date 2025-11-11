package com.moveinsync.billing.strategy;

import com.moveinsync.billing.model.entity.BillingConfiguration;
import com.moveinsync.billing.model.entity.Trip;

import java.math.BigDecimal;
import java.util.List;

/**
 * Strategy interface for different billing models.
 * Demonstrates Strategy Design Pattern (OOP principle).
 */
public interface BillingStrategy {

    /**
     * Calculates billing for a list of trips based on configuration.
     * Time Complexity: O(n) where n is number of trips
     * Space Complexity: O(1) as we calculate in-place
     */
    BigDecimal calculateBilling(List<Trip> trips, BillingConfiguration config);

    /**
     * Calculates incentives for extra kilometers and hours.
     */
    void calculateIncentives(Trip trip, BillingConfiguration config);
}
