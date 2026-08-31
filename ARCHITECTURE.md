# Architecture

## Goals

The ERP is organized as a modular monolith. That keeps local development simple while preserving boundaries that can later be extracted into services.

## Modules

- `src/modules/hr.js`: employee lifecycle and workforce data.
- `src/modules/inventory.js`: stock, reorder alerts, and valuation inputs.
- `src/modules/accounting.js`: ledger entries and trial balance.
- `src/modules/sales.js`: sales orders and pipeline.
- `src/modules/reporting.js`: cross-module analytics with cache-backed summaries.

## Shared Platform

- `core/router`: endpoint registration, path parameters, request dispatch.
- `core/security`: bearer authentication, RBAC permissions, rate limiting.
- `core/audit`: append-only JSON audit events.
- `core/database`: file-backed persistence with transaction rollback and in-memory indexes.
- `core/cache`: TTL cache for reporting and read-heavy workloads.
- `core/metrics`: Prometheus-style counters and request latency gauge.
- `core/logger`: structured JSON logs.

## Production Evolution

Replace the file-backed database with PostgreSQL while keeping the repository-facing database methods stable. Add background workers for asynchronous workflows such as invoice generation, payroll exports, and reorder automation. Split modules only when independent deployment, scaling, or data ownership justifies the operational cost.
