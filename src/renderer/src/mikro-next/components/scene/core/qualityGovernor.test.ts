import { describe, expect, it } from "vitest";
import {
  QualityGovernor,
  QUALITY_PROFILES,
  resolveDpr,
  TIER_HIGH,
  TIER_LOW,
  TIER_MEDIUM,
  type QualityStorage,
} from "./qualityGovernor";

const fakeStorage = (): QualityStorage & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
  };
};

/** Feed `count` frames of `deltaMs`, advancing a fake clock. */
const feed = (
  governor: QualityGovernor,
  deltaMs: number,
  count: number,
  startMs: number,
): number => {
  let now = startMs;
  for (let i = 0; i < count; i++) {
    now += deltaMs;
    governor.recordFrame(deltaMs, now);
  }
  return now;
};

describe("QualityGovernor tier learning", () => {
  it("demotes after sustained slow frames, not from a single spike", () => {
    const g = new QualityGovernor();
    g.recordFrame(200, 0); // one spike (still < idle-gap cutoff)
    expect(g.getTier()).toBe(TIER_HIGH);

    // 18 sustained 40 ms frames: crosses the 15-slow-frame demote threshold
    // exactly once (continued slowness would keep demoting — see next test).
    feed(g, 40, 18, 1000);
    expect(g.getTier()).toBe(TIER_MEDIUM);
  });

  it("keeps demoting to LOW under continued slowness", () => {
    const g = new QualityGovernor();
    feed(g, 40, 200, 0);
    expect(g.getTier()).toBe(TIER_LOW);
  });

  it("ignores idle gaps (demand frameloop) entirely", () => {
    const g = new QualityGovernor();
    feed(g, 1000, 100, 0); // 1 s gaps between demand frames
    expect(g.getTier()).toBe(TIER_HIGH);
    expect(g.getEmaMs()).toBe(0);
  });

  it("promotes only after sustained fast frames AND the post-demote cooldown", () => {
    const g = new QualityGovernor();
    const afterDemote = feed(g, 40, 18, 0);
    expect(g.getTier()).toBe(TIER_MEDIUM);

    // Fast frames immediately after the demote: cooldown blocks promotion.
    const afterFast = feed(g, 8, 200, afterDemote);
    expect(g.getTier()).toBe(TIER_MEDIUM);

    // Past the cooldown, sustained fast frames promote.
    feed(g, 8, 200, afterFast + 31_000);
    expect(g.getTier()).toBe(TIER_HIGH);
  });

  it("manual override wins over the learned tier and persists", () => {
    const storage = fakeStorage();
    const g = new QualityGovernor();
    g.configurePersistence(storage, "gpu-x");
    g.setOverride(TIER_LOW);
    feed(g, 8, 500, 40_000); // fast frames must not change the effective tier
    expect(g.getTier()).toBe(TIER_LOW);

    const g2 = new QualityGovernor();
    g2.configurePersistence(storage, "gpu-x");
    expect(g2.getOverride()).toBe(TIER_LOW);
  });

  it("persists the learned tier per GPU key and reloads it", () => {
    const storage = fakeStorage();
    const g = new QualityGovernor();
    g.configurePersistence(storage, "apple-m2");
    feed(g, 40, 18, 0);
    expect(g.getAutoTier()).toBe(TIER_MEDIUM);

    const next = new QualityGovernor();
    next.configurePersistence(storage, "apple-m2");
    expect(next.getAutoTier()).toBe(TIER_MEDIUM);

    const other = new QualityGovernor();
    other.configurePersistence(storage, "some-dgpu");
    expect(other.getAutoTier()).toBe(TIER_HIGH);
  });

  it("notifies subscribers on tier and streaming flips only", () => {
    const g = new QualityGovernor();
    let notifications = 0;
    g.subscribe(() => notifications++);

    g.setStreaming(true);
    g.setStreaming(true); // no-op
    expect(notifications).toBe(1);

    feed(g, 40, 18, 0); // one demote
    expect(notifications).toBe(2);

    feed(g, 16, 50, 10_000); // mid-band frames: no notifications
    expect(notifications).toBe(2);
  });
});

describe("resolveDpr", () => {
  it("HIGH never regresses", () => {
    expect(resolveDpr(QUALITY_PROFILES[TIER_HIGH], 2, true)).toBe(2);
    expect(resolveDpr(QUALITY_PROFILES[TIER_HIGH], 2, false)).toBe(2);
  });

  it("MEDIUM halves active frames, keeps settled crisp", () => {
    expect(resolveDpr(QUALITY_PROFILES[TIER_MEDIUM], 2, true)).toBe(1);
    expect(resolveDpr(QUALITY_PROFILES[TIER_MEDIUM], 2, false)).toBe(2);
  });

  it("LOW caps active at 1 and settled at 1.5, never below 1", () => {
    expect(resolveDpr(QUALITY_PROFILES[TIER_LOW], 2, true)).toBe(1);
    expect(resolveDpr(QUALITY_PROFILES[TIER_LOW], 2, false)).toBe(1.5);
    expect(resolveDpr(QUALITY_PROFILES[TIER_LOW], 1, false)).toBe(1);
    expect(resolveDpr(QUALITY_PROFILES[TIER_LOW], 1, true)).toBe(1);
  });
});
