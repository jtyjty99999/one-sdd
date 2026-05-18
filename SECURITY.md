# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.9.x   | :white_check_mark: |
| 1.8.x   | :white_check_mark: |
| < 1.8   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in One SDD, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, contact your organization's security team through the internal channel established by your company (do not use a public issue tracker for undisclosed vulnerabilities). Include:

- A clear description of the vulnerability
- Steps to reproduce
- The affected version(s)
- Any potential impact assessment

You can expect:

- **Acknowledgment** within 48 hours
- **Status update** within 7 days
- **Fix or mitigation** within 30 days for critical issues

If the vulnerability is accepted, we will:

- Credit you in the release notes (unless you prefer anonymity)
- Fix the issue in a timely manner
- Coordinate disclosure timing with you

If the vulnerability is declined, we will explain why and provide guidance on whether it should be reported elsewhere.

## Scope

This policy covers:

- The One SDD plugin and all scripts in this repository
- Hook scripts that execute on your machine
- Install/uninstall/repair lifecycle scripts
- MCP configurations shipped with One SDD
- Optional security scanning integrations documented in this repository (see skills and CI examples), where you operate your own toolchain and policies

## Security Resources

- **security-config-audit**: Scan your agent config for vulnerabilities — `npx security-config-audit scan`
- **Security Guide**: [The Shorthand Guide to Everything Agentic Security](./the-security-guide.md)
- **OWASP MCP Top 10**: [owasp.org/www-project-mcp-top-10](https://owasp.org/www-project-mcp-top-10/)
- **OWASP Agentic Applications Top 10**: [genai.owasp.org](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
