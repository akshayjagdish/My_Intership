# Operations runbook

## Local start

1. Copy `.env.example` to `.env` and use non-production values.
2. Run `docker compose up --build`.
3. Check `http://localhost:3000/api/health`; it should return status `ok`.
4. Stop with `docker compose down`. Preserve the local DB volume unless you intentionally want to reset local data.

## Health check degraded

Check app logs and Postgres health first. Confirm `DATABASE_URL` host, port, database, and secret version; test connectivity from the task network. Check active connections, storage, and recent deploys. Restore service by rolling back the last image if a release caused the failure. Do not print connection strings into incident channels.

## Release and rollback (production workflow to be configured)

Build and scan an immutable image, deploy to a staging environment, run smoke checks, inspect error/latency dashboards, then use an approved production change. Keep the prior task definition/image available. Roll back by redeploying the last known-good digest. Database changes must follow expand/migrate/contract: deploy compatible schema first, backfill, then remove old fields in a later release.

## Incident checklist

1. Declare incident severity and incident lead; capture UTC timestamps.
2. Stabilize user impact and preserve relevant logs/metrics without collecting unnecessary personal data.
3. Communicate through the configured status channel; document decisions and owners.
4. Recover service, verify critical user journeys, and monitor for recurrence.
5. Complete a blameless review with timeline, contributing factors, actions, and due dates.

## Backup and restore

Set managed database backup retention and point-in-time recovery before launch. A backup is not verified until a restore to an isolated environment succeeds and application-level records are checked. Document credentials, retention, recovery owner, and measured RTO/RPO in the environment-specific runbook.
