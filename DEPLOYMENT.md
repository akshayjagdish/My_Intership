# Deployment

## Local Container

```powershell
docker compose up --build
```

## CI/CD Pipeline

The GitHub Actions workflow runs:

1. Node test suite.
2. Static checks.
3. Smoke test.
4. Container build.

## Environment Variables

- `PORT`: service port.
- `ERP_JWT_SECRET`: signing or hashing secret.
- `ERP_DATA_FILE`: database file path.
- `ERP_AUDIT_FILE`: audit log path.
- `ERP_RATE_LIMIT_WINDOW_MS`: rate limit window.
- `ERP_RATE_LIMIT_MAX`: max requests per window.

## Production Release Flow

Build immutable images, scan them, push to a registry, deploy through a progressive strategy, run `/healthz` checks, and monitor `/metrics` plus application logs before promoting traffic.
