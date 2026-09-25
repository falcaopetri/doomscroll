import assert from 'node:assert/strict';
import test from 'node:test';
import {
  attachmentLabel,
  isImagePath,
  isPdfPath,
  isVideoPath,
} from '../src/media.ts';

test('recognizes supported standalone image paths', () => {
  assert.equal(isImagePath('Reference Images/diagram.PNG'), true);
  assert.equal(isImagePath('Reference Images/diagram.pdf'), false);
  assert.equal(isImagePath('diagram.png?width=400'), true);
});

test('labels standalone attachments by extension', () => {
  assert.equal(attachmentLabel('Reference Images/diagram.png'), '');
  assert.equal(attachmentLabel('README'), '📎 File attached');
  assert.equal(attachmentLabel('Reference/handout.pdf'), '');
});

test('recognizes PDF paths for inline previews', () => {
  assert.equal(isPdfPath('Documents/guide.PDF'), true);
  assert.equal(isPdfPath('Documents/guide.pdf?view=1'), true);
  assert.equal(isPdfPath('Documents/guide.epub'), false);
});

test('recognizes browser-friendly video paths for inline previews', () => {
  assert.equal(isVideoPath('Clips/demo.mp4'), true);
  assert.equal(isVideoPath('Clips/demo.WEBM'), true);
  assert.equal(isVideoPath('Clips/demo.mkv'), false);
  assert.equal(attachmentLabel('Clips/demo.mp4'), '');
});
