#!/usr/bin/env node
/**
 * Refresh vendored Spec Kit assets from github/spec-kit (cursor-agent integration).
 * Usage: node scripts/vendor-spec-kit.js [--force]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const SPEC_KIT_REF = 'v0.8.11';
const STAGING = path.join(REPO_ROOT, 'vendor', '_spec-kit-staging');
const LOCK_PATH = path.join(REPO_ROOT, 'vendor', 'spec-kit.lock.json');

function run(cmd, options = {}) {
  execSync(cmd, { stdio: 'inherit', cwd: REPO_ROOT, ...options });
}

function copyDir(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

function main() {
  const force = process.argv.includes('--force');

  fs.mkdirSync(path.dirname(STAGING), { recursive: true });
  if (fs.existsSync(STAGING) && !force) {
    console.error('Staging exists. Re-run with --force to refresh.');
    process.exit(1);
  }

  if (fs.existsSync(STAGING)) {
    fs.rmSync(STAGING, { recursive: true, force: true });
  }
  fs.mkdirSync(STAGING, { recursive: true });

  const from = `git+https://github.com/github/spec-kit.git@${SPEC_KIT_REF}`;
  run(`uvx --from ${from} specify init vendor/_spec-kit-staging --integration cursor-agent --force`);

  copyDir(path.join(STAGING, '.specify'), path.join(REPO_ROOT, '.specify'));
  const skillsSrc = path.join(STAGING, '.cursor', 'skills');
  const skillsDest = path.join(REPO_ROOT, '.cursor', 'skills');
  for (const name of fs.readdirSync(skillsSrc)) {
    if (!name.startsWith('speckit-')) continue;
    const dest = path.join(skillsDest, name);
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
    copyDir(path.join(skillsSrc, name), dest);
  }

  const canonicalSpeckitRoot = path.join(REPO_ROOT, 'skills');
  for (const name of fs.readdirSync(skillsDest)) {
    if (!name.startsWith('speckit-')) continue;
    const destCanon = path.join(canonicalSpeckitRoot, name);
    if (fs.existsSync(destCanon)) fs.rmSync(destCanon, { recursive: true, force: true });
    copyDir(path.join(skillsDest, name), destCanon);
  }
  console.log('Mirrored speckit skills to skills/ (canonical for Claude or Codex). Run node scripts/sync-speckit-cursor-skills.js to refresh .cursor/skills/.');
  copyDir(
    path.join(STAGING, '.cursor', 'rules', 'specify-rules.mdc'),
    path.join(REPO_ROOT, '.cursor', 'rules', 'specify-rules.mdc')
  );

  const memoryConstitution = path.join(REPO_ROOT, '.specify', 'memory', 'constitution.md');
  if (fs.existsSync(memoryConstitution)) {
    fs.unlinkSync(memoryConstitution);
  }

  const lock = {
    version: SPEC_KIT_REF,
    source: `git+https://github.com/github/spec-kit.git@${SPEC_KIT_REF}`,
    license: 'MIT',
    integration: 'cursor-agent',
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(LOCK_PATH, `${JSON.stringify(lock, null, 2)}\n`);

  console.log('Spec Kit vendored. Re-apply speckit-constitution patch if upstream overwrote it.');
}

main();
