# Launchpad — Career OS

Launchpad is a portfolio-grade career launch workspace: a six-month roadmap, skill progression, project milestones, and career preparation in one product. The repository includes a responsive Next.js interface, a PostgreSQL/Prisma data foundation, API health endpoint, containerized local stack, CI/security workflows, and an AWS ECS infrastructure starting point.

## Run locally

Requirements: Node.js 22+, npm, and Docker Desktop (for PostgreSQL).

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Open `http://localhost:3000`. The Compose database is initialized automatically. The health endpoint is `http://localhost:3000/api/health`.

For local Next.js development, start Postgres with `docker compose up -d db`, run `npm install`, `npx prisma generate`, `npx prisma migrate dev --name init`, then `npm run dev`.

## Product and architecture

See [docs/architecture.md](docs/architecture.md) for system boundaries, data flows, and scale plan. [docs/roadmap.md](docs/roadmap.md) holds the six-month delivery plan. Operational practices are in [docs/security.md](docs/security.md), [docs/runbook.md](docs/runbook.md), and [docs/observability.md](docs/observability.md).

## Important implementation boundary

The dashboard is currently a polished prototype with representative progress data. Prisma models and health infrastructure are real. Goal reads and writes deliberately return `401` until a trusted authentication/session provider is integrated and every query is scoped to the authenticated user. Do not expose user data or deploy as a multi-user product before auth, authorization, CSRF/session policy, migrations, backups, and the production infrastructure review are complete. The Terraform directory is a reviewed starting point, not an apply-ready full cloud environment.

## Delivery

Pull requests run type checking, production build, container build, CodeQL, and dependency audit. Deployment is intentionally not automatic until cloud identity federation, environment secrets, ECR, reviewed infrastructure, and production approval controls are configured.

## Career package

See [docs/portfolio.md](docs/portfolio.md), [docs/interview-prep.md](docs/interview-prep.md), and [docs/networking.md](docs/networking.md) for evidence-based portfolio and career launch materials. Replace all sample language and metrics with work you can demonstrate.
