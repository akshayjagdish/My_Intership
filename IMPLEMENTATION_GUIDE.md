# Implementation Guide

## 1. Reactive Foundation

The backend uses Spring WebFlux and Reactor types throughout the HTTP layer. Controllers return `Flux` and `Mono`, which keeps the service non-blocking from request handling through streaming responses.

Main files:

- `backend/src/main/java/com/example/analytics/metrics/AnalyticsController.java`
- `backend/src/main/java/com/example/analytics/events/EventStreamService.java`

## 2. Real-Time Features

Realtime delivery is implemented with two protocols:

- SSE for mobile-friendly streams: `/api/metrics/stream`, `/api/events/stream`, `/api/alerts/stream`
- WebSocket for bidirectional dashboard clients: `/ws/metrics`

The stream service currently generates synthetic events so the dashboard works immediately. Production ingestion can publish real events through `POST /api/events`.

## 3. Data Integration

The project is wired for multiple data classes:

- SQL: PostgreSQL service and R2DBC dependency for transactional metrics.
- NoSQL: MongoDB service and Spring Data MongoDB dependency for session and behavior documents.
- APIs: external API URL configuration for enrichment providers.
- Serverless: Lambda-style ingestion function for edge/event processing.

Use `/api/data-sources/health` to verify the integration layer. For production, replace the synthetic generator in `EventStreamService` with reactive repositories and API clients.

## 4. Search & Analytics

Elasticsearch is included in Compose and the backend exposes:

- `/api/search`: search query endpoint.
- `/api/search/index-feed`: event-to-document feed that can be consumed by a dedicated indexer.

The Java Elasticsearch client dependency is included so the next step can promote the current in-memory search service into a real index-backed service.

## 5. Mobile & Cloud

The mobile app is an Expo React Native app optimized for phones and tablets. It subscribes to SSE streams, renders KPI cards, charts, live alerts, and behavior signals.

The serverless function performs:

- payload normalization
- segment enrichment
- risk scoring
- EventBridge fanout when `EVENT_BUS_NAME` is configured

## 6. Advanced Features

Predictions are exposed through `/api/predictions/current`. The current implementation uses a deterministic scoring model over live metrics, which is useful for local development and can be swapped for a model endpoint later.

Alerting is reactive and threshold-driven. Configure thresholds with:

- `ALERT_CONVERSION_FLOOR`
- `ALERT_LATENCY_CEILING_MS`

Monitoring is available through Spring Actuator, Prometheus, and Grafana.
