/**
 * One SDD Plugins for OpenCode
 *
 * This module exports all One SDD plugins for OpenCode integration.
 * Plugins provide hook-based automation that mirrors Claude Code's hook system
 * while taking advantage of OpenCode's more sophisticated 20+ event types.
 */

export { OneSddHooksPlugin, default } from "./one-sdd-hooks.js"

// Re-export for named imports
export * from "./one-sdd-hooks.js"
