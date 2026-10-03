export interface VerticalSpan {
  top: number;
  bottom: number;
}

/**
 * Picks the card that j (delta 1) or k (delta -1) should focus next.
 *
 * Continues from the focused card while it is still on screen; otherwise
 * (nothing focused yet, or the user scrolled away) anchors to what is visible
 * instead of jumping back to where the old focus was.
 */
export function pickCardIndex(
  cards: readonly VerticalSpan[],
  viewport: VerticalSpan,
  focusedIndex: number,
  delta: 1 | -1
): number {
  if (cards.length === 0) return -1;
  const last = cards.length - 1;

  const focused = cards[focusedIndex];
  if (focused && focused.bottom > viewport.top && focused.top < viewport.bottom) {
    return Math.min(Math.max(focusedIndex + delta, 0), last);
  }

  if (delta > 0) {
    // First card that starts at or below the top edge of the viewport.
    const index = cards.findIndex((card) => card.top >= viewport.top);
    return index >= 0 ? index : last;
  }
  // Last card that ends at or above the bottom edge of the viewport.
  for (let i = last; i >= 0; i--) {
    if (cards[i]!.bottom <= viewport.bottom) return i;
  }
  return 0;
}
