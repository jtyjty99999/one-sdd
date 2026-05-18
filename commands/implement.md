---
description: Execute tasks.md sequentially with TDD enforcement, checkpointing progress after each task. Delegates to tdd-guide and code-reviewer agents.
---

# Implement Command (SDD)

This command executes the task list produced by `/one-sdd:tasks`, **one task at a time**, with mandatory TDD and per-task review. It is the final step of the SDD pipeline.

## Arguments

`$ARGUMENTS` — Feature slug. Optional second token: `--from T-NNN` to resume from a specific task.

## Pre-flight

1. **Load constitution** from `.specs/constitution.md` — every quality bar applies.
2. **Load spec, design, tasks** from `.specs/<slug>/`. Tasks file must exist and status must be `ready`.
3. **Find the next pending task** — first `[ ]` in dependency order (respecting `||` parallel markers if a previous task is `[x]`).
4. **Verify branch hygiene** — recommend the user be on a dedicated branch like `feat/<slug>`. Ask if working tree is clean.

## Execution Loop

For each task, in order:

1. **Announce the task** — print T-ID, title, files, acceptance criteria.
2. **Confirm with user** before starting (yes/skip/stop). Skip marks as `[!]` blocked with reason.
3. **Mark in-progress** — change `[ ]` to `[~]` in `tasks.md`.
4. **Delegate**:
   - If the task is a test task → delegate to **tdd-guide** agent (RED phase).
   - If the task is an implementation task → delegate to **tdd-guide** agent (GREEN + REFACTOR phases). The corresponding test task must already be `[x]`.
   - If the task is non-code (migration, config, docs) → execute directly.
5. **Verify acceptance criteria**:
   - Run the test/command named in the task.
   - Check coverage if the constitution requires it.
6. **Review** — delegate to **code-reviewer** agent on the diff. Address CRITICAL/HIGH issues before closing the task.
7. **Mark done** — change `[~]` to `[x]` in `tasks.md`. Commit with conventional commit: `<type>(<slug>): T-NNN <title>`.
8. **Stop and report** if:
   - Acceptance criteria fail and you can't fix in 2 attempts
   - The task uncovers a design gap → recommend updating `design.md` and re-running `/one-sdd:tasks`
   - A constitution violation is unavoidable → escalate to user

After every 3 tasks, **pause and summarize** progress (done / remaining / blockers) and wait for user `continue` / `stop`.

## Critical Rules

- **Never skip the test task.** If a code task's prerequisite test task is not `[x]`, refuse and write the test first.
- **Never silently expand scope.** New work goes back to `/one-sdd:specify` or surfaces as a new task in `tasks.md`.
- **Never edit `spec.md` or `design.md`** during implement. If those are wrong, stop and recommend re-running the appropriate command.
- **Always update `tasks.md`** as you go — it is the live execution ledger.
- **Respect the constitution.** Quality bars are hard gates, not suggestions.
- **Security-sensitive code** (auth, payments, secrets, user input handling) MUST additionally be reviewed by the **security-reviewer** agent before the task is marked done.

## Output After Each Task

```
Task T-011: Implement enqueueNotification — DONE

Tests:  6 passed, 0 failed
Coverage: 92% (target 80%)
Review: 0 CRITICAL, 0 HIGH, 1 LOW (style suggestion, addressed)
Commit: feat(realtime-notifications): T-011 implement enqueueNotification

Progress: 7/24 tasks done. Next: T-012 — Wire enqueue into market resolution hook.
Continue? (yes / stop / skip)
```

## Output After Full Run

```
Feature <slug> implementation: COMPLETE

Tasks:    24/24 done
Coverage: 88% overall (target 80%)
Reviews:  0 CRITICAL, 0 HIGH outstanding
Commits:  24

Recommended next steps:
  1. Run /one-sdd:tasks <slug> --verify to confirm all acceptance criteria
  2. Open a PR: gh pr create ...
  3. Update spec status to `shipped` once merged
```

## Integration

- Reads: `.specs/constitution.md`, `.specs/<slug>/{spec,design,tasks}.md`
- Writes: production code + `.specs/<slug>/tasks.md` (status updates)
- Agents: `tdd-guide`, `code-reviewer`, `security-reviewer` (when applicable), `build-error-resolver` (on build failure)
- Final step in the SDD pipeline.
