import assert from 'node:assert/strict';
import test from 'node:test';
import { pickCardIndex } from '../src/navigation.ts';

// Three 300px cards stacked from y=0, 20px apart.
const cards = [
  { top: 0, bottom: 300 },
  { top: 320, bottom: 620 },
  { top: 640, bottom: 940 },
];
const shift = (dy: number) =>
  cards.map((card) => ({ top: card.top - dy, bottom: card.bottom - dy }));

test('with nothing focused, j picks the first card and k the last', () => {
  const viewport = { top: 0, bottom: 1000 };
  assert.equal(pickCardIndex(cards, viewport, -1, 1), 0);
  assert.equal(pickCardIndex(cards, viewport, -1, -1), 2);
});

test('moves one card from the focused card while it is on screen', () => {
  const viewport = { top: 0, bottom: 700 };
  assert.equal(pickCardIndex(cards, viewport, 0, 1), 1);
  assert.equal(pickCardIndex(cards, viewport, 1, -1), 0);
});

test('clamps at both ends', () => {
  const viewport = { top: 0, bottom: 1000 };
  assert.equal(pickCardIndex(cards, viewport, 2, 1), 2);
  assert.equal(pickCardIndex(cards, viewport, 0, -1), 0);
});

test('after scrolling away from the focus, j continues from what is visible', () => {
  // Card 0 is focused, but the user scrolled so card 2 fills the viewport.
  const scrolled = shift(650);
  const viewport = { top: 0, bottom: 400 };
  assert.equal(pickCardIndex(scrolled, viewport, 0, 1), 2);
});

test('after scrolling away from the focus, k picks the last card fully above the bottom edge', () => {
  const scrolled = shift(650);
  const viewport = { top: 0, bottom: 400 };
  assert.equal(pickCardIndex(scrolled, viewport, 0, -1), 2);
});

test('j skips a card that is only partly visible at the top', () => {
  const scrolled = shift(150); // card 0 is cut off above the viewport
  const viewport = { top: 0, bottom: 400 };
  assert.equal(pickCardIndex(scrolled, viewport, -1, 1), 1);
});
