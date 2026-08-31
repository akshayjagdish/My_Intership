# Runbook

## Health

- Liveness: `GET /healthz`
- Metrics: `GET /metrics`
- Dashboard: `GET /`

## Common Incidents

High 401 count:
Check client token configuration and identity provider availability.

High 403 count:
Review recent RBAC changes and audit events for denied permissions.

Slow reporting:
Check cache hit behavior, database size, and report query patterns. Move reporting projections to precomputed tables when data volume grows.

Low inventory:
Use `/api/inventory/items` and inspect `reorderAlerts`.

## Backup

Back up the data volume and audit log volume together. Restore into a staging environment first and run smoke checks before restoring production.
