/**
 * GPU-adaptive quality governor (P19).
 *
 * Most render-quality settings were dGPU-calibrated constants; integrated GPUs
 * (Apple M2 et al.) need lower tiers, and the jank window is not just camera
 * motion — post-gesture STREAMING frames (each residency bump renders a
 * full-quality frame) recur for seconds. The governor learns the machine's
 * tier from sustained frame times and drives every quality knob from one
 * profile table; "active" (camera moving OR bricks streaming) frames use the
 * cheaper column, settled frames the crisper one.
 *
 * Pure logic + injected persistence (localStorage keyed per GPU renderer
 * string), so a machine starts at its learned tier on the next session.
 * Hysteresis: demote fast (sustained slow EMA), promote slowly (sustained
 * fast EMA + cooldown since the last demote) — no oscillation.
 *
 * Module singleton like `perfMonitor`; consumers subscribe via
 * `useSyncExternalStore(governor.subscribe, () => governor.getVersion())`
 * (tier/streaming flips are rare — P17-clean) or read imperatively
 * (`getProfile()` in `drainUploads`).
 */

export type QualityTier = 0 | 1 | 2;
export const TIER_HIGH: QualityTier = 0;
export const TIER_MEDIUM: QualityTier = 1;
export const TIER_LOW: QualityTier = 2;
export const TIER_LABELS: Record<QualityTier, string> = {
  0: "High",
  1: "Medium",
  2: "Low",
};

export type QualityProfile = {
  /** Settled frames render at min(initialDpr, settledDprCap). */
  settledDprCap: number;
  /** Active frames render at clamp(initialDpr · activeDprScale, 1, activeDprCap). */
  activeDprScale: number;
  activeDprCap: number;
  /** 3D raymarch step multipliers (shader `uStepScale`). */
  settledStepScale: number;
  activeStepScale: number;
  /** drainUploads wall-clock budget per frame. */
  uploadBudgetMs: number;
  /** Concurrent brick fetches per layer. */
  maxInflightBricks: number;
  /** residencyVersion bump throttle while streaming. */
  residencyBumpMs: number;
};

export const QUALITY_PROFILES: Record<QualityTier, QualityProfile> = {
  [TIER_HIGH]: {
    settledDprCap: Number.POSITIVE_INFINITY,
    activeDprScale: 1,
    activeDprCap: Number.POSITIVE_INFINITY,
    settledStepScale: 1,
    activeStepScale: 2,
    uploadBudgetMs: 4,
    maxInflightBricks: 12,
    residencyBumpMs: 150,
  },
  [TIER_MEDIUM]: {
    settledDprCap: Number.POSITIVE_INFINITY,
    activeDprScale: 0.5,
    activeDprCap: Number.POSITIVE_INFINITY,
    settledStepScale: 1,
    activeStepScale: 2.5,
    uploadBudgetMs: 3,
    maxInflightBricks: 12,
    residencyBumpMs: 150,
  },
  [TIER_LOW]: {
    settledDprCap: 1.5,
    activeDprScale: 0.5,
    activeDprCap: 1,
    settledStepScale: 1.5,
    activeStepScale: 3,
    uploadBudgetMs: 2,
    maxInflightBricks: 6,
    residencyBumpMs: 300,
  },
};

/** DPR for the current activity state, derived from a profile. */
export function resolveDpr(
  profile: QualityProfile,
  initialDpr: number,
  active: boolean,
): number {
  if (!active) return Math.min(initialDpr, profile.settledDprCap);
  return Math.min(
    profile.activeDprCap,
    Math.max(1, initialDpr * profile.activeDprScale),
  );
}

/** Frame delta above this counts toward demotion (≈ can't hold ~40 fps). */
const DEMOTE_FRAME_MS = 24;
/** Frame delta below this counts toward promotion (≈ comfortably >80 fps). */
const PROMOTE_FRAME_MS = 12;
const EMA_WINDOW = 20;
/** Deltas above this are demand-frameloop idle gaps, not frame cost. */
const MAX_CONTINUOUS_DELTA_MS = 250;
const DEMOTE_AFTER_SLOW_FRAMES = 15;
const PROMOTE_AFTER_FAST_FRAMES = 120;
const PROMOTE_COOLDOWN_MS = 30_000;

export type QualityStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const clampTier = (value: number): QualityTier =>
  Math.min(2, Math.max(0, Math.round(value))) as QualityTier;

export class QualityGovernor {
  private autoTier: QualityTier = TIER_HIGH;
  private override: QualityTier | null = null;
  private emaMs = 0;
  private slowFrames = 0;
  private fastFrames = 0;
  private lastDemoteAt = Number.NEGATIVE_INFINITY;
  private streaming = false;
  private version = 0;
  private readonly listeners = new Set<() => void>();
  private storage: QualityStorage | null = null;
  private storageKey: string | null = null;

  // --- subscription (rare notifications: tier/override/streaming flips) ----
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getVersion(): number {
    return this.version;
  }

  private emit(): void {
    this.version += 1;
    for (const listener of this.listeners) listener();
  }

  // --- persistence ----------------------------------------------------------
  /** Wire persistence and load the learned tier/override for this GPU. */
  configurePersistence(storage: QualityStorage, gpuKey: string): void {
    this.storage = storage;
    this.storageKey = `scene-quality-tier:${gpuKey}`;
    try {
      const raw = storage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { tier?: number; override?: number | null };
        if (typeof parsed.tier === "number") this.autoTier = clampTier(parsed.tier);
        this.override =
          typeof parsed.override === "number" ? clampTier(parsed.override) : null;
        this.emit();
      }
    } catch {
      /* corrupted entry — start fresh */
    }
  }

  private persist(): void {
    if (!this.storage || !this.storageKey) return;
    try {
      this.storage.setItem(
        this.storageKey,
        JSON.stringify({ tier: this.autoTier, override: this.override }),
      );
    } catch {
      /* storage full/unavailable — non-fatal */
    }
  }

  // --- state ----------------------------------------------------------------
  getTier(): QualityTier {
    return this.override ?? this.autoTier;
  }

  getAutoTier(): QualityTier {
    return this.autoTier;
  }

  getOverride(): QualityTier | null {
    return this.override;
  }

  getProfile(): QualityProfile {
    return QUALITY_PROFILES[this.getTier()];
  }

  getEmaMs(): number {
    return this.emaMs;
  }

  setOverride(tier: QualityTier | null): void {
    if (tier === this.override) return;
    this.override = tier;
    this.persist();
    this.emit();
  }

  isStreaming(): boolean {
    return this.streaming;
  }

  /** Edge events from the residency manager's drain loop. */
  setStreaming(streaming: boolean): void {
    if (streaming === this.streaming) return;
    this.streaming = streaming;
    this.emit();
  }

  // --- learning -------------------------------------------------------------
  /**
   * Feed one frame delta (ms). `nowMs` is injectable for tests.
   *
   * Streaks are counted on the DELTAS themselves (consecutive slow / fast
   * frames), not on the EMA: after a demote the EMA still reflects the OLD
   * tier's cost and would cascade further demotes before the cheaper tier had
   * a chance to prove itself. One in-band or opposite frame resets a streak —
   * demotion needs 15 genuinely consecutive slow frames, promotion 120
   * consecutive fast ones plus the post-demote cooldown. The EMA remains for
   * display/telemetry.
   */
  recordFrame(deltaMs: number, nowMs: number = performance.now()): void {
    if (deltaMs <= 0 || deltaMs >= MAX_CONTINUOUS_DELTA_MS) return;
    this.emaMs =
      this.emaMs === 0 ? deltaMs : this.emaMs + (deltaMs - this.emaMs) / EMA_WINDOW;

    if (deltaMs > DEMOTE_FRAME_MS) {
      this.slowFrames += 1;
      this.fastFrames = 0;
      if (this.slowFrames >= DEMOTE_AFTER_SLOW_FRAMES && this.autoTier < TIER_LOW) {
        this.autoTier = clampTier(this.autoTier + 1);
        this.slowFrames = 0;
        this.lastDemoteAt = nowMs;
        this.persist();
        if (this.override === null) this.emit();
      }
    } else if (deltaMs < PROMOTE_FRAME_MS) {
      this.fastFrames += 1;
      this.slowFrames = 0;
      if (
        this.fastFrames >= PROMOTE_AFTER_FAST_FRAMES &&
        this.autoTier > TIER_HIGH &&
        nowMs - this.lastDemoteAt > PROMOTE_COOLDOWN_MS
      ) {
        this.autoTier = clampTier(this.autoTier - 1);
        this.fastFrames = 0;
        this.persist();
        if (this.override === null) this.emit();
      }
    } else {
      this.slowFrames = 0;
      this.fastFrames = 0;
    }
  }
}

/** Process-wide singleton — machine performance is global, not per-scene. */
export const qualityGovernor = new QualityGovernor();
