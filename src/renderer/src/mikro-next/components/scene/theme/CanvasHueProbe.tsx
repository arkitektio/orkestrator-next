import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useSettings } from "@/providers/settings/SettingsContext";
import type { BrandTarget } from "@/providers/settings/brandTheme";
import { useViewerStoreApi } from "../store/viewerStore";
import { majorityHueFromPixels, sameBrandTarget } from "./majorityHue";

/** Edge of the square the frame is downscaled to before reading. 1024 pixels
 * is plenty to find a majority and keeps the readback at 4 KB. */
const SAMPLE_SIZE = 32;

/** How long the canvas must sit still before a sample is taken. */
const QUIET_MS = 200;

/** During CONTINUOUS rendering (orbit, animation playback) the quiet period
 * never arrives — sample at least this often so the tint still follows. */
const MAX_WAIT_MS = 1200;

type Scratch = {
  canvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
};

/**
 * Samples the RENDERED canvas and publishes its majority hue as the scene's
 * sampled brand target (`viewerStore.sampledBrandTarget`), which
 * `SceneBrandTheme` prefers over the colormap-derived estimate — so the app
 * tint follows what is actually on screen, not what the render graph predicts.
 *
 * Performance is the design constraint, accuracy is not:
 *   - `useFrame` only stamps a timestamp; all real work happens in a trailing
 *     debounce (`QUIET_MS`) off the frame loop, capped by `MAX_WAIT_MS` so
 *     sustained motion still updates.
 *   - the frame is shrunk on the GPU via `createImageBitmap({resize})` —
 *     asynchronous, so no main-thread sync against the full-resolution
 *     framebuffer — and only the 32×32 result is ever read back.
 *   - the scratch 2D canvas is created once and composites with `"copy"`, so
 *     no clear pass and no alpha blending against the previous sample.
 *
 * Reading the live canvas (rather than the screenshot path's offscreen
 * re-render) is safe here because sampling always happens strictly AFTER a
 * presented frame — the debounce only ever fires later than the `useFrame`
 * that armed it — and Chromium keeps the last presented WebGPU image
 * drawable. Renders null; mount inside `<Canvas>`.
 */
export const CanvasHueProbe = () => {
  const gl = useThree((state) => state.gl);
  const viewerApi = useViewerStoreApi();
  const { settings } = useSettings();
  const enabled = settings.sceneThemeSync !== false;

  // useFrame closures are long-lived; refs keep them reading current values
  // without resubscribing the frame hook.
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const clockRef = useRef({
    lastFrameAt: 0,
    /** When the first unsampled frame landed; null = nothing pending. */
    dirtySince: null as number | null,
    timer: null as ReturnType<typeof setTimeout> | null,
    sampling: false,
    disposed: false,
    /** Starts null to match the store default, so a blank first sample
     * publishes nothing. */
    lastPublished: null as BrandTarget | null,
  });
  const scratchRef = useRef<Scratch | null>(null);

  const sample = async (): Promise<void> => {
    const clock = clockRef.current;
    if (clock.sampling) return;
    clock.sampling = true;
    try {
      const source = gl.domElement;
      if (!source || source.width === 0 || source.height === 0) return;

      if (scratchRef.current === null) {
        const canvas = new OffscreenCanvas(SAMPLE_SIZE, SAMPLE_SIZE);
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.globalCompositeOperation = "copy";
        scratchRef.current = { canvas, ctx };
      }
      const { ctx } = scratchRef.current;

      const bitmap = await createImageBitmap(source, {
        resizeWidth: SAMPLE_SIZE,
        resizeHeight: SAMPLE_SIZE,
        resizeQuality: "low",
      });
      try {
        ctx.drawImage(bitmap, 0, 0);
      } finally {
        bitmap.close();
      }
      const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

      const target = majorityHueFromPixels(data);
      if (clock.disposed) return;
      if (sameBrandTarget(clock.lastPublished, target)) return;
      clock.lastPublished = target;
      viewerApi.getState().setSampledBrandTarget(target);
    } catch {
      // A failed capture (canvas mid-teardown, bitmap refusal) keeps the last
      // published target; the next frame re-arms the debounce anyway.
    } finally {
      clock.sampling = false;
    }
  };

  const check = () => {
    const clock = clockRef.current;
    clock.timer = null;
    if (clock.disposed || clock.dirtySince === null) return;
    const now = performance.now();
    const quietFor = now - clock.lastFrameAt;
    if (quietFor >= QUIET_MS || now - clock.dirtySince >= MAX_WAIT_MS) {
      clock.dirtySince = null;
      void sample();
    } else {
      clock.timer = setTimeout(check, Math.max(QUIET_MS - quietFor, 16));
    }
  };

  // Stamp-only: runs on every rendered frame of the demand loop, so it must
  // stay allocation- and work-free. A single timer is armed at most once per
  // quiet period — no per-frame clearTimeout churn.
  useFrame(() => {
    if (!enabledRef.current) return;
    const clock = clockRef.current;
    clock.lastFrameAt = performance.now();
    if (clock.dirtySince === null) clock.dirtySince = clock.lastFrameAt;
    if (clock.timer === null) clock.timer = setTimeout(check, QUIET_MS);
  });

  // Turning the setting off mid-scene hands the tint back to the colormap
  // estimate immediately rather than freezing the last sample.
  useEffect(() => {
    if (enabled) return;
    const clock = clockRef.current;
    clock.dirtySince = null;
    clock.lastPublished = null;
    viewerApi.getState().setSampledBrandTarget(null);
  }, [enabled, viewerApi]);

  useEffect(() => {
    const clock = clockRef.current;
    clock.disposed = false;
    return () => {
      clock.disposed = true;
      if (clock.timer !== null) {
        clearTimeout(clock.timer);
        clock.timer = null;
      }
      // The store can outlive this canvas (viewport unmount without a scope
      // teardown) — don't leave it pinned to a frame nobody renders anymore.
      viewerApi.getState().setSampledBrandTarget(null);
    };
  }, [viewerApi]);

  return null;
};
