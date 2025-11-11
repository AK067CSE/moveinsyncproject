package com.moveinsync.billing.strategy;

import com.moveinsync.billing.model.entity.BillingConfiguration;
import com.moveinsync.billing.model.entity.Trip;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Hybrid Model: Combination of package and trip-based billing.
 * Time Complexity: O(n) for processing trips
 * Space Complexity: O(1) constant space
 */
@Component("HYBRID")
public class HybridBillingStrategy implements BillingStrategy {

    @Override
    public BigDecimal calculateBilling(List<Trip> trips, BillingConfiguration config) {
        // Start with base package cost
        BigDecimal totalCost = config.getFixedMonthlyCost();

        int tripCount = trips.size();
        BigDecimal totalDistance = BigDecimal.ZERO;

        // Calculate aggregate metrics - O(n) traversal
        for (Trip trip : trips) {
            totalDistance = totalDistance.add(trip.getDistanceKm());
        }

        // Beyond package limits, charge per trip/distance
        if (tripCount > config.getIncludedTrips()) {
            int extraTrips = tripCount - config.getIncludedTrips();
            for (int i = config.getIncludedTrips(); i < tripCount; i++) {
                Trip trip = trips.get(i);
                BigDecimal extraCost = trip.getDistanceKm()
                        .multiply(config.getCostPerKilometer())
                        .add(config.getCostPerTrip());
                trip.setBaseCost(extraCost);
                totalCost = totalCost.add(extraCost);
            }
        }

        // Calculate incentives for all trips
        BigDecimal totalIncentives = BigDecimal.ZERO;
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

        // Extra kilometers
        BigDecimal extraKm = trip.getDistanceKm()
                .subtract(config.getStandardKilometersPerTrip());
        if (extraKm.compareTo(BigDecimal.ZERO) > 0) {
            trip.setExtraKilometers(extraKm);
            vendorIncentive = vendorIncentive.add(
                    extraKm.multiply(config.getExtraKilometerRate())
            );
        }

        // Extra hours
        BigDecimal extraHours = trip.getDurationHours()
                .subtract(config.getStandardHoursPerTrip());
        if (extraHours.compareTo(BigDecimal.ZERO) > 0) {
            trip.setExtraHours(extraHours);
            BigDecimal extraHourIncentive = extraHours.multiply(config.getExtraHourRate());
            vendorIncentive = vendorIncentive.add(extraHourIncentive);
            employeeIncentive = extraHourIncentive.multiply(BigDecimal.valueOf(0.5));
        }

        trip.setVendorIncentive(vendorIncentive);
        trip.setEmployeeIncentive(employeeIncentive);
    }
}
