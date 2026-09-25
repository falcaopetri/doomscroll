import assert from 'node:assert/strict';
import test from 'node:test';
import { attachmentLabel, isImagePath } from '../src/media.ts';

test('recognizes supported standalone image paths', () => {
  assert.equal(isImagePath('Reference Images/diagram.PNG'), true);
  assert.equal(isImagePath('Reference Images/diagram.pdf'), false);
  assert.equal(isImagePath('diagram.png?width=400'), true);
});

test('labels standalone attachments by extension', () => {
  assert.equal(attachmentLabel('Reference Images/diagram.png'), '📎 PNG attached');
  assert.equal(attachmentLabel('README'), '📎 File attached');
});
