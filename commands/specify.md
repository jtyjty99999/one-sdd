---
description: Turn a feature idea into a structured spec (What & Why, not How). Generates .specs/<slug>/spec.md following the Spec Kit format. WAIT for user review before downstream commands.
---

# Specify Command (SDD)

This command converts a raw feature idea into a **structured specification** — focused on *what* and *why*, deliberately avoiding implementation details.

## Arguments

`$ARGUMENTS` — Required. Free-text describing the feature.

Example: `/one-sdd:specify add real-time notifications when markets resolve`

## Pre-flight

1. **Load constitution**: Read `.specs/constitution.md` if it exists and treat its rules as hard constraints. If missing, warn the user and offer to run `/one-sdd:constitution` first.
2. **Pick a feature slug**: kebab-case, 2–5 words, derived from `$ARGUMENTS`. Confirm with user if ambiguous.
3. **Create directory**: `.specs/<slug>/`.

## What This Command Does

1. **Restate the user's request** in your own words for verification.
2. **Identify the user(s)** — who benefits and how.
3. **Define user stories** — `As a <role>, I want <action>, so that <benefit>`.
4. **List functional requirements** — numbered, testable, unambiguous (use MUST/SHOULD/MAY).
5. **List non-functional requirements** — performance, security, accessibility, observability.
6. **Define explicit out-of-scope** — what we are deliberately *not* doing.
7. **Define success criteria** — measurable acceptance signals.
8. **Mark unknowns** — anywhere you'd be guessing, write `[NEEDS CLARIFICATION: <question>]` inline. Do NOT invent answers.

## Critical Rules

- **NO implementation details.** No frameworks, no APIs, no database schemas, no file paths. Those belong in `/one-sdd:design`.
- **NO inventing requirements.** If unclear, mark `[NEEDS CLARIFICATION]` — `/one-sdd:clarify` will resolve these.
- **Every requirement must be testable.** If you can't write a test for it, rewrite it.
- **No code blocks** in the spec except for example user-visible payloads (e.g. example JSON the user will see).

## Required Output Format

Write `.specs/<slug>/spec.md`:

```markdown
# Spec: <Feature Name>

**Slug:** <slug>
**Status:** draft
**Created:** YYYY-MM-DD
**Author:** <from git config or "unknown">

## 1. Summary
<2–3 sentence restatement of the request>

## 2. Problem & Motivation
<Why this matters. Who is hurting today. What changes when shipped.>

## 3. Users & Personas
- **<Persona name>**: <description, goals>

## 4. User Stories
- US-1: As a <role>, I want <action>, so that <benefit>.
- US-2: ...

## 5. Functional Requirements
- FR-1: The system MUST ...
- FR-2: The system SHOULD ...
- FR-3: [NEEDS CLARIFICATION: <question>]

## 6. Non-Functional Requirements
- NFR-1 (Performance): ...
- NFR-2 (Security): ...
- NFR-3 (Accessibility): ...

## 7. Out of Scope
- ...

## 8. Success Criteria
- SC-1: <measurable signal, e.g. "95% of notifications delivered within 30s">
- SC-2: ...

## 9. Open Questions
<auto-aggregated list of every [NEEDS CLARIFICATION] in this doc>

## 10. Traceability
- Constitution version: vN
- Clarifications: (pending — run `/one-sdd:clarify <slug>`)
- Design: (pending)
- Tasks: (pending)
```

## After Writing

1. **Print summary**: feature slug, count of FRs / NFRs / open questions.
2. **Recommend next step**:
   - If open questions exist → `/one-sdd:clarify <slug>`
   - Else → `/one-sdd:design <slug>`
3. **DO NOT** proceed to design or implementation. Stop here.

## Integration

- Reads: `.specs/constitution.md`
- Writes: `.specs/<slug>/spec.md`
- Next: `/one-sdd:clarify <slug>` or `/one-sdd:design <slug>`
