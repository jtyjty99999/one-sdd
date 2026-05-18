/**
 * TDD: SDD bootstrap — Spec Kit vendoring, CONSTITUTION, install module.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '../..');

const { SUPPORTED_INSTALL_TARGETS } = require('../../scripts/lib/install-manifests');

const REQUIRED_SPECKIT_SKILLS = [
  'speckit-analyze',
  'speckit-checklist',
  'speckit-clarify',
  'speckit-constitution',
  'speckit-git-commit',
  'speckit-git-feature',
  'speckit-git-initialize',
  'speckit-git-remote',
  'speckit-git-validate',
  'speckit-implement',
  'speckit-plan',
  'speckit-specify',
  'speckit-tasks',
  'speckit-taskstoissues',
];

const SPEC_KIT_VERSION = 'v0.8.11';

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(REPO_ROOT, relativePath), 'utf8'));
}

function runTests() {
  console.log('\n=== Testing SDD bootstrap (sdd-bootstrap) ===\n');

  let passed = 0;
  let failed = 0;

  if (test('CONSTITUTION.md exists at repo root', () => {
    const constitutionPath = path.join(REPO_ROOT, 'CONSTITUTION.md');
    assert.ok(fs.existsSync(constitutionPath), 'CONSTITUTION.md should exist');
    const content = fs.readFileSync(constitutionPath, 'utf8');
    assert.ok(!content.includes('[PROJECT_NAME]'), 'Should not contain template placeholders');
    assert.ok(
      content.includes('one-sdd') || content.includes('One SDD'),
      'Should name the project'
    );
  })) passed++; else failed++;

  if (test('vendor/spec-kit.lock.json pins upstream spec-kit', () => {
    const lockPath = path.join(REPO_ROOT, 'vendor/spec-kit.lock.json');
    assert.ok(fs.existsSync(lockPath), 'vendor/spec-kit.lock.json should exist');
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    assert.strictEqual(lock.version, SPEC_KIT_VERSION);
    assert.ok(lock.source.includes('github/spec-kit'), 'Should record spec-kit source');
  })) passed++; else failed++;

  if (test('scripts/vendor-spec-kit.js exists', () => {
    assert.ok(
      fs.existsSync(path.join(REPO_ROOT, 'scripts/vendor-spec-kit.js')),
      'vendor script should exist for maintainers'
    );
  })) passed++; else failed++;

  if (test('.specify/templates includes spec-template.md', () => {
    const templatePath = path.join(REPO_ROOT, '.specify/templates/spec-template.md');
    assert.ok(fs.existsSync(templatePath), '.specify/templates/spec-template.md should exist');
  })) passed++; else failed++;

  if (test('required speckit skills exist under skills/ (canonical)', () => {
    for (const skillId of REQUIRED_SPECKIT_SKILLS) {
      const skillPath = path.join(REPO_ROOT, 'skills', skillId, 'SKILL.md');
      assert.ok(fs.existsSync(skillPath), `Missing skills/${skillId}/SKILL.md`);
    }
  })) passed++; else failed++;

  if (test('required speckit skills are mirrored to .cursor/skills/', () => {
    for (const skillId of REQUIRED_SPECKIT_SKILLS) {
      const skillPath = path.join(REPO_ROOT, '.cursor', 'skills', skillId, 'SKILL.md');
      assert.ok(fs.existsSync(skillPath), `Missing .cursor/skills/${skillId}/SKILL.md`);
    }
  })) passed++; else failed++;

  if (test('speckit canonical matches Cursor mirror', () => {
    const { spawnSync } = require('child_process');
    const r = spawnSync(process.execPath, [
      path.join(REPO_ROOT, 'scripts', 'sync-speckit-cursor-skills.js'),
      '--check',
    ], { cwd: REPO_ROOT, encoding: 'utf8' });
    assert.strictEqual(r.status, 0, r.stderr || r.stdout);
  })) passed++; else failed++;

  if (test('speckit-specify skill is registered', () => {
    const skillPath = path.join(REPO_ROOT, '.cursor/skills/speckit-specify/SKILL.md');
    const content = fs.readFileSync(skillPath, 'utf8');
    assert.ok(
      /name:\s*["']?speckit-specify["']?/m.test(content),
      'Skill should register as speckit-specify'
    );
  })) passed++; else failed++;

  if (test('specify-rules.mdc exists for Cursor context', () => {
    assert.ok(
      fs.existsSync(path.join(REPO_ROOT, '.cursor/rules/specify-rules.mdc')),
      'specify-rules.mdc should exist'
    );
  })) passed++; else failed++;

  if (test('install-modules.json defines sdd-speckit module', () => {
    const modules = readJson('manifests/install-modules.json');
    const sdd = modules.modules.find(module => module.id === 'sdd-speckit');
    assert.ok(sdd, 'sdd-speckit module should exist');
    assert.ok(
      sdd.paths.some(p => p === '.specify' || p.startsWith('.specify/')),
      'sdd-speckit should include .specify paths'
    );
    assert.ok(
      sdd.paths.some(p => p === 'skills/speckit-specify'),
      'sdd-speckit should ship canonical speckit skills'
    );
    const sortedExpected = [...SUPPORTED_INSTALL_TARGETS].sort();
    const sortedActual = [...sdd.targets].sort();
    assert.deepStrictEqual(
      sortedActual,
      sortedExpected,
      'sdd-speckit should support every harness install target'
    );
  })) passed++; else failed++;

  if (test('developer profile includes sdd-speckit', () => {
    const profiles = readJson('manifests/install-profiles.json');
    assert.ok(
      profiles.profiles.developer.modules.includes('sdd-speckit'),
      'developer profile should include sdd-speckit'
    );
  })) passed++; else failed++;

  if (test('speckit-constitution respects root CONSTITUTION.md', () => {
    const skillPath = path.join(REPO_ROOT, '.cursor/skills/speckit-constitution/SKILL.md');
    assert.ok(fs.existsSync(skillPath), 'speckit-constitution skill should exist');
    const content = fs.readFileSync(skillPath, 'utf8');
    assert.ok(content.includes('CONSTITUTION.md'), 'Should reference root CONSTITUTION.md');
    assert.ok(
      content.toLowerCase().includes('do not overwrite') || content.includes('不覆盖'),
      'Should forbid overwriting existing root constitution'
    );
  })) passed++; else failed++;

  if (test('docs/SDD-SETUP.md documents Superpowers and Spec Kit', () => {
    const docPath = path.join(REPO_ROOT, 'docs/SDD-SETUP.md');
    assert.ok(fs.existsSync(docPath), 'docs/SDD-SETUP.md should exist');
    const content = fs.readFileSync(docPath, 'utf8');
    assert.ok(content.includes('superpowers'), 'Should mention Superpowers');
    assert.ok(content.includes('speckit'), 'Should mention speckit commands');
  })) passed++; else failed++;

  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
