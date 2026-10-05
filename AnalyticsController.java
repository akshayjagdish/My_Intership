package com.example.analytics.metrics;

import com.example.analytics.alerts.Alert;
import com.example.analytics.alerts.AlertService;
import com.example.analytics.events.EventStreamService;
import com.example.analytics.events.UserEvent;
import com.example.analytics.predictions.Prediction;
import com.example.analytics.predictions.PredictionService;
import com.example.analytics.search.SearchDocument;
import com.example.analytics.search.SearchService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
public class AnalyticsController {
    private final MetricService metrics;
    private final EventStreamService events;
    private final SearchService search;
    private final AlertService alerts;
    private final PredictionService predictions;
    private final DataIntegrationService dataIntegration;

    public AnalyticsController(
            MetricService metrics,
            EventStreamService events,
            SearchService search,
            AlertService alerts,
            PredictionService predictions,
            DataIntegrationService dataIntegration
    ) {
        this.metrics = metrics;
        this.events = events;
        this.search = search;
        this.alerts = alerts;
        this.predictions = predictions;
        this.dataIntegration = dataIntegration;
    }

    @GetMapping(value = "/api/metrics/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    Flux<MetricSnapshot> streamMetrics() {
        return metrics.stream();
    }

    @GetMapping("/api/metrics/history")
    Mono<List<MetricSnapshot>> history(@RequestParam(defaultValue = "24") int points) {
        return metrics.history(points);
    }

    @GetMapping("/api/data-sources/health")
    Mono<List<DataSourceHealth>> dataSources() {
        return dataIntegration.health();
    }

    @GetMapping(value = "/api/events/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    Flux<UserEvent> streamEvents() {
        return events.liveEvents();
    }

    @PostMapping("/api/events")
    Flux<UserEvent> ingest(@RequestBody Flux<UserEvent> inbound) {
        return events.ingest(inbound);
    }

    @GetMapping("/api/search")
    Mono<List<SearchDocument>> search(@RequestParam(defaultValue = "") String q) {
        return search.search(q);
    }

    @GetMapping(value = "/api/search/index-feed", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    Flux<SearchDocument> indexFeed() {
        return search.indexLiveEvents();
    }

    @GetMapping(value = "/api/alerts/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    Flux<Alert> alertStream() {
        return alerts.stream();
    }

    @GetMapping("/api/predictions/current")
    Mono<Prediction> prediction() {
        return predictions.current();
    }
}
