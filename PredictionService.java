package com.example.analytics.predictions;

import com.example.analytics.metrics.MetricService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PredictionService {
    private final MetricService metrics;

    public PredictionService(MetricService metrics) {
        this.metrics = metrics;
    }

    public Mono<Prediction> current() {
        return metrics.stream().next().map(metric -> {
            double momentum = Math.max(0.75, Math.min(1.35, metric.conversionRate() * 18));
            double revenue = metric.revenue() * momentum;
            String recommendation = metric.churnRisk() > 0.28
                    ? "Trigger retention journey for high-risk cohorts"
                    : "Increase spend on routes with strong conversion momentum";
            return new Prediction(
                    metric.timestamp(),
                    revenue,
                    Math.min(0.95, metric.conversionRate() * 11),
                    metric.churnRisk(),
                    recommendation
            );
        });
    }
}
