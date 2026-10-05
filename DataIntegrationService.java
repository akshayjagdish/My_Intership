package com.example.analytics.metrics;

import com.example.analytics.config.AnalyticsProperties;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@Service
public class DataIntegrationService {
    private final AnalyticsProperties properties;

    public DataIntegrationService(AnalyticsProperties properties) {
        this.properties = properties;
    }

    public Mono<List<DataSourceHealth>> health() {
        return Flux.merge(sqlHealth(), noSqlHealth(), apiHealth()).collectList();
    }

    private Mono<DataSourceHealth> sqlHealth() {
        return Mono.delay(Duration.ofMillis(35))
                .map(ignored -> new DataSourceHealth("postgres-orders", "SQL/R2DBC", "ready", 128_400, 35));
    }

    private Mono<DataSourceHealth> noSqlHealth() {
        return Mono.delay(Duration.ofMillis(28))
                .map(ignored -> new DataSourceHealth("mongo-sessions", "NoSQL/MongoDB", "ready", 981_250, 28));
    }

    private Mono<DataSourceHealth> apiHealth() {
        return Mono.delay(Duration.ofMillis(61))
                .map(ignored -> new DataSourceHealth(properties.externalApiUrl(), "External API", "configured", 12_000, 61));
    }
}
