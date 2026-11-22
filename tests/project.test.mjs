import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const manifest = JSON.parse(
  await readFile(new URL('../manifest.json', import.meta.url), 'utf8')
);

test('manifest uses a stable, directory-compatible plugin identity', () => {
  assert.equal(manifest.id, 'conlanger');
  assert.equal(manifest.name, 'Conlanger');
  assert.match(manifest.id, /^[a-z-]+$/);
  assert.ok(!manifest.id.includes('obsidian'));
  assert.ok(!manifest.id.endsWith('plugin'));
});

test('manifest contains all required metadata in valid formats', () => {
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.match(manifest.minAppVersion, /^\d+\.\d+\.\d+$/);
  assert.ok(manifest.author.trim().length > 0);
  assert.ok(manifest.description.length > 0);
  assert.ok(manifest.description.length <= 250);
  assert.ok(manifest.description.endsWith('.'));
  assert.equal(typeof manifest.isDesktopOnly, 'boolean');
});

test('plugin entry point registers a command without duplicating its plugin ID', async () => {
  const source = await readFile(
    new URL('../src/main.ts', import.meta.url),
    'utf8'
  );

  assert.match(source, /id:\s*'show-status'/);
  assert.doesNotMatch(source, /id:\s*'conlanger-show-status'/);
  assert.match(source, /this\.addCommand\(/);
});

test('production bundle is generated', async () => {
  const bundle = await readFile(
    new URL('../main.js', import.meta.url),
    'utf8'
  );

  assert.ok(bundle.length > 0);
  assert.match(bundle, /show-status/);
});
