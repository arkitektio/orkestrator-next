// @vitest-environment jsdom
import { act, render, waitFor } from "@testing-library/react";
import { usePullToRefetch } from "./use-pull-to-refetch";

/**
 * Renders a real scrollable div wired to the hook, and exposes handles to drive
 * it. jsdom never lays out, so `scrollTop` is a plain writable property here —
 * which is exactly what we need to fake "at the top" vs "scrolled down".
 */
const setup = (refetch?: () => Promise<unknown>) => {
  const seen: { pull: number; progress: number; refreshing: boolean }[] = [];

  const Harness = () => {
    const { ref, pull, progress, refreshing } = usePullToRefetch(refetch);
    seen.push({ pull, progress, refreshing });
    return (
      <div ref={ref} data-testid="scroller">
        <div data-testid="indicator">{refreshing ? "spinning" : ""}</div>
      </div>
    );
  };

  const view = render(<Harness />);
  const el = view.getByTestId("scroller");

  const wheel = (deltaY: number) =>
    act(() => {
      el.dispatchEvent(new WheelEvent("wheel", { deltaY, bubbles: true }));
    });

  const touch = (type: string, clientY: number) =>
    act(() => {
      const e = new Event(type, { bubbles: true }) as any;
      e.touches = type === "touchend" ? [] : [{ clientY }];
      el.dispatchEvent(e);
    });

  const pause = (ms: number) => act(() => new Promise((r) => setTimeout(r, ms)));

  return {
    el,
    wheel,
    touch,
    pause,
    seen,
    latest: () => seen[seen.length - 1],
    scrollTo: (top: number) =>
      act(() => {
        el.scrollTop = top;
        el.dispatchEvent(new Event("scroll", { bubbles: true }));
      }),
  };
};

describe("usePullToRefetch", () => {
  it("fires refetch once the wheel overscroll passes the threshold", async () => {
    const refetch = vi.fn().mockResolvedValue({});
    const { wheel } = setup(refetch);

    // One big pull past the resisted threshold.
    wheel(-300);

    await waitFor(() => expect(refetch).toHaveBeenCalledTimes(1));
  });

  it("does not fire on a small pull", () => {
    const refetch = vi.fn().mockResolvedValue({});
    const { wheel, latest } = setup(refetch);

    wheel(-10);

    expect(refetch).not.toHaveBeenCalled();
    // ...but the indicator has started to follow the gesture.
    expect(latest().pull).toBeGreaterThan(0);
  });

  it("ignores the gesture while the container is scrolled away from the top", () => {
    const refetch = vi.fn().mockResolvedValue({});
    const { wheel, scrollTo, latest } = setup(refetch);

    scrollTo(500);
    wheel(-300);

    expect(refetch).not.toHaveBeenCalled();
    expect(latest().pull).toBe(0);
  });

  it("ignores downward wheel movement", () => {
    const refetch = vi.fn().mockResolvedValue({});
    const { wheel, latest } = setup(refetch);

    wheel(300);

    expect(refetch).not.toHaveBeenCalled();
    expect(latest().pull).toBe(0);
  });

  it("shows the spinner while refetching and clears it when done", async () => {
    let resolve!: () => void;
    const refetch = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    const { wheel, latest } = setup(refetch);

    wheel(-300);
    await waitFor(() => expect(latest().refreshing).toBe(true));

    await act(async () => {
      resolve();
    });
    await waitFor(() => expect(latest().refreshing).toBe(false));
    expect(latest().pull).toBe(0);
  });

  it("stops the spinner when the refetch rejects", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const refetch = vi.fn().mockRejectedValue(new Error("backend down"));
    const { wheel, latest } = setup(refetch);

    wheel(-300);

    await waitFor(() => expect(refetch).toHaveBeenCalled());
    await waitFor(() => expect(latest().refreshing).toBe(false));
    expect(latest().pull).toBe(0);
    warn.mockRestore();
  });

  it("does not re-enter while a refetch is already in flight", async () => {
    let resolve!: () => void;
    const refetch = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    const { wheel, latest } = setup(refetch);

    wheel(-300);
    await waitFor(() => expect(latest().refreshing).toBe(true));
    wheel(-300);
    wheel(-300);

    expect(refetch).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolve();
    });
  });

  it("does not fire until the wheel gesture settles", async () => {
    const refetch = vi.fn().mockResolvedValue({});
    const { wheel, latest } = setup(refetch);

    wheel(-300);

    // Well past the threshold, but the gesture is still in flight.
    expect(latest().progress).toBeGreaterThan(1);
    expect(refetch).not.toHaveBeenCalled();

    await waitFor(() => expect(refetch).toHaveBeenCalledTimes(1));
  });

  it("does not arm when the pull is a continuation of scrolling up to the top", async () => {
    const refetch = vi.fn().mockResolvedValue({});
    const { wheel, scrollTo, latest, pause } = setup(refetch);

    // Scrolling up from mid-page...
    scrollTo(500);
    wheel(-100);
    // ...reaching the top, with the same gesture still emitting deltas.
    scrollTo(0);
    wheel(-300);
    wheel(-300);

    await pause(250);
    expect(refetch).not.toHaveBeenCalled();
    expect(latest().pull).toBe(0);
  });

  it("arms once a fresh gesture starts after a pause at the top", async () => {
    const refetch = vi.fn().mockResolvedValue({});
    const { wheel, scrollTo, pause } = setup(refetch);

    scrollTo(500);
    wheel(-100);
    scrollTo(0);
    wheel(-300);

    // The user stops, then deliberately pulls again.
    await pause(300);
    wheel(-300);

    await waitFor(() => expect(refetch).toHaveBeenCalledTimes(1));
  });

  it("ignores the momentum tail after a refetch fires", async () => {
    const refetch = vi.fn().mockResolvedValue({});
    const { wheel, pause } = setup(refetch);

    wheel(-300);
    await waitFor(() => expect(refetch).toHaveBeenCalledTimes(1));

    // Inertia keeps delivering deltas right after the query went out.
    wheel(-300);
    wheel(-300);

    await pause(250);
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("does not re-fire during the cooldown after a refetch", async () => {
    const refetch = vi.fn().mockResolvedValue({});
    const { wheel, pause } = setup(refetch);

    // Fires ~70ms in (SETTLE_MS), so the cooldown runs to roughly 470ms.
    wheel(-300);
    await pause(350);
    expect(refetch).toHaveBeenCalledTimes(1);

    // A fresh gesture by the gap rule, but still inside the cooldown — so only
    // the cooldown can be what holds this back.
    wheel(-300);
    await pause(200);

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("fires again once the cooldown has passed", async () => {
    const refetch = vi.fn().mockResolvedValue({});
    const { wheel, pause } = setup(refetch);

    wheel(-300);
    await pause(700);
    expect(refetch).toHaveBeenCalledTimes(1);

    wheel(-300);

    await waitFor(() => expect(refetch).toHaveBeenCalledTimes(2));
  });

  it("stays inert when no refetch is published", () => {
    const { wheel, latest } = setup(undefined);

    wheel(-300);

    expect(latest().pull).toBe(0);
    expect(latest().refreshing).toBe(false);
  });

  it("fires on a touch drag past the threshold and resets on a short drag", async () => {
    const refetch = vi.fn().mockResolvedValue({});
    const { touch, latest } = setup(refetch);

    // Short drag: released below threshold, so it resets without firing.
    touch("touchstart", 0);
    touch("touchmove", 10);
    touch("touchend", 10);
    expect(refetch).not.toHaveBeenCalled();
    expect(latest().pull).toBe(0);

    // Long drag past the threshold.
    touch("touchstart", 0);
    touch("touchmove", 150);
    touch("touchmove", 300);
    touch("touchend", 300);

    await waitFor(() => expect(refetch).toHaveBeenCalledTimes(1));
  });
});
