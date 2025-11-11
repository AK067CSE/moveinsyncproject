package com.moveinsync.billing.strategy;

import com.moveinsync.billing.model.entity.BillingConfiguration;
import com.moveinsync.billing.model.entity.Trip;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Trip Model: Billing based on number of trips or distance.
 * Time Complexity: O(n) linear scan through trips
 * Space Complexity: O(1) constant space
 */
@Component("TRIP")
public class TripBillingStrategy implements BillingStrategy {

    @Override
    public BigDecimal calculateBilling(List<Trip> trips, BillingConfiguration config) {
        BigDecimal totalCost = BigDecimal.ZERO;

        for (Trip trip : trips) {
            // Base cost per trip
            BigDecimal tripCost = config.getCostPerTrip();

            // Distance-based cost
            BigDecimal distanceCost = trip.getDistanceKm()
                    .multiply(config.getCostPerKilometer());

            BigDecimal baseCost = tripCost.add(distanceCost);
            trip.setBaseCost(baseCost);

            // Calculate incentives
            calculateIncentives(trip, config);

            // Total cost for this trip
            BigDecimal tripTotal = baseCost
                    .add(trip.getVendorIncentive())
                    .add(trip.getEmployeeIncentive());
            trip.setTotalCost(tripTotal);

            totalCost = totalCost.add(tripTotal);
        }

        return totalCost;
    }

    @Override
    public void calculateIncentives(Trip trip, BillingConfiguration config) {
        BigDecimal vendorIncentive = BigDecimal.ZERO;
        BigDecimal employeeIncentive = BigDecimal.ZERO;

        // Extra kilometers incentive
        BigDecimal extraKm = trip.getDistanceKm()
                .subtract(config.getStandardKilometersPerTrip());
        if (extraKm.compareTo(BigDecimal.ZERO) > 0) {
            trip.setExtraKilometers(extraKm);
            vendorIncentive = vendorIncentive.add(
                    extraKm.multiply(config.getExtraKilometerRate())
            );
        }

        // Extra hours incentive
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
