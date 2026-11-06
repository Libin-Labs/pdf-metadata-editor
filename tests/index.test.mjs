import test from 'node:test';
import assert from 'node:assert/strict';
import { createPdfMetadataEditor } from '../dist/esm/index.js';

test('updates and removes bounded Info dictionary fields', () => {
  const metadata = createPdfMetadataEditor();
  metadata.set({
    title: 'Review',
    author: 'A. Reader',
    keywords: 'draft, internal',
  });
  assert.equal(metadata.snapshot().author, 'A. Reader');
  metadata.remove('author');
  assert.equal(metadata.snapshot().author, undefined);
});

test('generates escaped deterministic XMP description from the same model', () => {
  const metadata = createPdfMetadataEditor();
  metadata.set({ title: 'A < B & C', subject: 'Quote "this"' });
  const xmp = metadata.toXmpDescription();
  assert.match(xmp, /A &lt; B &amp; C/);
  assert.match(xmp, /Quote &quot;this&quot;/);
  assert.ok(xmp.indexOf('<lp:subject>') < xmp.indexOf('<lp:title>'));
});

test('rejects unknown keys and oversized values without partially updating', () => {
  const metadata = createPdfMetadataEditor(2, 5);
  metadata.set({ title: 'first' });
  assert.throws(() => metadata.set({ author: 'valid', subject: 'too long' }), {
    code: 'limit',
  });
  assert.deepEqual(metadata.snapshot(), { title: 'first' });
  assert.throws(() => metadata.set({ producer: 'ok', unknown: 'x' }), {
    code: 'invalid',
  });
});
