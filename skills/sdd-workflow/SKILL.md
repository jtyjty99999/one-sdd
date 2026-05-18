---
name: sdd-workflow
description: Spec Driven Development methodology for this project. Use when discussing requirements, designing features, planning implementation, or whenever the user describes a new feature or non-trivial change. Encodes the pipeline (specify → clarify → design → tasks → implement → verify), the .specs/ artifact contract, and the constitution-as-hard-constraint rule.
origin: one-sdd
---

# Spec Driven Development Workflow

This skill is the **methodology body** behind the `/one-sdd:*` command family. Activate it whenever a conversation involves new features, requirement discussions, or non-trivial changes — even if the user does not explicitly invoke a slash command. The goal is to make SDD the project's default operating model, not a thing users have to remember to trigger.

## When to Activate

- The user describes a feature, change, or bug in non-trivial scope
- The user asks "how should I build / design / structure X"
- The user wants requirements clarified, planned, or broken into tasks
- The user references `.specs/`, "spec", "design doc", "requirements", "task list"
- The user invokes any `/one-sdd:*` command
- Another agent (architect, planner, tdd-guide, code-reviewer) is operating on SDD artifacts

## Core Principles

### 1. Spec is the contract
The `.specs/<slug>/` artifacts are the source of truth. Code conforms to them, not the other way around. If reality and spec disagree, fix the spec first (via the right command), then realign code.

### 2. Constitution is non-negotiable
Every SDD-managed change MUST first load `.specs/constitution.md` and treat it as hard constraints. Quality bars, forbidden patterns, and tech stack locks are gates, not suggestions.

### 3. Strict phase order
```
specify → clarify → design → tasks → implement → verify
```
No phase may be skipped. A later phase MUST refuse to run if the earlier one is incomplete. State is tracked by the `status` field in `spec.md` and the artifacts present in `.specs/<slug>/`.

### 4. Ambiguity is surfaced, never invented
When unsure, write `[NEEDS CLARIFICATION: <question>]` inline. Never guess what the user meant. Resolution happens in the clarify phase, one question at a time, with options offered.

### 5. Traceability is mandatory
Every functional/non-functional requirement traces to ≥1 task. Every task traces back to ≥1 requirement. Every clarification decision is logged with rationale. Every verify pass cites evidence. No orphan work.

### 6. One question at a time
Whenever the workflow needs user input — clarification, decision between options, confirmation — ask **one** question with concrete options (A/B/C/D + Other), recommend a default with reasoning, and wait. Never batch questions.

## The Six Phases

### Phase 1 — Specify
- **Command:** `/one-sdd:specify <feature description>`
- **Produces:** `.specs/<slug>/spec.md`
- **Contains:** summary, problem & motivation, personas, user stories, FRs, NFRs, out-of-scope, success criteria, open questions, traceability footer
- **Forbidden:** any implementation detail (frameworks, file paths, schemas)
- **Exit criteria:** spec.md exists with status `draft`; every unresolved point is marked `[NEEDS CLARIFICATION]`

### Phase 2 — Clarify
- **Command:** `/one-sdd:clarify <slug>`
- **Produces:** `.specs/<slug>/clarifications.md`; updates `spec.md` in place
- **Behavior:** scans for ambiguity (markers, vague verbs, missing quantifiers, conflicts), asks **one** option-list question per turn, blocks until answered, edits the spec immediately
- **Exit criteria:** zero `[NEEDS CLARIFICATION]` markers remain; spec.md status bumped to `clarified`

### Phase 3 — Design
- **Command:** `/one-sdd:design <slug>`
- **Produces:** `.specs/<slug>/design.md`
- **Delegates to:** `architect` agent
- **Contains:** architecture (mermaid), data model, API contract, integrations, traceability matrix, alternatives considered, departures from current patterns, risk register, testing strategy, rollout plan
- **Forbidden:** implementation code beyond schema/diagrams
- **Exit criteria:** every requirement maps to ≥1 component; every component justified; every dependency justified

### Phase 4 — Tasks
- **Command:** `/one-sdd:tasks <slug>`
- **Produces:** `.specs/<slug>/tasks.md`
- **Contains:** phased task list (P0 scaffolding → P4 observability), each task ≤4h with explicit files, traceability, acceptance criteria; dependency mermaid graph; traceability coverage matrix
- **TDD enforcement:** every code task must be preceded by its failing-test task in the same phase
- **Exit criteria:** 100% traceability coverage; no task larger than L; status `ready`

### Phase 5 — Implement
- **Command:** `/one-sdd:implement <slug> [--from T-NNN]`
- **Produces:** production code + status updates in `tasks.md`
- **Delegates to:** `tdd-guide`, `code-reviewer`, `security-reviewer` (when sensitive), `build-error-resolver` (on failure)
- **Behavior:** one task at a time, RED → GREEN → REFACTOR per code task, per-task code review, conventional commits `<type>(<slug>): T-NNN <title>`, pause every 3 tasks for user confirmation
- **Stop conditions:** acceptance fails twice; design gap discovered; constitution conflict; scope expansion needed
- **Exit criteria:** all tasks `[x]`; coverage meets constitution target; no outstanding CRITICAL/HIGH review issues

### Phase 6 — Verify
- **Command:** `/one-sdd:verify <slug>`
- **Produces:** pass/fail report; bumps spec.md status to `verified` on PASS
- **Five dimensions:**
  1. Spec  Code Traceability
  2. Clarifications Honored
  3. Design  Implementation
  4. Constitution Compliance
  5. Task Acceptance Replay
- **Rules:** read-only on code; evidence-based (cite file/line/command/commit); never patches spec to match code

## Artifact Layout

```
.specs/
├── README.md                    # contributor-facing explanation
├── constitution.md              # project-wide rules (versioned)
└── <feature-slug>/
    ├── spec.md                  # what & why
    ├── clarifications.md        # decision log
    ├── design.md                # how
    └── tasks.md                 # execution checklist
```

## Status State Machine

```
(none)
  │ /one-sdd:specify
  ▼
draft ──────────────┐
  │ /one-sdd:clarify│
  ▼                 │ (open questions remain → loop)
clarified           │
  │ /one-sdd:design │
  ▼                 │
design-ready        │
  │ /one-sdd:tasks  │
  ▼                 │
ready               │
  │ /one-sdd:implement
  ▼                 │
in-progress         │
  │ all tasks [x]   │
  ▼                 │
implemented         │
  │ /one-sdd:verify │
  ▼                 │
verified ◄──────────┘
```

A command MUST refuse to run if the previous phase is incomplete. The refusal message names the missing prerequisite and the command to run.

## Mapping to `/one-sdd:*` Commands

| Phase / Action | Command | Output |
|---|---|---|
| Bootstrap project | `/one-sdd:init` | `.specs/README.md`, `.specs/constitution.md` |
| Edit project rules | `/one-sdd:constitution` | `.specs/constitution.md` (new version) |
| Capture requirements | `/one-sdd:specify` | `.specs/<slug>/spec.md` |
| Resolve ambiguity | `/one-sdd:clarify` | `.specs/<slug>/clarifications.md` |
| Technical design | `/one-sdd:design` | `.specs/<slug>/design.md` |
| Task breakdown | `/one-sdd:tasks` | `.specs/<slug>/tasks.md` |
| Build it | `/one-sdd:implement` | code + `tasks.md` updates |
| Audit it | `/one-sdd:verify` | pass/fail report |
| Pipeline view | `/one-sdd:status` | read-only dashboard |
| Generic quality gate | `/one-sdd:quality-check` | build/lint/types/tests verdict |

## How Other Agents Should Use This Skill

When an agent (architect, tdd-guide, code-reviewer, security-reviewer, planner) is invoked **inside** an SDD command:

1. **Load** `.specs/constitution.md` and the current `.specs/<slug>/` artifacts before doing anything else.
2. **Honor the phase boundary**: e.g. `architect` invoked from `/one-sdd:design` may not modify `spec.md`; `tdd-guide` invoked from `/one-sdd:implement` may not modify `design.md`.
3. **Cite artifacts** in output (e.g. "implementing FR-3 per spec §5, decision #2 in clarifications.md").
4. **Stop and escalate** when constitution conflict, missing decision, or spec gap is found, instead of silently working around it.

## Anti-patterns (Do Not Do)

- FAIL: Skip `/one-sdd:specify` because "the user already explained it in chat" — write it down or it doesn't exist
- FAIL: Batch clarification questions to "save time"
- FAIL: Edit `spec.md` during implementation to make it match what was actually built
- FAIL: Mark a task `[x]` without running its acceptance check
- FAIL: Add a dependency or library not justified in `design.md §5`
- FAIL: Run `/one-sdd:verify` and patch the spec to make it pass
- FAIL: Treat the constitution as advisory

## Composability with Other Skills

- **`tdd-workflow`** — pairs with Phase 5; `implement` should delegate code tasks through tdd-workflow's RED/GREEN/REFACTOR discipline
- **`verification-loop`** — backs `/one-sdd:quality-check`; SDD verify is stricter and additive, not a replacement
- **`coding-standards`** — should be referenced by the constitution as a baseline (then constitution adds project-specific overrides)
- **`security-review`** — invoked by `/one-sdd:implement` for security-sensitive tasks before marking `[x]`
- **`compound-engineering`** — after `/one-sdd:verify` (or any shipped change), run `/compound` to **persist** lessons (docs under `docs/solutions/`, regression tests, rules, prompt updates) so the next planning cycle starts smarter; see `skills/compound-engineering/SKILL.md`

## Quick Reference: Decision Tree

```
User describes a feature → run /one-sdd:specify
Spec has [NEEDS CLARIFICATION] markers → run /one-sdd:clarify
Spec is clarified, no design yet → run /one-sdd:design
Design exists, no tasks yet → run /one-sdd:tasks
Tasks ready, code not built → run /one-sdd:implement
All tasks done → run /one-sdd:verify
Verify passed → optionally run /compound (knowledge compounding; see compound-engineering skill)
Don't know where I am → run /one-sdd:status
Empty project → run /one-sdd:init first
```

## Source of Truth

Each `/one-sdd:*` command file is the operational checklist for its phase. This skill is the **methodology**. If they ever drift, this skill wins on principles; the commands win on procedural detail. Keep them aligned via PR review when either changes.
