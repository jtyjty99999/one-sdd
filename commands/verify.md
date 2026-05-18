---
description: End-to-end verification that a feature's implementation actually matches its spec, clarifications, design, and tasks. Produces a pass/fail report with evidence per requirement.
---

# Verify Command (SDD)

This command audits a feature **after** implementation to prove that the shipped code matches what was specified, designed, and tasked. It is the closing gate of the SDD pipeline.

> **Note:** This is the SDD pipeline verifier. For generic build/lint/types/tests verification of arbitrary code, use `/one-sdd:quality-check` (the verification-loop shim).

## Arguments

`$ARGUMENTS` — Feature slug (required).

Optional flags:
- `--strict` — fail on any WARN (default: only fail on FAIL)
- `--quick` — skip running the test suite; rely on the last recorded results

## Pre-flight

1. **Load constitution** from `.specs/constitution.md`.
2. **Load all artifacts** for the feature: `spec.md`, `clarifications.md`, `design.md`, `tasks.md`.
3. **Refuse to run** if `tasks.md` has any `[ ]`, `[~]`, or `[!]` task — verification only runs on completed features. Show the user what's still pending.

## What This Command Does

Run five verification dimensions, each independently pass/warn/fail:

### 1. Spec  Code Traceability
- For every `FR-*` and `NFR-*` in `spec.md`, confirm at least one task in `tasks.md` covers it (per the traceability matrix).
- For every covered task, confirm the listed files in `tasks.md` actually exist in the repo.
- Confirm test files referenced in test tasks exist and the corresponding tests pass.

### 2. Clarifications Honored
- Walk every decision in `clarifications.md`.
- For each, locate the implementation evidence (file/symbol/test) and verify the decision was applied.
- Flag any decision with no traceable evidence.

### 3. Design  Implementation
- For every component in `design.md §2`, confirm a corresponding module/file exists.
- For every API endpoint in `design.md §4`, confirm the handler exists and matches the documented request/response shape (introspect schemas where possible).
- For every migration in `design.md §3`, confirm the migration file exists and was applied.
- For every dependency added in `design.md §5`, confirm it appears in the package manifest.

### 4. Constitution Compliance
- **Tech stack lock** — no disallowed languages/frameworks introduced.
- **Forbidden patterns** — grep the diff for each pattern in `constitution.md §Forbidden Patterns`.
- **Quality bars**:
  - Run tests, parse coverage, compare to constitution target.
  - Run linter, parse warning count vs threshold.
  - Run type checker (if applicable).
- **Definition of Done** — walk the checklist; mark each item ✓/✗ with evidence.

### 5. Task Acceptance Replay
- For every task in `tasks.md`, re-run its "Acceptance" command/test.
- Confirm the same outcome documented at commit time.
- Flag any task whose acceptance check now fails (regression).

## Required Output Format

```
SDD Verify: <slug>
===================
Constitution: v3                Spec status: clarified
Tasks done:   24/24             Run mode: full (--strict off)

1. Spec  Code Traceability ........... ✓ PASS
   8 FR covered, 3 NFR covered, 0 orphan tasks
   All referenced files exist

2. Clarifications Honored ............. WARNING: WARN
   5 decisions checked, 4 with evidence, 1 unverifiable
   - Decision #3 (rate limit at 100 req/min): no test or assertion found

3. Design  Implementation ............ ✓ PASS
   6/6 components present
   4/4 endpoints match documented schemas
   1/1 migrations applied
   2 new dependencies, both justified in design §5

4. Constitution Compliance ............ ✗ FAIL
   ✓ Tech stack lock
   ✗ Forbidden pattern "console.log" found in 2 files:
       - lib/notifications/email.ts:42
       - lib/notifications/webhook.ts:17
   ✓ Coverage 88% (target 80%)
   ✓ Lint 0 warnings
   ✓ Type check passed
   ✗ Definition of Done: docs not updated for T-019, T-020

5. Task Acceptance Replay ............. ✓ PASS
   24/24 acceptance checks re-ran successfully

----
Verdict: ✗ FAIL (1 FAIL, 1 WARN)

Blocking issues:
  1. Remove console.log calls (constitution §Forbidden Patterns)
  2. Update docs for T-019, T-020 (DoD requirement)

Non-blocking issues:
  1. Add a test asserting the 100 req/min rate limit (clarifications #3)

Recommended next:
  → Fix the 2 blocking issues, then re-run /one-sdd:verify <slug>
```

## Critical Rules

- **Evidence-based, not vibes-based.** Every PASS/WARN/FAIL must cite a file, line, command output, or commit. No "looks fine to me".
- **Never modify code.** This command only reads and reports. If issues are found, the user (or another command) fixes them.
- **Never modify spec/design/tasks** to make them match the implementation. The artifacts are the contract; code must conform to them, not the other way around.
- **Exit non-zero on FAIL** so this can be wired into CI.
- **Be specific.** "Coverage too low" is useless. "Coverage 72% (target 80%); biggest gaps: lib/notifications/queue.ts 41%, lib/notifications/retry.ts 58%" is actionable.

## Status Bump on Pass

When verdict is PASS (no FAIL, and either no WARN or `--strict` off), append to `spec.md` §10 Traceability:

```
- Verified: YYYY-MM-DD (commit <sha>)
```

And bump spec status from `clarified` → `verified`. (User still needs to merge / ship; that's outside SDD scope.)

## Integration

- Reads: `.specs/constitution.md`, `.specs/<slug>/{spec,clarifications,design,tasks}.md`, the codebase, test/coverage tooling
- Writes: `.specs/<slug>/spec.md` (status bump on PASS only)
- Pairs with: `/one-sdd:status` (check before running), CI pipelines (wire into PR gate)