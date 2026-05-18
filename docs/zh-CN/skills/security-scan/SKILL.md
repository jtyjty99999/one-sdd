---
name: security-scan
description: Review your Claude Code configuration (.claude/) for common security risks — secrets, MCP supply chain, hooks, and agent permissions. Uses checklist-driven review plus standard npm/project audits where applicable.
origin: One SDD
---

# Security Scan Skill

Use a **structured review** of `.claude/` and related config before trusting it in production. Prefer organization-approved scanners or internal CI; this skill documents **what to look for** and **safe defaults**.

## When to Activate

- Setting up a new Claude Code project
- After modifying `.claude/settings.json`, `CLAUDE.md`, or MCP configs
- Before committing configuration changes
- When onboarding to a repository with existing Claude Code configs
- Periodic security hygiene checks

## What to Review

| Area | Checks |
|------|--------|
| `CLAUDE.md` | Hardcoded secrets, auto-run instructions, prompt injection patterns |
| `settings.json` | Overly permissive allow lists, missing deny lists, dangerous bypass flags |
| `mcp.json` | Risky MCP servers, hardcoded env secrets, `npx -y` supply chain risks |
| `hooks/` | Command injection via interpolation, data exfiltration, silent error suppression (`2>/dev/null`, `|| true`) |
| `agents/*.md` | Unrestricted tools, prompt injection surface, missing model specs |

## Baseline Commands

Run from the **project root** (adapt to your stack):

```bash
# Dependency / lockfile audit (when applicable)
npm audit --omit=dev

# Search for obvious secret-like strings in .claude (example; extend patterns as needed)
rg -n "SECRET|TOKEN|API_KEY|BEGIN (RSA |OPENSSH )?PRIVATE" .claude/ || true
```

Integrate findings into your **internal** security workflow and CI; do not post undisclosed issues to public trackers.

## Severity Mindset

Treat these as **stop-the-line** until resolved:

- Hardcoded API keys or tokens in tracked config
- `Bash(*)` or effectively unrestricted shell in agent/tool policies
- Command injection in hooks via unescaped paths or env
- MCP endpoints or `npx` invocations you cannot pin or verify

## Links

- Organization policy: follow your internal security runbook.
- Public references (optional): [OWASP Top 10](https://owasp.org/www-project-top-ten/), [OWASP LLM Top 10](https://genai.owasp.org/).
