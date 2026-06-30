/**
 * Tests for scripts/lib/install/rewrite-namespace-links.js (#2340)
 */

const assert = require('assert');

const { rewriteNamespaceLinks } = require('../../scripts/lib/install/rewrite-namespace-links');

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

function runTests() {
  console.log('\n=== Testing rewrite-namespace-links.js ===\n');

  let passed = 0;
  let failed = 0;

  if (test('rewrites a markdown link to a sibling rules dir', () => {
    assert.strictEqual(
      rewriteNamespaceLinks('See [hooks](../../rules/react/hooks.md) here', 'ecc'),
      'See [hooks](../../../rules/ecc/react/hooks.md) here'
    );
  })) passed++; else failed++;

  if (test('rewrites a bare rules dir link', () => {
    assert.strictEqual(
      rewriteNamespaceLinks('Rules: [r](../../rules/react/)', 'ecc'),
      'Rules: [r](../../../rules/ecc/react/)'
    );
  })) passed++; else failed++;

  if (test('handles deeper skill nesting (3+ climbs)', () => {
    assert.strictEqual(
      rewriteNamespaceLinks('link ../../../rules/x/y.md', 'ecc'),
      'link ../../../../rules/ecc/x/y.md'
    );
  })) passed++; else failed++;

  if (test('leaves intra-skill single-climb links untouched', () => {
    const input = 'See ../sibling/file.md and ./local.md';
    assert.strictEqual(rewriteNamespaceLinks(input, 'ecc'), input);
  })) passed++; else failed++;

  if (test('is idempotent on already-namespaced links', () => {
    const input = 'See [x](../../../rules/ecc/react/hooks.md)';
    assert.strictEqual(rewriteNamespaceLinks(input, 'ecc'), input);
  })) passed++; else failed++;

  if (test('rewrites multiple links in one document', () => {
    assert.strictEqual(
      rewriteNamespaceLinks('(../../rules/a) and (../../rules/b)', 'ecc'),
      '(../../../rules/ecc/a) and (../../../rules/ecc/b)'
    );
  })) passed++; else failed++;

  if (test('rewrites sibling skills-dir links symmetrically', () => {
    assert.strictEqual(
      rewriteNamespaceLinks('[s](../../skills/other/SKILL.md)', 'ecc'),
      '[s](../../../skills/ecc/other/SKILL.md)'
    );
  })) passed++; else failed++;

  if (test('returns input unchanged when namespace is missing', () => {
    const input = 'See [x](../../rules/react/)';
    assert.strictEqual(rewriteNamespaceLinks(input, ''), input);
  })) passed++; else failed++;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
