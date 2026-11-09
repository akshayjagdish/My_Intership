# Interview preparation

## System design walkthrough

Practice designing a multi-tenant goal and portfolio tracker. Clarify users and privacy needs, estimate read/write volume, sketch web/API/database boundaries, define ownership constraints, and explain consistency, pagination, indexing, backups, and deletion. Discuss how reminders move to a queue, how to prevent duplicate work, and how to avoid cross-user cache leaks. State what would change at 10× load and what evidence would justify it.

## Questions to rehearse

- Why PostgreSQL and a relational ownership model for goals?
- How would you prevent insecure direct object references?
- How do you migrate a live schema without downtime?
- What should readiness and liveness probes check?
- How would you investigate p95 latency rising while error rate stays flat?
- How should secrets reach a container without entering logs or images?
- What makes a useful SLO, and how should error budgets affect releases?
- What happens when two requests create the same reminder?

## STAR story prompts

Prepare truthful stories about a difficult tradeoff, a production-style failure simulation, security review, feedback that changed the design, and a task you drove from ambiguity to demo. Include the context, your specific actions, measurable outcome, and what you learned. Do not present planned work as completed work.

## Practice loop

Record a 10-minute architecture walkthrough, review clarity and assumptions, then repeat with a new constraint (strict privacy, 10× traffic, database outage). Keep a short answer bank with concrete examples from this codebase.
