# OpenCode One SDD Plugin

> WARNING: This README is specific to OpenCode usage.
> If you installed One SDD via npm (e.g. `npm install opencode-ecc`), refer to the root README instead.

One SDD plugin for OpenCode - agents, commands, hooks, and skills.

## Installation

## Installation Overview

There are two ways to use One SDD:

1. **npm package (recommended for most users)**
   Install via npm/bun/yarn and use the `ecc-install` CLI to set up rules and agents.

2. **Direct clone / plugin mode**
   Clone the repository and run OpenCode directly inside it.

Choose the method that matches your workflow below.

### Option 1: npm Package

```bash
npm install one-sdd
```

Add to your `opencode.json`:

```json
{
  "plugin": ["one-sdd"]
}
```

This loads the One SDD OpenCode plugin module from npm:
- hook/event integrations
- bundled custom tools exported by the plugin

It does **not** auto-register the full One SDD command/agent/instruction catalog in your project config. For the full OpenCode setup, either:
- run OpenCode inside this repository, or
- copy the relevant `.opencode/commands/`, `.opencode/prompts/`, `.opencode/instructions/`, and the `instructions`, `agent`, and `command` config entries into your own project

After installation, the `ecc-install` CLI is also available:

```bash
npx ecc-install typescript
```

### Option 2: Direct Use

Clone and run OpenCode in the repository:

```bash
git clone https://g.hz.netease.com/codewave/one-sdd
cd one-sdd
opencode
```

## Features

### Agents (12)

| Agent | Description |
|-------|-------------|
| planner | Implementation planning |
| architect | System design |
| code-reviewer | Code review |
| security-reviewer | Security analysis |
| tdd-guide | Test-driven development |
| build-error-resolver | Build error fixes |
| e2e-runner | E2E testing |
| doc-updater | Documentation |
| refactor-cleaner | Dead code cleanup |
| go-reviewer | Go code review |
| go-build-resolver | Go build errors |
| database-reviewer | Database optimization |

### Commands (27)

These entries match the `command` keys in bundled `opencode.json`. Markdown stubs under `.opencode/commands/` without a corresponding `command` entry are not registered as slash commands.

| Command | Description |
|---------|-------------|
| `/build-fix` | Fix build and TypeScript errors with minimal changes |
| `/checkpoint` | Save verification state and progress |
| `/code-review` | Review code for quality, security, and maintainability |
| `/compound` | After Plan, Work, Review — persist lessons as docs, tests, or rules |
| `/e2e` | Generate and run E2E tests with Playwright |
| `/eval` | Run evaluation against criteria |
| `/evolve` | Cluster instincts into skills |
| `/go-build` | Fix Go build errors |
| `/go-review` | Go code review |
| `/go-test` | Go TDD workflow |
| `/instinct-export` | Export instincts |
| `/instinct-import` | Import instincts |
| `/instinct-status` | View learned instincts |
| `/learn` | Extract patterns and learnings from session |
| `/orchestrate` | Orchestrate multiple agents for complex tasks |
| `/plan` | Create a detailed implementation plan for complex features |
| `/projects` | List known projects and instinct stats |
| `/promote` | Promote project instincts to global scope |
| `/refactor-clean` | Remove dead code and consolidate duplicates |
| `/security` | Run comprehensive security review |
| `/setup-pm` | Configure package manager |
| `/skill-create` | Generate skills from git history |
| `/tdd` | Enforce TDD workflow with 80%+ test coverage |
| `/test-coverage` | Analyze test coverage |
| `/update-codemaps` | Update codemaps |
| `/update-docs` | Update documentation |
| `/verify` | Run verification loop |

### Plugin Hooks

| Hook | Event | Purpose |
|------|-------|---------|
| Prettier | `file.edited` | Auto-format JS/TS |
| TypeScript | `tool.execute.after` | Check for type errors |
| console.log | `file.edited` | Warn about debug statements |
| Notification | `session.idle` | Desktop notification |
| Security | `tool.execute.before` | Check for secrets |

### Custom Tools

| Tool | Description |
|------|-------------|
| run-tests | Run test suite with options |
| check-coverage | Analyze test coverage |
| security-audit | Security vulnerability scan |

## Hook Event Mapping

OpenCode's plugin system maps to Claude Code hooks:

| Claude Code | OpenCode |
|-------------|----------|
| PreToolUse | `tool.execute.before` |
| PostToolUse | `tool.execute.after` |
| Stop | `session.idle` |
| SessionStart | `session.created` |
| SessionEnd | `session.deleted` |

OpenCode has 20+ additional events not available in Claude Code.

### Hook Runtime Controls

OpenCode plugin hooks honor the same runtime controls used by Claude Code/Cursor:

```bash
export ONE_SDD_HOOK_PROFILE=standard
export ONE_SDD_DISABLED_HOOKS="pre:bash:tmux-reminder,post:edit:typecheck"
```

- `ONE_SDD_HOOK_PROFILE`: `minimal`, `standard` (default), `strict`
- `ONE_SDD_DISABLED_HOOKS`: comma-separated hook IDs to disable

## Skills

The bundled `opencode.json` `instructions` array loads **core One SDD workflow skills** plus the full **Spec Kit speckit chain** (`skills/speckit-*/SKILL.md`) so OpenCode matches Claude/Codex/Cursor capabilities for `.specify/` workflows. Trim entries in your fork if you need a leaner context window.

Core workflow skills (subset):

- coding-standards, backend-patterns, frontend-patterns, frontend-slides
- security-review, tdd-workflow, eval-harness, verification-loop, api-design, e2e-testing

Spec Kit (`speckit-*`): `speckit-specify`, `speckit-clarify`, `speckit-plan`, `speckit-tasks`, `speckit-analyze`, `speckit-implement`, `speckit-constitution`, `speckit-checklist`, `speckit-taskstoissues`, and `speckit-git-*` helpers — see `skills/speckit-*` and `opencode.json`.

Additional specialized skills are shipped under `skills/` but not all are listed in `instructions` by default.

## Configuration

Full configuration in `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",
  "plugin": ["./plugins"],
  "instructions": [
    "skills/tdd-workflow/SKILL.md",
    "skills/security-review/SKILL.md"
  ],
  "agent": { /* 12 agents */ },
  "command": { /* 24 commands */ }
}
```

## License

MIT
