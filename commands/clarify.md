---
description: Resolve ambiguities in a spec by asking the user one question at a time. Updates spec.md in place and appends decisions to clarifications.md. BLOCKS until user answers.
---

# Clarify Command (SDD)

This command audits a spec for ambiguity and walks the user through resolving every `[NEEDS CLARIFICATION]` marker — **one question at a time** — then updates the spec in place.

## Arguments

`$ARGUMENTS` — Feature slug (e.g. `realtime-notifications`). If omitted, list specs under `.specs/` and ask the user to pick.

## Pre-flight

1. **Load constitution** from `.specs/constitution.md`.
2. **Load spec** from `.specs/<slug>/spec.md`. Error out if not found.
3. **Scan for ambiguity**, in priority order:
   - All `[NEEDS CLARIFICATION: ...]` markers
   - Vague verbs ("handle", "support", "manage") without acceptance criteria
   - Quantifiers without numbers ("fast", "many", "scalable")
   - Untestable requirements
   - Conflicting requirements
   - Missing error/edge-case behavior on critical flows

## What This Command Does

For each open question found, **in order**:

1. **Present ONE question** with:
   - Quoted snippet from the spec for context
   - 2–4 concrete options labeled A/B/C/D plus an "Other" escape hatch
   - A recommended default with reasoning (when applicable)
2. **WAIT for user answer.** Do not batch questions. Do not proceed without an answer.
3. **Update the spec immediately**:
   - Replace `[NEEDS CLARIFICATION: ...]` with the resolved text
   - Add a row to `clarifications.md` (decision log)
4. **Re-scan** for any new ambiguities introduced by the answer.
5. Loop until no open questions remain (cap at 12 questions per session; if more, summarize remainder and stop).

## Required Output Format

### `.specs/<slug>/clarifications.md`

Create or append:

```markdown
# Clarifications: <Feature Name>

Decisions captured during `/one-sdd:clarify` sessions.

| # | Date | Question | Decision | Spec Section | Rationale |
|---|------|----------|----------|--------------|-----------|
| 1 | YYYY-MM-DD | <question> | <chosen answer> | FR-3 | <why> |
| 2 | ... | ... | ... | ... | ... |
```

### Updates to `spec.md`

- Replace every resolved `[NEEDS CLARIFICATION]` with the agreed text.
- Update **§9 Open Questions** to reflect what remains (or write "All resolved as of YYYY-MM-DD").
- Update **§10 Traceability** → `Clarifications: see clarifications.md (N decisions)`.
- Bump status from `draft` → `clarified` when zero open questions remain.

## Critical Rules

- **One question per turn.** Never dump a list.
- **Always offer options.** Free-form questions waste the user's time. Use A/B/C/D + Other.
- **Never invent decisions.** If the user says "you decide", ask them to confirm a specific default rather than silently choosing.
- **Edit the spec in place.** Do not keep clarifications only in chat history.
- **Stop and confirm** before bumping status to `clarified`.

## Example Turn

```
Question 3/7

Spec says (FR-2):
> The system MUST notify users when a market they follow resolves.

[NEEDS CLARIFICATION: which channels?]

Options:
  A) In-app only (simplest, no infra)
  B) In-app + email (covers most users) ← recommended
  C) In-app + email + webhook (full coverage, adds complexity)
  D) Other — please specify

Your choice?
```

## After Completion

1. Print summary: `N questions resolved, M remaining (if any).`
2. If all resolved → recommend `/one-sdd:design <slug>`.
3. If user paused mid-session → leave spec status as `draft`, save progress, recommend resuming with `/one-sdd:clarify <slug>`.

## Integration

- Reads: `.specs/constitution.md`, `.specs/<slug>/spec.md`
- Writes: `.specs/<slug>/spec.md`, `.specs/<slug>/clarifications.md`
- Next: `/one-sdd:design <slug>`
