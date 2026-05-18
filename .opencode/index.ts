/**
 * One SDD Plugin for OpenCode
 *
 * This package provides the published One SDD OpenCode plugin module:
 * - Plugin hooks (auto-format, TypeScript check, console.log warning, env injection, etc.)
 * - Custom tools (run-tests, check-coverage, security-audit, format-code, lint-check, git-summary)
 * - Bundled reference config/assets for the wider One SDD OpenCode setup
 *
 * Usage:
 *
 * Option 1: Install via npm
 * ```bash
 * npm install one-sdd
 * ```
 *
 * Then add to your opencode.json:
 * ```json
 * {
 *   "plugin": ["one-sdd"]
 * }
 * ```
 *
 * That enables the published plugin module only. For One SDD commands, agents,
 * prompts, and instructions, use this repository's `.opencode/opencode.json`
 * as a base or copy the bundled `.opencode/` assets into your project.
 *
 * Option 2: Clone and use directly
 * ```bash
 * git clone https://g.hz.netease.com/codewave/one-sdd
 * cd one-sdd
 * opencode
 * ```
 *
 * @packageDocumentation
 */

// Export the main plugin
export { OneSddHooksPlugin, default } from "./plugins/index.js"

// Export individual components for selective use
export * from "./plugins/index.js"

// Version export
export const VERSION = "1.6.0"

// Plugin metadata
export const metadata = {
  name: "one-sdd",
  version: VERSION,
  description: "One SDD plugin for OpenCode",
  author: "One SDD",
  features: {
    agents: 15,
    commands: 24,
    skills: 40,
    configAssets: true,
    hookEvents: [
      "file.edited",
      "tool.execute.before",
      "tool.execute.after",
      "session.created",
      "session.idle",
      "session.deleted",
      "file.watcher.updated",
      "permission.ask",
      "todo.updated",
      "shell.env",
      "experimental.session.compacting",
    ],
    customTools: [
      "run-tests",
      "check-coverage",
      "security-audit",
      "format-code",
      "lint-check",
      "git-summary",
      "changed-files",
    ],
  },
}
