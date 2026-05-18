---
description: Establish or update project-level principles, tech stack constraints, and quality baselines that all SDD specs must obey. Writes to .specs/constitution.md.
---

# Constitution Command (SDD)

This command creates or updates the **project constitution** — a single source of truth for non-negotiable rules that every spec, design, and implementation in this repo must follow.

## Arguments

`$ARGUMENTS` — Optional. Free-text describing what principles to add/change. If empty, run an interactive interview.

## Output

`.specs/constitution.md` (create the `.specs/` directory if missing).

## What This Command Does

1. **Read existing constitution** at `.specs/constitution.md` if present.
2. **Gather inputs** from the user via `$ARGUMENTS` or interactive Q&A:
   - Project mission (1–2 sentences)
   - Tech stack constraints (languages, frameworks, runtimes, DB)
   - Architectural principles (e.g. immutability, repository pattern, no global state)
   - Quality bars (test coverage %, lint level, security checklist)
   - Forbidden patterns (e.g. no raw SQL, no `any` in TS, no console.log in prod)
   - Definition of Done
3. **Produce a versioned constitution** with a changelog at the bottom.
4. **Show diff** vs previous version and ask for confirmation before writing.

## Required Output Format

Write `.specs/constitution.md` with exactly these sections:

```markdown
# Project Constitution

**Version:** vN
**Last Updated:** YYYY-MM-DD

## Mission
<one paragraph>

## Tech Stack (Locked)
- Language: ...
- Framework: ...
- Runtime: ...
- Database: ...

## Architectural Principles
1. ...
2. ...

## Quality Bars
- Test coverage: ≥80% (100% for security/financial code)
- Lint: ...
- Type safety: ...
- Security: ...

## Forbidden Patterns
- ...

## Definition of Done
- [ ] Tests written first, all passing
- [ ] Coverage meets bar
- [ ] Code review passed
- [ ] Security review passed (for sensitive code)
- [ ] Docs updated

## Changelog
- vN (YYYY-MM-DD): <what changed>
- v1 (YYYY-MM-DD): Initial constitution
```

## Rules

- **Never** silently overwrite an existing constitution — always diff and confirm.
- Bump the version number on every change.
- Keep it short and enforceable. If a rule can't be checked, don't include it.
- After writing, remind the user: "All subsequent `/one-sdd:*` commands will now load this constitution as a hard constraint."

## Integration

Every other `/one-sdd:*` command (specify, clarify, design, tasks, implement) **MUST** read this file first and treat its rules as non-negotiable.
