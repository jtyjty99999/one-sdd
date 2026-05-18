---
description: Bootstrap SDD in a project — create .specs/ structure, seed constitution.md from a template, and verify .gitignore. Idempotent; safe to re-run.
---

# Init Command (SDD)

This command sets up Spec Driven Development in a fresh project (or a project new to SDD). It creates the directory layout, seeds a constitution template, and runs sanity checks so the rest of the `/one-sdd:*` commands work out of the box.

## Arguments

`$ARGUMENTS` — Optional flags:
- `--force` — overwrite existing `.specs/constitution.md` (with a backup)
- `--no-interactive` — skip the constitution Q&A and write a pure template (user fills in later)

## Pre-flight

1. Detect repo root (look for `.git/`, fall back to current directory).
2. Detect project language / framework from `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, etc. Use to pre-fill constitution defaults.
3. Check whether `.specs/` already exists.

## What This Command Does

### Step 1: Create directory structure

```
.specs/
├── README.md              # explains what's in here, for new contributors
├── constitution.md        # project-wide rules (template if first run)
└── .gitkeep               # ensure empty dirs are tracked
```

If `.specs/` already exists, skip without error and report what was found.

### Step 2: Seed `.specs/README.md`

Always overwrite (this is informational, not user data):

```markdown
# .specs/ — Spec Driven Development Artifacts

This directory is the single source of truth for every SDD-managed feature in this repo.

## Layout
- `constitution.md` — project-wide rules every feature must respect.
- `<feature-slug>/` — one directory per feature, containing:
  - `spec.md`          — what & why (from `/one-sdd:specify`)
  - `clarifications.md` — decisions resolved during `/one-sdd:clarify`
  - `design.md`        — how (from `/one-sdd:design`)
  - `tasks.md`         — execution checklist (from `/one-sdd:tasks`)

## Lifecycle
spec → clarify → design → tasks → implement → verify

Run `/one-sdd:status` for a live view of every feature in the pipeline.

## Rules
- These files are the contract. Code conforms to them, not the other way around.
- Edit by hand only when no command applies — most edits should flow through `/one-sdd:*` commands so traceability stays intact.
- Commit `.specs/` to Git. They are first-class project artifacts.
```

### Step 3: Seed `.specs/constitution.md`

**If file does not exist** OR `--force` is passed (backup the old one to `.specs/constitution.md.bak-YYYYMMDD`):

- **Interactive mode (default)**: ask 5–7 short questions one at a time using the same option-list style as `/one-sdd:clarify`:
  1. Mission (1–2 sentences)
  2. Primary language / framework (auto-detected → confirm)
  3. Test coverage target (default: 80%)
  4. Type safety requirement (strict / loose / N/A — auto-detected)
  5. Top 3 forbidden patterns for this codebase (give defaults based on language)
  6. Any locked architectural patterns (e.g. repository pattern, immutability, no global state)
- **Non-interactive mode**: write the template with `<FILL IN>` placeholders.

Then write `.specs/constitution.md` using the schema from `/one-sdd:constitution`. Set version = v1 and today's date.

**If file already exists** and `--force` not passed: skip and remind the user they can update via `/one-sdd:constitution`.

### Step 4: `.gitignore` sanity check

- Read `.gitignore` if present.
- If any pattern would ignore `.specs/` (e.g. `.specs`, `.specs/`, `.s*`, `**/.specs/**`), warn the user explicitly and offer to add an exception:
  ```
  !.specs/
  !.specs/**
  ```
- If `.gitignore` is fine, just confirm.

### Step 5: Optional integrations

Detect and offer (ask one at a time, never silently):
- If CI config exists (`.github/workflows/`, `.gitlab-ci.yml`, etc.) → offer to drop a sample step that runs `/one-sdd:verify` on PRs.
- If `tdd-workflow` skill is already activated in the project → mention it dovetails with `/one-sdd:implement`.

### Step 6: Print getting-started summary

```
✓ SDD initialized

Created:
  .specs/README.md
  .specs/constitution.md (v1)

Detected:
  Language:      TypeScript (from package.json)
  Test runner:   vitest
  Coverage tool: c8

Next steps:
  1. Review .specs/constitution.md and edit if needed
  2. Run /one-sdd:specify <your-feature-idea> to start your first spec
  3. Run /one-sdd:status anytime to see where each feature stands

Pipeline: specify → clarify → design → tasks → implement → verify
```

## Critical Rules

- **Idempotent.** Re-running on an already-initialized project must NOT destroy data. Without `--force`, never overwrite `constitution.md`.
- **Always back up** before overwriting (suffix `.bak-YYYYMMDD-HHMM`).
- **Never silently modify `.gitignore`.** Warn and offer; let the user confirm.
- **One question at a time** in interactive mode. Same rule as `/one-sdd:clarify`.
- **Auto-detect aggressively**, but always show the detected value and ask for confirmation.

## Integration

- Reads: `.git/`, `package.json` / `pyproject.toml` / `go.mod` / etc., `.gitignore`
- Writes: `.specs/README.md`, `.specs/constitution.md` (first run or `--force`)
- Next: `/one-sdd:specify <feature>` or `/one-sdd:constitution` to refine the template
