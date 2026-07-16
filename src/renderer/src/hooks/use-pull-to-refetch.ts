import { useCallback, useEffect, useRef, useState } from "react";

/** Raw wheel distance that arms a refetch. Deliberately high — a trackpad flick
 *  emits hundreds of pixels of delta in one go. */
const WHEEL_RAW_THRESHOLD = 260;
/** Raw finger travel that arms a refetch. Much shorter: a touch drag is 1:1. */
const TOUCH_RAW_THRESHOLD = 90;
/** The indicator's travel asymptotically approaches this. */
const MAX_PULL = 160;
/** A pull must start after a pause this long, so a wheel gesture that merely
 *  scrolled up to the top can't roll straight on into a refetch. */
const NEW_GESTURE_GAP_MS = 250;
/** Debounce: decide once the wheel has gone quiet. Short enough to feel
 *  immediate — the gap check above, not this, is what stops false triggers. */
const SETTLE_MS = 70;
/** After a refetch, briefly ignore further pulls rather than firing again. */
const COOLDOWN_MS = 400;

/** Asymptotic curve: the further you pull, the less the indicator moves. */
const resist = (raw: number) => MAX_PULL * (1 - MAX_PULL / (raw + MAX_PULL));

export type PullState = {
  /** Indicator travel in px, after resistance. */
  pull: number;
  /** 0..1+ — how close the gesture is to firing. */
  progress: number;
};

const IDLE: PullState = { pull: 0, progress: 0 };

/**
 * Pull down past the top of a scroll container to re-run its query.
 *
 * Attaches nothing when `refetch` is undefined, so containers that publish no
 * refetch keep their plain scrolling behaviour.
 */
export const usePullToRefetch = (refetch?: () => Promise<unknown>) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PullState>(IDLE);
  const [refreshing, setRefreshing] = useState(false);

  const rawRef = useRef(0);
  const refreshingRef = useRef(false);
  const cooldownUntilRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reset = useCallback(() => {
    rawRef.current = 0;
    setState(IDLE);
  }, []);

  const trigger = useCallback(async () => {
    if (!refetch || refreshingRef.current) return;
    refreshingRef.current = true;
    setRefreshing(true);
    setState(IDLE);
    rawRef.current = 0;
    try {
      await refetch();
    } catch (e) {
      // The query result surfaces the error; the gesture only owns the spinner.
      console.warn("Pull to refetch failed", e);
    } finally {
      refreshingRef.current = false;
      cooldownUntilRef.current = performance.now() + COOLDOWN_MS;
      if (mountedRef.current) {
        setRefreshing(false);
        setState(IDLE);
      }
    }
  }, [refetch]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !refetch) return;

    let settleTimer: number | undefined;
    let lastWheelAt = -Infinity;
    let armed = false;
    let touchStartY: number | undefined;

    const advance = (delta: number, rawThreshold: number) => {
      rawRef.current += delta;
      setState({
        pull: resist(rawRef.current),
        progress: rawRef.current / rawThreshold,
      });
    };

    const disarm = () => {
      armed = false;
      window.clearTimeout(settleTimer);
      reset();
    };

    // Debounced decision: the gesture is over, so commit or let go.
    const settle = () => {
      armed = false;
      if (rawRef.current >= WHEEL_RAW_THRESHOLD) void trigger();
      else reset();
    };

    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const gap = now - lastWheelAt;
      lastWheelAt = now;

      if (refreshingRef.current || now < cooldownUntilRef.current) return;

      // Only pull when already at the top and moving downward.
      if (el.scrollTop > 0 || e.deltaY >= 0) {
        if (armed) disarm();
        return;
      }

      // A pull must be its own gesture, not the tail of a scroll that just
      // happened to reach the top (and not that scroll's momentum).
      if (!armed) {
        if (gap < NEW_GESTURE_GAP_MS) return;
        armed = true;
      }

      advance(-e.deltaY, WHEEL_RAW_THRESHOLD);

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_MS);
    };

    const onTouchStart = (e: TouchEvent) => {
      // touchstart already delimits the gesture, so no gap heuristic needed.
      touchStartY = el.scrollTop <= 0 ? e.touches[0]?.clientY : undefined;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY === undefined || refreshingRef.current) return;
      const y = e.touches[0]?.clientY;
      if (y === undefined) return;

      const delta = y - touchStartY;
      touchStartY = y;
      if (delta <= 0 && rawRef.current <= 0) return;

      advance(delta, TOUCH_RAW_THRESHOLD);
    };

    const onTouchEnd = () => {
      touchStartY = undefined;
      if (refreshingRef.current) return;
      if (rawRef.current >= TOUCH_RAW_THRESHOLD) void trigger();
      else reset();
    };

    const onScroll = () => {
      if (el.scrollTop > 0 && armed) disarm();
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(settleTimer);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("scroll", onScroll);
    };
  }, [refetch, trigger, reset]);

  return {
    ref,
    pull: state.pull,
    progress: state.progress,
    refreshing,
    enabled: !!refetch,
  };
};
