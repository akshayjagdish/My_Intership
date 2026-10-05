package com.example.analytics.metrics;

import com.example.analytics.events.EventStreamService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

@Service
public class MetricService {
    private final EventStreamService events;

    public MetricService(EventStreamService events) {
        this.events = events;
    }

    public Flux<MetricSnapshot> stream() {
        return events.liveMetrics();
    }

    public Mono<List<MetricSnapshot>> history(int points) {
        int count = Math.max(1, Math.min(points, 100));
        return Mono.fromSupplier(() -> IntStream.range(0, count)
                .mapToObj(index -> historicalPoint(count - index))
                .toList());
    }

    private MetricSnapshot historicalPoint(int minutesAgo) {
        ThreadLocalRandom random = ThreadLocalRandom.current();
        long views = random.nextLong(7_000, 14_000);
        long conversions = random.nextLong(240, 820);
        return new MetricSnapshot(
                Instant.now().minus(Duration.ofMinutes(minutesAgo)),
                random.nextLong(1_000, 4_800),
                views,
                conversions,
                conversions * random.nextDouble(40, 155),
                conversions / (double) views,
                random.nextLong(180, 1_100),
                random.nextDouble(0.07, 0.34),
                List.of("/pricing", "/checkout", "/dashboard").get(random.nextInt(3))
        );
    }
}
