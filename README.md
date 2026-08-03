# Microservices Social Media Platform

A distributed social media platform scaffold built with Spring Cloud, React, RabbitMQ, Docker, centralized logging, tracing, service discovery, gateway routing, and resilience patterns.

## Services

- `config-server` - distributed configuration server
- `discovery-server` - Eureka service discovery
- `api-gateway` - Spring Cloud Gateway entry point
- `user-service` - user profiles
- `post-service` - posts and feed
- `media-service` - media metadata and upload URL simulation
- `notification-service` - RabbitMQ event consumer and notification API
- `chat-service` - REST + WebSocket chat
- `frontend` - React UI

## Run

```powershell
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- API Gateway: http://localhost:8080
- Eureka: http://localhost:8761
- RabbitMQ UI: http://localhost:15672 (`guest` / `guest`)
- Zipkin: http://localhost:9411
- Grafana: http://localhost:3000 (`admin` / `admin`)

## Gateway Routes

- `/api/users/**` -> user service
- `/api/posts/**` -> post service
- `/api/media/**` -> media service
- `/api/notifications/**` -> notification service
- `/api/chat/**` and `/ws/**` -> chat service

## Build Locally

```powershell
mvn clean package
```

The services use in-memory stores so the system can start without external databases. Replace repositories with PostgreSQL/MongoDB adapters when moving beyond the learning/demo phase.
