# Enterprise ERP

A production-oriented ERP starter with five business modules:

- HR management
- Inventory control
- Accounting
- Sales
- Reporting and analytics

The implementation is intentionally dependency-light and runs on the Node.js standard library. It demonstrates enterprise patterns without requiring package installation: modular services, repositories, RBAC, audit logging, request correlation, validation, caching, metrics, database indexes, CI/CD, Docker, and deployment documentation.

## Quick Start

```powershell
npm test
npm run seed
npm start
```

Open `http://localhost:3000` for the dashboard.

Use this demo bearer token:

```text
Bearer demo-admin-token
```

## API Examples

```powershell
Invoke-RestMethod http://localhost:3000/api/hr/employees -Headers @{ Authorization = "Bearer demo-admin-token" }
Invoke-RestMethod http://localhost:3000/api/reporting/executive-summary -Headers @{ Authorization = "Bearer demo-admin-token" }
Invoke-RestMethod http://localhost:3000/metrics
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the module map, request flow, persistence model, and production extension points.

## Operations

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md), [docs/SECURITY.md](docs/SECURITY.md), and [docs/RUNBOOK.md](docs/RUNBOOK.md).
