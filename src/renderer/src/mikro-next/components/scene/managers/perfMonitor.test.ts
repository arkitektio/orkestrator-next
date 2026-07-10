import { afterEach, describe, expect, it } from "vitest";
import { perfMonitor } from "./perfMonitor";

afterEach(() => {
  perfMonitor.stopRecording();
});

describe("perfMonitor gate (opt-in)", () => {
  it("is off by default and ignores all hooks until startRecording", () => {
    expect(perfMonitor.isRecording()).toBe(false);
    // None of these should capture anything.
    perfMonitor.countRender("LayerControlPanel");
    perfMonitor.markReplan();
    perfMonitor.markVisibilityRecompute();
    perfMonitor.markUpload(3, 1000);
    perfMonitor.recordFrame({ frameCpuMs: 10, gpuMs: 1, cameraMoving: true });
    expect(perfMonitor.buildSessionReport()).toBeNull();
  });

  it("captures hooks only while recording, and stopping keeps the buffers", () => {
    perfMonitor.startRecording();
    perfMonitor.countRender("LayerControlPanel");
    perfMonitor.countRender("LayerControlPanel");
    perfMonitor.markReplan();
    perfMonitor.recordFrame({ frameCpuMs: 8, gpuMs: 2, cameraMoving: false });
    perfMonitor.stopRecording();

    // Hooks after stop are ignored...
    perfMonitor.countRender("LayerControlPanel");
    perfMonitor.recordFrame({ frameCpuMs: 99, gpuMs: 9, cameraMoving: true });

    const report = perfMonitor.buildSessionReport();
    expect(report).not.toBeNull();
    expect(report!.frameCount).toBe(1);
    expect(report!.renderCounts.LayerControlPanel).toBe(2);
    expect(report!.replans).toBe(1);
  });

  it("startRecording clears the previous session", () => {
    perfMonitor.startRecording();
    perfMonitor.recordFrame({ frameCpuMs: 5, gpuMs: null, cameraMoving: true });
    perfMonitor.startRecording(); // fresh
    expect(perfMonitor.buildSessionReport()).toBeNull();
  });
});

describe("perfMonitor aggregation", () => {
  it("separates CPU from GPU and counts jank + moving frames", () => {
    perfMonitor.startRecording();
    perfMonitor.recordFrame({ frameCpuMs: 10, gpuMs: 2, cameraMoving: true });
    perfMonitor.recordFrame({ frameCpuMs: 80, gpuMs: 3, cameraMoving: true }); // jank (CPU) but low GPU
    perfMonitor.recordFrame({ frameCpuMs: 12, gpuMs: null, cameraMoving: false });
    const report = perfMonitor.buildSessionReport()!;

    expect(report.frameCount).toBe(3);
    expect(report.jankFrames).toBe(1); // the 80ms frame
    expect(report.movingFrames).toBe(2);
    expect(report.cpuMs.max).toBe(80);
    expect(report.cpuMs.min).toBe(10);
    // GPU stats only over the 2 non-null samples — proves the stall was CPU.
    expect(report.gpuMs).not.toBeNull();
    expect(report.gpuMs!.samples).toBe(2);
    expect(report.gpuMs!.max).toBe(3);
  });

  it("attributes accumulated uploads to the next frame", () => {
    perfMonitor.startRecording();
    perfMonitor.markUpload(2, 500);
    perfMonitor.markUpload(1, 250);
    perfMonitor.recordFrame({ frameCpuMs: 6, gpuMs: 1, cameraMoving: false });
    const report = perfMonitor.buildSessionReport()!;
    expect(report.bricksUploaded).toBe(3);
    expect(report.bytesUploaded).toBe(750);
  });

  it("reports gpuMs as null when no timer-query samples were available", () => {
    perfMonitor.startRecording();
    perfMonitor.recordFrame({ frameCpuMs: 6, gpuMs: null, cameraMoving: false });
    perfMonitor.recordFrame({ frameCpuMs: 7, gpuMs: null, cameraMoving: false });
    expect(perfMonitor.buildSessionReport()!.gpuMs).toBeNull();
  });
});
