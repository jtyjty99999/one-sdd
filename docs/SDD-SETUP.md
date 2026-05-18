# SDD Setup (one-sdd)

This project bundles **Spec Kit** spec-driven development and recommends **Superpowers** for agent workflows.

## Install One SDD + Spec Kit into your project

```bash
./install.sh --target cursor --profile developer
# or: npx ecc-install --target cursor --profile developer
```

Speckit skills are **canonical** in `skills/speckit-*/SKILL.md` (Claude Code and Codex load `./skills/` via plugin manifests; OpenCode lists them in `.opencode/opencode.json` → `instructions`). **Cursor** resolves Agent skills from `.cursor/skills/` — run `npm run sync:speckit-cursor` after editing canonical files so mirrors stay aligned (`npm run sync:speckit-cursor:check` in CI).

After install, use the speckit chain in Cursor Agent (slash names depend on your harness; skills are the same content):

- `/speckit-specify` — create or update a feature spec
- `/speckit-clarify` — resolve ambiguity (optional, before plan)
- `/speckit-plan` — technical plan
- `/speckit-tasks` — task breakdown
- `/speckit-analyze` — consistency check (before implement)
- `/speckit-implement` — execute tasks

Team governance lives in root **`CONSTITUTION.md`** (not `.specify/memory/constitution.md`).

## Superpowers

Enable the marketplace plugin in Cursor Agent:

```text
/add-plugin superpowers
```

This repo also sets `.cursor/settings.json` to prefer Superpowers when supported by your Cursor version.

Verify: ask the agent whether Superpowers skills (e.g. brainstorming, TDD) are available.

## Maintainer: refresh Spec Kit

Pinned version: see `vendor/spec-kit.lock.json`.

```bash
node scripts/vendor-spec-kit.js --force
# Re-apply speckit-constitution patch for root CONSTITUTION.md if needed
node tests/sdd/sdd-bootstrap.test.js
```

## Workflow

```text
/speckit-specify → /speckit-clarify → /speckit-plan → /speckit-tasks → /speckit-analyze → /speckit-implement
```
