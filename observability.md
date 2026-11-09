# Observability and service objectives

## Signals

The health route performs a database check and reports `200` when ready or `503` when degraded. Container health checks consume this endpoint. Application logs currently use the platform defaults; structured request logs, distributed traces, and business metrics remain to be integrated.

Before launch, emit JSON logs with request ID, route, status, duration, and deployment revision. Never log session tokens, secrets, raw goal descriptions, or email addresses. Add OpenTelemetry traces for request, Prisma query, and external dependency spans; sample successful traces and preserve errors.

## Initial service objectives to validate

- Availability: 99.5% monthly for authenticated core read/write journeys.
- Latency: p95 under 500 ms for ordinary API reads at expected launch load.
- Recovery: RPO 24 hours and RTO 4 hours until backup restore drills justify tighter targets.
- Alert on sustained 5xx/error budget burn, failed health checks, database saturation, elevated p95, and backup failures.

These are proposed targets. Confirm user impact and service cost before treating them as commitments.

## Dashboards and review

Create service overview, request/error/latency, database connections/storage, ECS task health, deployment, and backup restore panels. Every alert needs an owner, actionable runbook, and tested delivery route. Review noisy alerts monthly and run a restore exercise before production readiness approval.
