---
name: compound-engineering
description: "Compound engineering — after Plan, Work, and Review, capture lessons as durable team assets so each unit of work makes the next easier. Use when closing a feature, after incidents, PR feedback, or when turning mistakes into guardrails (docs, tests, lint, prompts)."
origin: one-sdd
---

# Compound Engineering

**Goal:** Each increment of engineering work should make **subsequent** work easier, not harder — a compounding ("interest on knowledge") effect instead of accumulating tech debt.

## When to Activate

- After `/one-sdd:verify` or equivalent quality gate — **before** you consider the work "done"
- When someone says "add this to `CLAUDE.md` so we don't repeat the mistake"
- When a PR comment should become a **test**, **lint rule**, or **doc pattern**
- When onboarding asks "where do we record how we solved X?" — point them at the Compound step
- When retrospectives need a **repeatable** capture step, not tribal memory

## The Core Loop

```
Plan ──► Work ──► Review ──► Compound
  ▲                           │
  └───────────────────────────┘
        knowledge compounds
```

| Phase | Purpose |
|-------|---------|
| **Plan** | Structured intent (SDD: specify/design/tasks; or `/plan`) |
| **Work** | Execute with TDD / quality built in |
| **Review** | Multi-lens review (security, perf, architecture) — `/code-review`, agents |
| **Compound** | **Persist** what changed: patterns, pitfalls, checks — so the **next** plan starts smarter |

Compound is **not** optional documentation polish. It is the step that turns **situational fixes** into **system immunity** (tests, rules, indexed docs).

## What "Compound" Produces

Ship **at least one** durable artifact when practical (choose what matches the lesson):

1. **Indexed solution note** — e.g. `docs/solutions/<topic>/<short-slug>.md`  
   - Problem one-liner, context, decision, links to code/tests, "if you see this symptom…"
2. **Regression test** — lock in the fix; reference the PR or issue
3. **Lint / policy** — if the class of mistake is mechanical, encode it (eslint, hooks, CI check)
4. **Project memory** — update `CLAUDE.md`, `AGENTS.md`, or a skill under `.claude/skills` / `skills/` when the lesson is harness-wide
5. **Prompt / command tweak** — if the gap was procedural, update the relevant slash command or agent hints so the **next** run gets a reminder

## Relationship to SDD (One SDD)

- **SDD** answers *what we build* and *how we verify it* (spec → tasks → implement → verify).
- **Compound** answers *what the team **learns*** and where it **lives** so the next feature starts from a higher baseline.
- Run Compound **after** verification passes, or in parallel with final PR notes — never as a substitute for tests or review.

Suggested handoff line for agents:

> Verification is green. Now run the **Compound** step: document the pitfalls, add a regression test or rule if applicable, and link from `docs/solutions/` or project roots.

## Delegation Hints

- **doc-updater** — structure new solution docs, cross-links, README/AGENTS updates  
- **planner** — if compounding reveals follow-up work, spawn a small plan  
- **code-reviewer** / **security-reviewer** — convert CRITICAL/HIGH themes into tests or rules  
- **tdd-guide** — add failing-then-passing test that encodes the bug class

## Anti-Patterns

- "We'll remember" — without a file, the model and humans forget at scale  
- Dumping wall-of-text in chat with no repo path — not compoundable  
- Duplicating the same paragraph in five files — one canonical note + links

## Success Criteria

After Compound, a new teammate (or a fresh model context) can:

1. Find the lesson via search under `docs/solutions/` or project docs  
2. See how we **prevent regression** (test or check)  
3. Start the **next** Plan phase with less exploration waste
