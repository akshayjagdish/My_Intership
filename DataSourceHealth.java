package com.example.analytics.metrics;

public record DataSourceHealth(
        String name,
        String type,
        String status,
        long recordsAvailable,
        long latencyMs
) {
}
