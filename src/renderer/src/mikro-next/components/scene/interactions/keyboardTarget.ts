/**
 * Structural (not `instanceof HTMLElement`) so it stays testable in vitest's
 * default node environment — and so it keeps working for elements coming from
 * another document/realm.
 */
export const isTypingTarget = (
  target: { tagName?: string; isContentEditable?: boolean } | null | undefined,
): boolean => {
  if (!target) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
};
