---
description: Show the SDD pipeline status for one feature (or all features). Reports current phase, progress percentage, blockers, and recommended next command.
---

# Status Command (SDD)

This command gives a fast, scannable view of where each SDD feature is in the pipeline. Use it to triage work, find blockers, and decide what to do next.

## Arguments

`$ARGUMENTS` — Optional feature slug.
- **Omitted** → list all features under `.specs/` with one-line status each.
- **Specified** → deep dive on a single feature.

## What This Command Does

### Mode 1: List All Features (no slug)

1. Scan `.specs/*/` directories (skip `.specs/constitution.md`).
2. For each feature, read `spec.md`, `clarifications.md` (if exists), `design.md` (if exists), `tasks.md` (if exists).
3. Determine current phase from artifacts present + status fields.
4. Render a single table.

**Output:**

```
SDD Pipeline Status — N features

| Slug                    | Phase       | Progress   | Open Qs | Blockers | Next                            |
|-------------------------|-------------|------------|---------|----------|---------------------------------|
| realtime-notifications  | implement   | 14/24 (58%)| 0       | 0        | /one-sdd:implement realtime-... |
| user-login              | clarify     | —          | 3       | 0        | /one-sdd:clarify user-login     |
| billing-refactor        | design      | —          | 0       | 1 R-HIGH | review design §9                |
| onboarding-revamp       | spec        | —          | 7       | 0        | /one-sdd:clarify onboarding-... |

Constitution: v3 (last updated 2025-05-12)
```

### Mode 2: Single Feature Deep Dive (with slug)

Render this report:

```
Feature: realtime-notifications
================================

Spec        ✓ clarified   (8 FR, 3 NFR, 0 open questions)
Clarify     ✓ 5 decisions logged
Design      ✓ ready       (6 components, 4 endpoints, 2 risks: 0 HIGH 2 MED)
Tasks       ✓ ready       (24 tasks: 6 S, 14 M, 4 L)
Implement   ~ in progress (14/24 done, 1 in-progress, 1 blocked)

Progress
  P0 Scaffolding         [████████] 4/4   ✓
  P1 Core Domain (TDD)   [██████░░] 6/8
  P2 API                 [████░░░░] 3/6
  P3 UI                  [░░░░░░░░] 0/4
  P4 Observability       [█░░░░░░░] 1/2

Active
  ~ T-018  Wire enqueue into market resolution hook  (in progress)

Blocked
  ! T-022  Email channel adapter — blocked on SendGrid credentials (per clarifications #4)

Constitution compliance
  ✓ Coverage target 80% — current 88%
  ✓ Forbidden patterns — none detected in last review
  WARNING: Definition of Done — docs not yet updated for shipped tasks

Last activity
  - 2h ago: T-017 done (commit abc1234)
  - 5h ago: T-016 done
  - 1d ago: design.md updated (revision 2)

Recommended next:
  → /one-sdd:implement realtime-notifications        (resume T-018)
  → Resolve blocker on T-022 before P2 completes
```

## How to Detect Phase

Determine the current phase using this priority (later phases override earlier ones):

| Condition | Phase |
|-----------|-------|
| `spec.md` missing | `none` |
| `spec.md` exists, status=`draft`, open questions present | `clarify` |
| `spec.md` status=`clarified`, no `design.md` | `design` |
| `design.md` exists, no `tasks.md` | `tasks` |
| `tasks.md` status=`ready`, ≥1 `[~]` or partial `[x]` | `implement` |
| All tasks `[x]` | `done` |

## How to Detect Blockers

- Tasks marked `[!]` in `tasks.md`
- Risks marked `HIGH` in `design.md §9` with no mitigation owner
- Open questions in spec that survived a `/one-sdd:clarify` pass
- Constitution conflicts noted in design §8

## Critical Rules

- **Read-only command.** Never modify any file in `.specs/`.
- **Be honest about progress.** Use `[ ]/[~]/[x]/[!]` counts directly from `tasks.md`. Do not estimate.
- **Surface staleness.** If `spec.md` was edited *after* `design.md` was written, warn that design may be out of date.
- **Always recommend exactly one next command.** Reduce decision load.

## Integration

- Reads: `.specs/constitution.md`, `.specs/*/spec.md`, `.specs/*/clarifications.md`, `.specs/*/design.md`, `.specs/*/tasks.md`
- Writes: nothing
- Pairs well with: `/one-sdd:verify` to confirm a feature is actually done.
