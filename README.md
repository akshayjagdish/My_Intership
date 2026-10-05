# Realtime Analytics Dashboard

Cutting-edge analytics dashboard reference implementation for monitoring business metrics and user behavior across a reactive backend, mobile app, search, serverless processing, and observability stack.

## Architecture

- `backend/`: Spring Boot WebFlux service with reactive APIs, SSE, WebSocket streaming, alerting, search feed, and prediction endpoints.
- `mobile/`: Expo React Native dashboard with live SSE metrics, charts, KPIs, and alerts.
- `serverless/ingestion/`: AWS Lambda-style function that normalizes, enriches, scores, and emits behavior events.
- `infra/`: Docker Compose services for PostgreSQL, MongoDB, Elasticsearch, Prometheus, and Grafana.
- `docs/`: implementation guide and operating notes.

## Quick Start

1. Start platform services:

   ```bash
   docker compose -f infra/docker-compose.yml up -d
   ```

2. Run the reactive backend:

   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. Run the mobile app:

   ```bash
   cd mobile
   npm install
   EXPO_PUBLIC_API_BASE_URL=http://localhost:8080 npm start
   ```

## Key Endpoints

- `GET /api/metrics/stream`: server-sent events for live KPI snapshots.
- `GET /ws/metrics`: WebSocket stream for live KPI snapshots.
- `GET /api/data-sources/health`: SQL, NoSQL, and external API integration status.
- `GET /api/events/stream`: server-sent user behavior stream.
- `POST /api/events`: reactive ingestion endpoint accepting a stream of events.
- `GET /api/search?q=checkout`: Elasticsearch-ready search API.
- `GET /api/search/index-feed`: live event-to-document indexing feed.
- `GET /api/alerts/stream`: live alert notifications.
- `GET /api/predictions/current`: current ML-style prediction output.
- `GET /actuator/prometheus`: metrics for Prometheus and Grafana.
