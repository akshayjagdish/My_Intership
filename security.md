# Security and privacy baseline

## Current controls

- Security response headers and reduced framework fingerprinting are configured.
- Goal request input has server-side Zod validation and bounded string lengths.
- Goal API returns unauthorized until identity and user scoping exist.
- CI includes CodeQL and high-severity dependency auditing.
- Compose keeps Postgres off host-published ports and uses a persistent local volume.
- Terraform secret access is scoped to one Secrets Manager ARN; state files are ignored.

These controls do not constitute compliance certification. Do not claim SOC 2, ISO 27001, or regulatory compliance based on this repository.

## Required before production

1. Integrate a maintained OIDC provider; validate issuer, audience, state, nonce, expiry, and session rotation. Protect mutations against CSRF; use secure, HTTP-only, same-site cookies.
2. Add authorization checks at every handler and query. Derive the owner from the verified session, never the submitted body. Add cross-user access tests before enabling goal routes.
3. Establish data classification, retention/deletion, privacy notice, data export, incident contact, and jurisdictional review.
4. Use TLS, WAF/rate limiting, restrictive CORS, CSP with nonces or hashes, and managed secret rotation. Replace external font loading with self-hosted assets if strict CSP/privacy requires it.
5. Pin GitHub Actions to reviewed commit SHAs, enable branch protection and required reviews, secret scanning, Dependabot, artifact provenance, and image vulnerability scanning.
6. Configure encrypted Terraform remote state with locking, separate accounts/environments, least privilege, and reviewed plans. Never run apply on unreviewed pull requests.
7. Define backup encryption, retention, restore objectives, deletion semantics, audit event policy, and incident response.

## Threat review prompts

Review account takeover, IDOR, session theft, malicious links, stored/reflected XSS, CSRF, injection, SSRF, dependency compromise, secret leakage, noisy-neighbor denial of service, and backup exposure. Record risk owner, severity, mitigations, and residual risk in the release review.
