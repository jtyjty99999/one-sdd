#!/usr/bin/env node
/**
 * Canonical speckit skills: repo skills/speckit-{name}/SKILL.md (Claude Code, Codex, OpenCode).
 * Cursor Agent reads .cursor/skills — this script mirrors repo skills into that tree.
 *
 * Usage:
 *   node scripts/sync-speckit-cursor-skills.js          # copy skills/speckit-* → .cursor/skills/speckit-*
 *   node scripts/sync-speckit-cursor-skills.js --check  # exit 1 if mirrors drift
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const SRC_ROOT = path.join(REPO_ROOT, 'skills');
const DEST_ROOT = path.join(REPO_ROOT, '.cursor', 'skills');

function listSpeckitDirs() {
  if (!fs.existsSync(SRC_ROOT)) return [];
  return fs
    .readdirSync(SRC_ROOT, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && /^speckit-/.test(entry.name))
    .map(entry => entry.name)
    .sort();
}

function readFileOrNull(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function copyMirrors() {
  const names = listSpeckitDirs();
  if (names.length === 0) {
    console.error('sync-speckit-cursor-skills: no skills/speckit-* directories found');
    process.exit(1);
  }

  let n = 0;
  for (const name of names) {
    const src = path.join(SRC_ROOT, name, 'SKILL.md');
    if (!fs.existsSync(src)) {
      console.error(`sync-speckit-cursor-skills: missing ${src}`);
      process.exit(1);
    }
    const dest = path.join(DEST_ROOT, name, 'SKILL.md');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    n += 1;
  }
  console.log(`sync-speckit-cursor-skills: synced ${n} skills → .cursor/skills/`);
}

function checkMirrors() {
  const names = listSpeckitDirs();
  if (names.length === 0) {
    console.error('sync-speckit-cursor-skills --check: no skills/speckit-* directories');
    process.exit(1);
  }

  let ok = true;
  for (const name of names) {
    const a = path.join(SRC_ROOT, name, 'SKILL.md');
    const b = path.join(DEST_ROOT, name, 'SKILL.md');
    const ca = readFileOrNull(a);
    const cb = readFileOrNull(b);
    if (ca === null) {
      console.error(`--check: missing ${a}`);
      ok = false;
      continue;
    }
    if (ca !== cb) {
      console.error(`--check: drift between skills/${name}/SKILL.md and .cursor/skills/${name}/SKILL.md`);
      ok = false;
    }
  }

  if (!ok) {
    process.exit(1);
  }
  console.log(`sync-speckit-cursor-skills --check: ${names.length} speckit mirrors match skills/`);
}

function main() {
  if (process.argv.includes('--check')) {
    checkMirrors();
    return;
  }
  copyMirrors();
}

main();
