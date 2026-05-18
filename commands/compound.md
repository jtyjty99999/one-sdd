---
description: After Plan, Work, and Review — capture lessons as durable assets (docs, tests, rules, prompts) so the next cycle is easier. Compound engineering loop closure.
---

# Compound Command

Invoke the **compound-engineering** skill and delegate documentation or small follow-ups to **doc-updater** when files must change.

## What This Command Does

1. **Close the loop** — Plan → Work → Review → **Compound** (see skill `skills/compound-engineering/SKILL.md`).
2. **Choose outputs** — at least one: solution note under `docs/solutions/`, regression test, lint/CI guard, or update to `CLAUDE.md` / `AGENTS.md` / project skills.
3. **Trace** — link artifacts to the PR, issue, or spec slug so the next search finds them.

## When to Use

Run `/compound`:

- After a feature or fix is verified and you want **knowledge to compound** instead of living in chat only
- When a reviewer says "never again" — encode **why** and **how we catch it next time**
- After an incident or deep bug hunt — **minutes of doc** can save **hours** of rediscovery

## How It Works

The agent should:

1. Summarize **what was learned** (pitfalls, constraints, non-obvious APIs).
2. Pick **durable homes** (canonical path first; avoid five copies of the same paragraph).
3. Add **regression protection** when the failure class is repeatable (test or automated check).
4. Prefer **one canonical** note plus links; avoid scattering the same text across many files.

## Example

```
User: /compound We fixed N+1 queries in brief generation in PR 42; add a short solution doc and a test.

Agent:
- Create docs/solutions/performance/n-plus-one-briefs.md (symptoms, fix, link to tests)
- Add or extend a test file that would have failed before the fix
- Optional one-line in AGENTS.md under performance notes with link to the doc
```

## Related

- Skill: `skills/compound-engineering/SKILL.md`
- SDD phases: `/specify`, `/one-sdd:verify` — compound runs **after** quality is proven
- Agents: `doc-updater`, `planner`, `code-reviewer`, `tdd-guide` as needed
