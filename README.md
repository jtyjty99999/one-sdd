# One SDD

> **A focused, Spec-Driven Development plugin for AI coding assistants** — agents, skills, hooks, and a full SDD pipeline (`specify → clarify → design → tasks → implement → verify`) for general software engineering with Java, Python, JavaScript, and TypeScript.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Plugin](https://img.shields.io/badge/Claude%20Code-plugin-7c3aed)](.claude-plugin/plugin.json)
[![SDD](https://img.shields.io/badge/Spec%20Driven-Development-success)](skills/sdd-workflow/SKILL.md)

Install once and you get **immediate access to 15 agents, 58 skills, and 25 commands** (plus hooks, rules, and MCP templates).

| | |
|--|--|
| **Agents** | 15 agents |
| **Commands** | 25 commands |
| **Skills** | 58 skills |

---

## Scope

One SDD bundles **15 agents**, **58 skills**, **25 slash commands** (including the SDD pipeline), hooks, rules, MCP templates, and multi‑vendor IDE configs. It focuses on **Java / Python / JavaScript / TypeScript** and general engineering workflows.

| Surface         | One SDD |
|-----------------|--------|
| Agents          | **15** |
| Commands        | **25** |
| Skills          | **58** |
| Language rules  | **6** (common, java, python, typescript, web, zh) |
| MCP server defs | **8** |
| Vendor dirs     | `.claude`, `.claude-plugin`, `.codex`, `.codex-plugin`, `.cursor`, `.opencode`, `.agents` |

### SDD pipeline

- **`/one-sdd:*` commands** — end-to-end workflow (`init`, `constitution`, `specify`, `clarify`, `design`, `tasks`, `implement`, `verify`, `status`).
- **`sdd-workflow` skill** — methodology behind those commands.
- **`.specs/`** — feature artifacts under `.specs/<slug>/` plus `.specs/constitution.md`.

### Compound engineering

- **`/compound` command** — after Plan, Work, and Review, capture durable lessons (indexed notes under `docs/solutions/`, regression tests, rules, or project memory). See `skills/compound-engineering/SKILL.md`.
- **`compound-engineering` skill** — closes the **Compound** step; use after quality gates (for example `/one-sdd:verify`) rather than instead of tests or review.

### Trimmed from broader plugin bases

- Languages/stacks outside Java / Python / JS / TS.
- Heavy domain/business skill packs.
- Multi-agent orchestration-only commands and some experimental workflows.
- Niche MCP servers and unused vendor IDE targets.

## Quick start (Claude Code)

```bash
# 1. Add this repo as a Claude Code marketplace, then install the plugin
/plugin marketplace add <this-repo-url>
/plugin install one-sdd

# 2. In any project, bootstrap SDD
/one-sdd:init

# 3. Drive your next feature through the pipeline
/one-sdd:specify add user authentication with email + password
/one-sdd:clarify user-authentication
/one-sdd:design user-authentication
/one-sdd:tasks user-authentication
/one-sdd:implement user-authentication
/one-sdd:verify user-authentication
```

For a longer worked example, see [`skills/sdd-workflow/SKILL.md`](skills/sdd-workflow/SKILL.md).

---

## Repository layout

```
.claude-plugin/      Claude Code plugin metadata (name + agent list)
.claude/             Project-level Claude Code config
.codex/  .codex-plugin/   OpenAI Codex CLI config
.cursor/             Cursor IDE config
.opencode/           OpenCode terminal config
.agents/             Generic agent/skill fallback (tool-agnostic)

agents/              15 specialized subagents
commands/            25 slash commands (9 SDD + 16 general)
skills/              58 workflow skills (incl. sdd-workflow, compound-engineering, speckit-*)
rules/               6 rule packs (common, java, python, typescript, web, zh)
hooks/               Trigger-based automation
mcp-configs/         8 MCP server templates

manifests/           Selective-install module manifest
schemas/             JSON schemas for installer + configs
scripts/             Cross-platform installer plumbing
tests/               Test suite

.specs/              SDD artifacts (created on demand by /one-sdd:init)
```

---

## Other AI tools

Beyond Claude Code, One SDD ships pre-translated configs for these tools' formats. They are best-effort mirrors of the same underlying resources — Claude Code remains the primary, fully-tested target.

| Tool                  | Vendor directory       | Notes                                                |
|-----------------------|------------------------|------------------------------------------------------|
| Claude Code           | `.claude-plugin/`, `.claude/` | Primary target. Installed via `/plugin install one-sdd`. |
| Cursor IDE            | `.cursor/`             | Rules, hooks, skills mirrored to Cursor conventions. |
| OpenAI Codex CLI      | `.codex/`, `.codex-plugin/` | Plugin manifest + AGENTS.md.                    |
| OpenCode              | `.opencode/`           | Commands + tools + plugins for the OpenCode terminal. |
| Generic / tool-agnostic | `.agents/`           | Fallback for harnesses without a dedicated directory. |

Removed optional vendor targets in this line-up: Gemini CLI, Amazon Kiro, Trae IDE, CodeBuddy.

---

## License

Distributed under the [MIT License](LICENSE). See `LICENSE` for the full text.

---

## Acknowledgements

- **Spec Driven Development methodology** draws on [GitHub Spec Kit](https://github.com/github/spec-kit) and common spec-first practice; this repo adds a Claude/Cursor-oriented command pipeline and team conventions.

---

## See also

- [`AGENTS.md`](AGENTS.md) — agent-facing instructions (loaded by Claude Code / Codex automatically)
- [`CHANGELOG.md`](CHANGELOG.md) — release notes, including One SDD surface updates under v1.10.1 and the prune entry under v1.10.0
- [`skills/sdd-workflow/SKILL.md`](skills/sdd-workflow/SKILL.md) — the SDD methodology, in depth
