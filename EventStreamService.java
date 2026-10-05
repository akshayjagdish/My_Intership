package com.example.analytics.events;

import com.example.analytics.metrics.MetricSnapshot;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class EventStreamService {
    private final Sinks.Many<UserEvent> eventSink = Sinks.many().multicast().directBestEffort();
    private final Flux<MetricSnapshot> metrics;

    public EventStreamService() {
        Flux<UserEvent> syntheticEvents = Flux.interval(Duration.ofMillis(650))
                .map(sequence -> randomEvent())
                .doOnNext(event -> eventSink.tryEmitNext(event));

        syntheticEvents.subscribe();

        this.metrics = Flux.interval(Duration.ZERO, Duration.ofSeconds(2))
                .map(tick -> randomMetric())
                .replay(1)
                .autoConnect();
    }

    public Flux<UserEvent> liveEvents() {
        return eventSink.asFlux();
    }

    public Flux<MetricSnapshot> liveMetrics() {
        return metrics;
    }

    public Flux<UserEvent> ingest(Flux<UserEvent> inbound) {
        return inbound.doOnNext(event -> eventSink.tryEmitNext(event));
    }

    private UserEvent randomEvent() {
        ThreadLocalRandom random = ThreadLocalRandom.current();
        List<String> routes = List.of("/pricing", "/checkout", "/dashboard", "/docs", "/campaigns");
        List<String> types = List.of("page_view", "signup", "checkout_started", "purchase", "search");
        String type = types.get(random.nextInt(types.size()));
        double value = "purchase".equals(type) ? random.nextDouble(20, 800) : 0;
        return new UserEvent(
                UUID.randomUUID().toString(),
                "user-" + random.nextInt(1000, 9999),
                "session-" + random.nextInt(100, 999),
                type,
                routes.get(random.nextInt(routes.size())),
                random.nextBoolean() ? "mobile" : "desktop",
                random.nextBoolean() ? "US" : "IN",
                value,
                Instant.now(),
                Map.of("campaign", "growth-q4", "source", random.nextBoolean() ? "organic" : "paid")
        );
    }

    private MetricSnapshot randomMetric() {
        ThreadLocalRandom random = ThreadLocalRandom.current();
        long views = random.nextLong(8_000, 15_000);
        long conversions = random.nextLong(260, 880);
        return new MetricSnapshot(
                Instant.now(),
                random.nextLong(1_400, 5_200),
                views,
                conversions,
                conversions * random.nextDouble(45, 160),
                conversions / (double) views,
                random.nextLong(180, 1_200),
                random.nextDouble(0.08, 0.39),
                List.of("/pricing", "/checkout", "/dashboard").get(random.nextInt(3))
        );
    }
}
