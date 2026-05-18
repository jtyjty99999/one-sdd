---
description: Legacy slash-entry shim for the verification-loop skill. Runs generic build/lint/types/tests/security checks. For SDD spec-vs-code verification, use /one-sdd:verify instead.
---

# Quality Check Command (Legacy Shim)

Use this for generic build/lint/types/tests verification on arbitrary code. The maintained workflow lives in `skills/verification-loop/SKILL.md`.

> **Looking for SDD verification?** Use `/one-sdd:verify <slug>` — it audits whether shipped code matches its `.specs/<slug>/` artifacts.

## Canonical Surface

- Prefer the `verification-loop` skill directly.
- Keep this file only as a compatibility entry point.

## Arguments

`$ARGUMENTS`

## Delegation

Apply the `verification-loop` skill.
- Choose the right verification depth for the user's requested mode.
- Run build, types, lint, tests, security/log checks, and diff review in the right order for the current repo.
- Report only the verdicts and blockers instead of maintaining a second verification checklist here.
