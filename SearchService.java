package com.example.analytics.search;

import com.example.analytics.config.AnalyticsProperties;
import com.example.analytics.events.EventStreamService;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {
    private final EventStreamService events;
    private final WebClient elasticsearch;

    public SearchService(EventStreamService events, AnalyticsProperties properties, WebClient.Builder webClientBuilder) {
        this.events = events;
        this.elasticsearch = webClientBuilder.baseUrl(properties.elasticsearchUrl()).build();
    }

    public Flux<SearchDocument> indexLiveEvents() {
        return events.liveEvents()
                .map(event -> new SearchDocument(
                        event.id(),
                        "user_event",
                        event.eventType() + " on " + event.route(),
                        "User " + event.userId() + " from " + event.country() + " used " + event.device(),
                        event.route(),
                        event.value(),
                        Instant.now()
                ));
    }

    public Mono<List<SearchDocument>> search(String query) {
        String normalized = query == null ? "" : query.toLowerCase();
        Mono<List<SearchDocument>> elasticResults = elasticsearch.post()
                .uri("/analytics-documents/_search")
                .bodyValue(Map.of(
                        "query", Map.of(
                                "multi_match", Map.of(
                                        "query", normalized.isBlank() ? "*" : normalized,
                                        "fields", List.of("title^2", "body", "route")
                                )
                        ),
                        "size", 10
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .map(this::toSearchDocuments)
                .onErrorResume(ignored -> Mono.empty());

        Mono<List<SearchDocument>> fallback = Flux.just(
                        new SearchDocument("doc-1", "metric", "Checkout conversion spike", "Revenue lift from paid campaigns", "/checkout", 0.96, Instant.now()),
                        new SearchDocument("doc-2", "segment", "Mobile users in India", "High search activity and lower latency", "/search", 0.88, Instant.now()),
                        new SearchDocument("doc-3", "alert", "Pricing route latency", "p95 latency breached warning threshold", "/pricing", 0.81, Instant.now())
                )
                .filter(doc -> normalized.isBlank()
                        || doc.title().toLowerCase().contains(normalized)
                        || doc.body().toLowerCase().contains(normalized)
                        || doc.route().toLowerCase().contains(normalized))
                .collectList();

        return elasticResults.filter(results -> !results.isEmpty()).switchIfEmpty(fallback);
    }

    @SuppressWarnings("unchecked")
    private List<SearchDocument> toSearchDocuments(Map<String, Object> response) {
        Map<String, Object> hits = (Map<String, Object>) response.getOrDefault("hits", Map.of());
        List<Map<String, Object>> documents = (List<Map<String, Object>>) hits.getOrDefault("hits", List.of());
        return documents.stream().map(hit -> {
            Map<String, Object> source = (Map<String, Object>) hit.getOrDefault("_source", Map.of());
            Number score = (Number) hit.getOrDefault("_score", 0);
            return new SearchDocument(
                    String.valueOf(hit.getOrDefault("_id", source.getOrDefault("id", ""))),
                    String.valueOf(source.getOrDefault("type", "document")),
                    String.valueOf(source.getOrDefault("title", "Untitled")),
                    String.valueOf(source.getOrDefault("body", "")),
                    String.valueOf(source.getOrDefault("route", "/")),
                    score.doubleValue(),
                    Instant.now()
            );
        }).toList();
    }
}
