package com.example.analytics.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "analytics")
public record AnalyticsProperties(
        String elasticsearchUrl,
        String externalApiUrl,
        double alertConversionFloor,
        long alertLatencyCeilingMs
) {
}
