package com.moveinsync.billing.strategy;

import com.moveinsync.billing.model.entity.BillingConfiguration;
import com.moveinsync.billing.model.entity.Trip;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Package Model: Fixed monthly cost for certain trips/kilometers.
 * Time Complexity: O(n) for processing all trips
 * Space Complexity: O(1) constant space
 */
@Component("PACKAGE")
public class PackageBillingStrategy implements BillingStrategy {

    @Override
    public BigDecimal calculateBilling(List<Trip> trips, BillingConfiguration config) {
        BigDecimal totalCost = config.getFixedMonthlyCost();
        BigDecimal totalIncentives = BigDecimal.ZERO;

        // Calculate total distance and trips
        int tripCount = trips.size();
        BigDecimal totalDistance = trips.stream()
                .map(Trip::getDistanceKm)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Check if exceeded package limits
        if (tripCount > config.getIncludedTrips()) {
            int extraTrips = tripCount - config.getIncludedTrips();
            BigDecimal extraTripCost = config.getCostPerTrip()
                    .multiply(BigDecimal.valueOf(extraTrips));
            totalCost = totalCost.add(extraTripCost);
        }

        if (totalDistance.compareTo(config.getIncludedKilometers()) > 0) {
            BigDecimal extraKm = totalDistance.subtract(config.getIncludedKilometers());
            BigDecimal extraKmCost = extraKm.multiply(config.getExtraKilometerRate());
            totalCost = totalCost.add(extraKmCost);
        }

        // Calculate incentives for each trip
        for (Trip trip : trips) {
            calculateIncentives(trip, config);
            totalIncentives = totalIncentives.add(
                    trip.getVendorIncentive().add(trip.getEmployeeIncentive())
            );
        }

        return totalCost.add(totalIncentives);
    }

    @Override
    public void calculateIncentives(Trip trip, BillingConfiguration config) {
        BigDecimal vendorIncentive = BigDecimal.ZERO;
        BigDecimal employeeIncentive = BigDecimal.ZERO;

        // Calculate extra kilometers
        BigDecimal extraKm = trip.getDistanceKm()
                .subtract(config.getStandardKilometersPerTrip());
        if (extraKm.compareTo(BigDecimal.ZERO) > 0) {
            trip.setExtraKilometers(extraKm);
            vendorIncentive = vendorIncentive.add(
                    extraKm.multiply(config.getExtraKilometerRate())
            );
        }

        // Calculate extra hours
        BigDecimal extraHours = trip.getDurationHours()
                .subtract(config.getStandardHoursPerTrip());
        if (extraHours.compareTo(BigDecimal.ZERO) > 0) {
            trip.setExtraHours(extraHours);
            vendorIncentive = vendorIncentive.add(
                    extraHours.multiply(config.getExtraHourRate())
            );
            // Employee gets 50% of extra hour incentive
            employeeIncentive = extraHours.multiply(config.getExtraHourRate())
                    .multiply(BigDecimal.valueOf(0.5));
        }

        trip.setVendorIncentive(vendorIncentive);
        trip.setEmployeeIncentive(employeeIncentive);
    }
}
