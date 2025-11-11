package com.moveinsync.billing.strategy;

import com.moveinsync.billing.model.enums.BillingModelType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Factory pattern for creating billing strategies.
 * Demonstrates Factory Design Pattern (OOP principle).
 */
@Component
@RequiredArgsConstructor
public class BillingStrategyFactory {

    private final Map<String, BillingStrategy> strategies;

    public BillingStrategy getStrategy(BillingModelType type) {
        BillingStrategy strategy = strategies.get(type.name());
        if (strategy == null) {
            throw new IllegalArgumentException("Unknown billing model type: " + type);
        }
        return strategy;
    }
}
