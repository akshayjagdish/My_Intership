package com.example.analytics.metrics;

import java.time.Instant;

public record MetricSnapshot(
        Instant timestamp,
        long activeUsers,
        long pageViews,
        long conversions,
        double revenue,
        double conversionRate,
        long p95LatencyMs,
        double churnRisk,
        String topRoute
) {
}
