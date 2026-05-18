/**
 * Ensures skills/speckit-* and .cursor/skills/speckit-* stay identical (P1).
 */

const assert = require('assert');
const { spawnSync } = require('child_process');
const path = require('path');

const repoRoot = path.join(__dirname, '../..');
const script = path.join(repoRoot, 'scripts', 'sync-speckit-cursor-skills.js');

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (e) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${e.message}`);
    return false;
  }
}

let passed = 0;
let failed = 0;

console.log('\n=== sync-speckit-cursor-skills ===\n');

if (
  test('--check passes when canonical and Cursor mirrors match', () => {
    const r = spawnSync(process.execPath, [script, '--check'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    assert.strictEqual(r.status, 0, r.stderr || r.stdout);
  })
)
  passed++;
else failed++;

if (
  test('sync script is idempotent', () => {
    const r1 = spawnSync(process.execPath, [script], { cwd: repoRoot, encoding: 'utf8' });
    assert.strictEqual(r1.status, 0, r1.stderr || r1.stdout);
    const r2 = spawnSync(process.execPath, [script, '--check'], { cwd: repoRoot, encoding: 'utf8' });
    assert.strictEqual(r2.status, 0, r2.stderr || r2.stdout);
  })
)
  passed++;
else failed++;

console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
