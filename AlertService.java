package com.example.analytics.alerts;

import com.example.analytics.config.AnalyticsProperties;
import com.example.analytics.metrics.MetricService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.time.Instant;
import java.util.UUID;

@Service
public class AlertService {
    private final MetricService metrics;
    private final AnalyticsProperties properties;

    public AlertService(MetricService metrics, AnalyticsProperties properties) {
        this.metrics = metrics;
        this.properties = properties;
    }

    public Flux<Alert> stream() {
        return metrics.stream().flatMap(metric -> {
            if (metric.conversionRate() < properties.alertConversionFloor()) {
                return Flux.just(new Alert(
                        UUID.randomUUID().toString(),
                        "critical",
                        "Conversion rate dropped",
                        "Conversion rate is " + String.format("%.2f%%", metric.conversionRate() * 100),
                        Instant.now()
                ));
            }
            if (metric.p95LatencyMs() > properties.alertLatencyCeilingMs()) {
                return Flux.just(new Alert(
                        UUID.randomUUID().toString(),
                        "warning",
                        "Latency threshold exceeded",
                        "p95 latency is " + metric.p95LatencyMs() + " ms on " + metric.topRoute(),
                        Instant.now()
                ));
            }
            return Flux.empty();
        });
    }
}
