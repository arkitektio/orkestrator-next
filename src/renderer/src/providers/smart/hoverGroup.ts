import { useSyncExternalStore } from "react";

/**
 * Shared "skip delay" group for SmartModel hover cards.
 *
 * The very first hover waits the full openDelay. Once a card is open the group
 * is considered "warm", so hovering other items opens them almost instantly.
 * After the last open card closes the group stays warm for `SKIP_DELAY_MS` and
 * then resets back to the slow delay — mirroring the behaviour of native
 * tooltips and Radix's Tooltip.Provider skipDelayDuration.
 */
const SKIP_DELAY_MS = 400;

type Listener = () => void;

let active = false;
let openCount = 0;
let resetTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

const setActive = (next: boolean) => {
  if (active === next) {
    return;
  }
  active = next;
  emit();
};

const clearResetTimer = () => {
  if (resetTimer) {
    clearTimeout(resetTimer);
    resetTimer = null;
  }
};

/** Call when a hover card opens. */
export const enterHoverGroup = () => {
  openCount += 1;
  clearResetTimer();
  setActive(true);
};

/** Call when a hover card closes. */
export const leaveHoverGroup = () => {
  openCount = Math.max(0, openCount - 1);
  if (openCount > 0) {
    return;
  }
  clearResetTimer();
  resetTimer = setTimeout(() => {
    resetTimer = null;
    setActive(false);
  }, SKIP_DELAY_MS);
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => active;

/** Subscribe to whether the hover group is currently warm. */
export const useHoverGroupActive = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
