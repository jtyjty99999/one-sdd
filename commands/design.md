---
description: Produce the technical design (architecture, data model, APIs, integrations, risks) for a clarified spec. Writes .specs/<slug>/design.md. Delegates to the architect agent.
---

# Design Command (SDD)

This command turns a clarified spec into a **technical design** — the *how*. It is the bridge between requirements and task breakdown.

## Arguments

`$ARGUMENTS` — Feature slug. If omitted, list available specs and ask the user to pick.

## Pre-flight

1. **Load constitution** from `.specs/constitution.md` — all decisions MUST comply.
2. **Load spec** from `.specs/<slug>/spec.md`.
3. **Reject if not clarified**: if status is still `draft` and `[NEEDS CLARIFICATION]` markers remain, abort and recommend `/one-sdd:clarify <slug>` first.
4. **Load clarifications.md** if present — these are the authoritative decisions.

## Delegation

Invoke the **architect** agent to lead the design work. The architect must:

- Read the existing codebase (relevant directories, similar features, current architecture) before proposing anything.
- Reuse existing patterns where they exist. Surface any deviation explicitly under "Departures from current patterns".
- Justify every external dependency added.

## What This Command Does

1. **Map FRs/NFRs to components** — every requirement traces to a module.
2. **Define the architecture** — components, responsibilities, data flow diagram (mermaid).
3. **Define the data model** — entities, fields, relationships, indexes, migrations.
4. **Define the API contract** — endpoints/RPC, request/response schemas, error codes.
5. **Define integrations** — external services, message buses, auth, secrets.
6. **Identify constitution conflicts** — if anything in the design violates the constitution, stop and ask.
7. **Risk register** — High/Medium/Low, with mitigation per risk.
8. **Alternatives considered** — at least 2 alternatives for any non-trivial decision, with rejection reasoning.
9. **Testing strategy** — unit/integration/e2e split, what to mock, coverage target.
10. **Rollout plan** — feature flag? migration order? backfill? rollback?

## Required Output Format

Write `.specs/<slug>/design.md`:

```markdown
# Design: <Feature Name>

**Slug:** <slug>
**Status:** draft
**Spec version:** <commit SHA or date of spec.md>
**Constitution version:** vN

## 1. Overview
<2–3 sentence summary of the approach>

## 2. Architecture
<mermaid diagram>

### Components
- **<Component A>**: responsibility, owns what
- **<Component B>**: ...

## 3. Data Model
### Entities
- **<Entity>**: fields, types, constraints
### Relationships
### Migrations
- Migration 1: ...

## 4. API Contract
### `<METHOD> /path`
- Request: <schema>
- Response 200: <schema>
- Errors: 400/401/403/404/409/422/500

## 5. Integrations
- External: ...
- Internal: ...
- Secrets required: ... (env var names only, never values)

## 6. Requirement Traceability
| Requirement | Component(s) | Notes |
|-------------|--------------|-------|
| FR-1 | ComponentA, ComponentB | ... |
| NFR-1 | ComponentB | ... |

## 7. Alternatives Considered
- **Alternative 1**: <description> — rejected because <reason>
- **Alternative 2**: ...

## 8. Departures from Current Patterns
- ... (or "None")

## 9. Risks
| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| R-1 | ... | HIGH | ... |

## 10. Testing Strategy
- Unit: ...
- Integration: ...
- E2E: ...
- Coverage target: ...% (per constitution)

## 11. Rollout
- Feature flag: <name> | none
- Migration order: ...
- Rollback plan: ...

## 12. Open Design Questions
- ... (or "None")

## 13. Traceability
- Spec: spec.md
- Clarifications: clarifications.md (N decisions)
- Tasks: (pending — run `/one-sdd:tasks <slug>`)
```

## Critical Rules

- **No code in design.md** beyond schema definitions and mermaid diagrams. Code goes in implementation.
- **Every component must trace to ≥1 requirement.** Surface anything that doesn't.
- **Every dependency added needs justification.** No silent additions.
- **Stop and ask** if design surfaces a constitution conflict, an unanswered requirement, or a risk you can't mitigate.

## After Writing

1. Print: component count, API endpoint count, risk count (by severity).
2. Surface any open design questions for the user.
3. Recommend next step → `/one-sdd:tasks <slug>`.
4. **Do not start implementation.**

## Integration

- Reads: `.specs/constitution.md`, `.specs/<slug>/spec.md`, `.specs/<slug>/clarifications.md`
- Writes: `.specs/<slug>/design.md`
- Agent: `architect`
- Next: `/one-sdd:tasks <slug>`
