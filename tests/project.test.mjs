import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const manifest = JSON.parse(
  await readFile(new URL('../manifest.json', import.meta.url), 'utf8')
);

const modelSource = await readFile(
  new URL('../src/language-model.ts', import.meta.url),
  'utf8'
);
const modelJavaScript = ts.transpileModule(modelSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2021
  }
}).outputText;
const modelUrl = `data:text/javascript;base64,${Buffer.from(modelJavaScript).toString('base64')}`;
const { slugifyLanguageName, buildLanguageNote } = await import(modelUrl);

test('manifest uses a stable, directory-compatible plugin identity', () => {
  assert.equal(manifest.id, 'conlanger');
  assert.equal(manifest.name, 'Conlanger');
  assert.match(manifest.id, /^[a-z-]+$/);
  assert.ok(!manifest.id.includes('obsidian'));
  assert.ok(!manifest.id.endsWith('plugin'));
});

test('manifest contains all required metadata in valid formats', () => {
  assert.match(manifest.version, /^\\d+\\.\\d+\\.\\d+$/);
  assert.match(manifest.minAppVersion, /^\\d+\\.\\d+\\.\\d+$/);
  assert.ok(manifest.author.trim().length > 0);
  assert.ok(manifest.description.length > 0);
  assert.ok(manifest.description.length <= 250);
  assert.ok(manifest.description.endsWith('.'));
  assert.equal(typeof manifest.isDesktopOnly, 'boolean');
});

test('language names become safe, readable folder identifiers', () => {
  assert.equal(slugifyLanguageName('  Old Vareli!! '), 'old-vareli');
  assert.equal(slugifyLanguageName('ภาษา ใหม่'), 'ภาษา-ใหม่');
  assert.equal(slugifyLanguageName('   '), 'language');
});

test('language notes contain minimal versioned metadata and preserve names', () => {
  const note = buildLanguageNote('A "New" Language', 'a-new-language', '2026-11-23T00:00:00.000Z');

  assert.match(note, /^---\\n/);
  assert.match(note, /conlanger_type: language/);
  assert.match(note, /conlanger_schema: 1/);
  assert.match(note, /name: "A \\"New\\" Language"/);
  assert.match(note, /language_id: "a-new-language"/);
  assert.match(note, /status: draft/);
  assert.match(note, /# A "New" Language/);
});

test('plugin registers the language creation command and uses vault-native storage', async () => {
  const source = await readFile(
    new URL('../src/main.ts', import.meta.url),
    'utf8'
  );
  const modal = await readFile(
    new URL('../src/language-creation-modal.ts', import.meta.url),
    'utf8'
  );

  assert.match(source, /id: 'create-language'/);
  assert.match(source, /this\\.app\\.vault\\.createFolder/);
  assert.match(source, /this\\.app\\.vault\\.create\\(/);
  assert.match(modal, /setTitle\\('Create a language'\\)/);
  assert.doesNotMatch(source, /show-status/);
});

test('production bundle is generated', async () => {
  const bundle = await readFile(
    new URL('../main.js', import.meta.url),
    'utf8'
  );

  assert.ok(bundle.length > 0);
  assert.match(bundle, /create-language/);
});
