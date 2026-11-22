import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const manifest = JSON.parse(
  await readFile(new URL('../manifest.json', import.meta.url), 'utf8')
);

test('manifest uses the stable Conlanger plugin ID', () => {
  assert.equal(manifest.id, 'conlanger');
  assert.equal(manifest.name, 'Conlanger');
});

test('manifest contains valid release metadata', () => {
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.match(manifest.minAppVersion, /^\d+\.\d+\.\d+$/);
  assert.ok(manifest.description.length > 0);
  assert.equal(typeof manifest.isDesktopOnly, 'boolean');
});

test('plugin entry point registers the stable status command', async () => {
  const source = await readFile(
    new URL('../src/main.ts', import.meta.url),
    'utf8'
  );

  assert.match(source, /id:\s*'show-status'/);
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
