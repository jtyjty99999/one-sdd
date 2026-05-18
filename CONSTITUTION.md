# One SDD — Constitution

## Core Principles

### I. Agent-First
Delegate domain work to specialized agents (planner, tdd-guide, code-reviewer, security-reviewer, etc.) instead of monolithic improvisation. Prefer parallel agents for independent tasks.

### II. Test-Driven Development
Write tests before implementation. Target 80%+ coverage with unit, integration, and E2E tests where applicable. Red → green → refactor; do not weaken tests to make code pass without justification.

### III. Security-First
No hardcoded secrets. Validate inputs at boundaries. Use parameterized queries, sanitize output, enforce auth where required. Stop and rotate secrets if exposure is suspected.

### IV. Immutability
Prefer new objects over mutating existing state in application code. Keep functions small and files focused.

### V. Plan Before Execute
Use planning and specification workflows for non-trivial work before large implementation diffs.

## Governance

- Amendments require review via pull request and semver on this document.
- Feature specifications use `/speckit.*` skills; **this file is the authoritative team constitution**.
- Do not treat `.specify/memory/constitution.md` as the source of truth when root `CONSTITUTION.md` exists.

**Version**: 1.0.0 | **Ratified**: 2026-05-17 | **Last Amended**: 2026-05-17
