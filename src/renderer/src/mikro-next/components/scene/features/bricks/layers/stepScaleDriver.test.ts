// @vitest-environment jsdom
// (the module imports the store hooks, whose barrel touches `window`.)
import { describe, expect, it } from "vitest";

import {
  QualityGovernor,
  resolveMaxRaySteps,
  resolveSmoothThreshold,
  resolveStepScale,
} from "../../../platform/quality/qualityGovernor";
import {
  StepScaleDriver,
  resolveStepValues,
  type StepScaleUniformHandle,
} from "./useVolumeRayUniforms";

const fakeViewStore = () => {
  const listeners = new Set<() => void>();
  const state = { cameraMoving: false };
  return {
    getState: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    setMoving(moving: boolean) {
      state.cameraMoving = moving;
      for (const l of listeners) l();
    },
    get listenerCount() {
      return listeners.size;
    },
  };
};

const fakeSinks = () => {
  const calls = { bumps: 0, invalidates: 0 };
  return {
    calls,
    sinks: {
      viewerStoreApi: { getState: () => ({ volumeInputs: { bump: () => void calls.bumps++ } }) },
      invalidate: () => void calls.invalidates++,
    },
  };
};

const handle = (withSmooth = true): StepScaleUniformHandle => ({
  uStepScale: { value: -1 },
  uMaxSteps: { value: -1 },
  ...(withSmooth ? { uSmoothThreshold: { value: -1 } } : {}),
});

describe("resolveStepValues", () => {
  it("is exactly the three governor helpers the per-material effect used to inline", () => {
    const g = new QualityGovernor();
    const inputs = {
      profile: g.getProfile(),
      tier: g.getTier(),
      active: true,
      loadFactor: 1.5,
      volumePassCount: 3,
      settleRefineStage: 2,
    };
    const variant = { settleRefine: true, canvasPass: false, smoothZoom: true };
    expect(resolveStepValues(inputs, variant)).toEqual({
      step: resolveStepScale({
        base: inputs.profile.activeStepScale * 1.5,
        active: true,
        canvasPass: false,
      }),
      maxSteps: resolveMaxRaySteps(inputs.profile, true, 3, 2),
      smooth: resolveSmoothThreshold(inputs.tier, true),
    });
    // The variant bits gate exactly what they gated before.
    expect(resolveStepValues(inputs, { ...variant, smoothZoom: false }).smooth).toBe(0);
    expect(resolveStepValues(inputs, { ...variant, settleRefine: false }).maxSteps).toBe(
      resolveMaxRaySteps(inputs.profile, true, 3, 0),
    );
  });
});

describe("StepScaleDriver", () => {
  it("holds ONE view-store subscription however many handles register, and drops it with the last", () => {
    const view = fakeViewStore();
    const driver = new StepScaleDriver(view, new QualityGovernor());
    const { sinks } = fakeSinks();
    const variant = { settleRefine: false, canvasPass: false, smoothZoom: false };
    const a = driver.register(handle(), variant, sinks);
    const b = driver.register(handle(), variant, sinks);
    const c = driver.register(handle(), { ...variant, canvasPass: true }, sinks);
    expect(view.listenerCount).toBe(1);
    expect(driver.handleCount).toBe(3);
    a();
    b();
    expect(driver.subscribed).toBe(true);
    c();
    expect(driver.subscribed).toBe(false);
    expect(view.listenerCount).toBe(0);
  });

  it("seeds a registering handle immediately and requests one frame", () => {
    const view = fakeViewStore();
    const governor = new QualityGovernor();
    const driver = new StepScaleDriver(view, governor);
    const { sinks, calls } = fakeSinks();
    const h = handle();
    driver.register(h, { settleRefine: false, canvasPass: false, smoothZoom: true }, sinks);
    const expected = resolveStepValues(
      {
        profile: governor.getProfile(),
        tier: governor.getTier(),
        active: false,
        loadFactor: governor.getLoadFactor(),
        volumePassCount: governor.getVolumePassCount(),
        settleRefineStage: governor.getSettleRefineStage(),
      },
      { settleRefine: false, canvasPass: false, smoothZoom: true },
    );
    expect(h.uStepScale.value).toBe(expected.step);
    expect(h.uMaxSteps.value).toBe(expected.maxSteps);
    expect(h.uSmoothThreshold?.value).toBe(expected.smooth);
    expect(calls).toEqual({ bumps: 1, invalidates: 1 });
  });

  it("on a motion edge writes every handle but bumps + invalidates ONCE, and not at all when nothing changed", () => {
    const view = fakeViewStore();
    const driver = new StepScaleDriver(view, new QualityGovernor());
    const { sinks, calls } = fakeSinks();
    const variant = { settleRefine: false, canvasPass: false, smoothZoom: false };
    const handles = [handle(), handle(), handle(false)];
    for (const h of handles) driver.register(h, variant, sinks);
    const settled = handles.map((h) => h.uStepScale.value);
    calls.bumps = 0;
    calls.invalidates = 0;

    view.setMoving(true);
    expect(calls).toEqual({ bumps: 1, invalidates: 1 });
    // Active stride is longer than settled on every profile.
    handles.forEach((h, i) => expect(h.uStepScale.value).toBeGreaterThan(settled[i]));
    expect(new Set(handles.map((h) => h.uStepScale.value)).size).toBe(1);

    // Same state emitted again (the flags flip far more often than the values).
    view.setMoving(true);
    expect(calls).toEqual({ bumps: 1, invalidates: 1 });

    view.setMoving(false);
    expect(calls).toEqual({ bumps: 2, invalidates: 2 });
    handles.forEach((h, i) => expect(h.uStepScale.value).toBe(settled[i]));
  });

  it("keeps variants apart: a canvas-pass handle gets its own values on the same emission", () => {
    const view = fakeViewStore();
    const driver = new StepScaleDriver(view, new QualityGovernor());
    const { sinks } = fakeSinks();
    const image = handle();
    const label = handle(false);
    driver.register(image, { settleRefine: true, canvasPass: false, smoothZoom: true }, sinks);
    driver.register(label, { settleRefine: false, canvasPass: true, smoothZoom: false }, sinks);
    view.setMoving(true);
    // The canvas pass never gets the motion-time stride cut the image pass does.
    expect(label.uStepScale.value).not.toBe(image.uStepScale.value);
  });
});
