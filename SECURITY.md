# Security And Compliance

## Controls Implemented

- Bearer token authentication for protected module APIs.
- Role based access control with wildcard permission support.
- Per-principal and remote-address rate limiting.
- Audit logging for privileged writes and authorization denials.
- Security headers for JSON and static responses.
- Input validation for required fields and numeric values.
- Environment based secrets through `.env.example` and container variables.

## Production Hardening Checklist

- Replace demo tokens with OIDC or SAML SSO.
- Store secrets in a managed vault.
- Enforce TLS at the edge and private networking for internal services.
- Encrypt database volumes and backups.
- Add immutable audit storage with retention policies.
- Map module data to SOC 2, ISO 27001, GDPR, and local payroll/accounting retention rules.
- Add SAST, dependency scanning, and container image scanning to CI.
- Run least-privilege service accounts in every environment.
