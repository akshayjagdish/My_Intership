package com.example.analytics.predictions;

import java.time.Instant;

public record Prediction(
        Instant timestamp,
        double expectedRevenueNextHour,
        double conversionProbability,
        double churnRisk,
        String recommendation
) {
}
