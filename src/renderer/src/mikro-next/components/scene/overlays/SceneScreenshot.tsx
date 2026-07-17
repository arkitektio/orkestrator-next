import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { hideExcludedFromCapture } from "../core/captureVisibility";
import { gpuPixelsToImageBytes } from "../core/pixelBuffer";
import { useViewerStore } from "../store/viewerStore";

/**
 * Minimal subset of three's WebGPURenderer we call for a screenshot. Typed
 * locally because R3F types `gl` as WebGLRenderer, whereas the scene's `gl`
 * factory returns a WebGPURenderer (see Scene.tsx).
 */
interface CaptureRenderer {
  getPixelRatio: () => number;
  outputColorSpace?: THREE.ColorSpace;
  getRenderTarget: () => THREE.RenderTarget | null;
  setRenderTarget: (target: THREE.RenderTarget | null) => void;
  render: (scene: THREE.Object3D, camera: THREE.Camera) => void;
  readRenderTargetPixelsAsync: (
    target: THREE.RenderTarget,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => Promise<Uint8Array>;
}

/**
 * Render the scene offscreen at an explicit size and encode it as a PNG.
 *
 * Offscreen rather than reading the live canvas: the scene renders on demand
 * with no `preserveDrawingBuffer`, so the canvas can be blank at click time.
 * The size being a parameter is the point — capture resolution stays decoupled
 * from the viewport, which is what an offline animation export (fixed output
 * size, whatever the window happens to be) needs from this.
 *
 * Viewport furniture is left out: objects tagged `EXCLUDE_FROM_CAPTURE` (the
 * origin crosshair) are hidden for the pass. HTML overlays and the gizmo were
 * never in `scene` to begin with.
 *
 * Callers must repaint afterwards: the offscreen pass leaves the renderer's
 * target restored but the live frame clobbered.
 */
export const captureFrameBlob = async (
  gl: CaptureRenderer,
  scene: THREE.Object3D,
  camera: THREE.Camera,
  width: number,
  height: number,
): Promise<Blob | null> => {
  // Rendering to a target skips the renderer's output color-space conversion
  // (only the canvas gets it), so tag the target texture with the renderer's
  // output space — otherwise the PNG comes out darker than the on-screen view.
  const target = new THREE.RenderTarget(width, height);
  target.texture.colorSpace = gl.outputColorSpace ?? THREE.SRGBColorSpace;
  const prev = gl.getRenderTarget();
  const restoreVisibility = hideExcludedFromCapture(scene);
  let buf: Uint8Array;
  try {
    gl.setRenderTarget(target);
    gl.render(scene, camera);
    // Returns the pixel buffer (no out-param); bottom-up, RGBA8, and with rows
    // padded to WebGPU's 256-byte alignment — see core/pixelBuffer.
    buf = await gl.readRenderTargetPixelsAsync(target, 0, 0, width, height);
  } finally {
    restoreVisibility();
    gl.setRenderTarget(prev);
    target.dispose();
  }

  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.putImageData(
    new ImageData(gpuPixelsToImageBytes(buf, width, height), width, height),
    0,
    0,
  );

  return await new Promise<Blob | null>((resolve) => c.toBlob(resolve, "image/png"));
};

/**
 * Registers a `captureScreenshot()` callback in the viewer store so the HTML
 * SceneOverlay button (which lives outside <Canvas> and has no renderer handle)
 * can grab the current view as a PNG. Binds `captureFrameBlob` to the current
 * viewport size.
 *
 * Renders null; mounted inside <Canvas> next to <CanvasSync />.
 */
export const SceneScreenshot = () => {
  const registerCapture = useViewerStore((s) => s.registerCapture);
  const gl = useThree((s) => s.gl) as unknown as CaptureRenderer;
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const capture = async (): Promise<Blob | null> => {
      try {
        const dpr = gl.getPixelRatio?.() ?? 1;
        return await captureFrameBlob(
          gl,
          scene,
          camera,
          Math.max(1, Math.floor(size.width * dpr)),
          Math.max(1, Math.floor(size.height * dpr)),
        );
      } catch (error) {
        console.error("[scene] screenshot capture failed", error);
        return null;
      } finally {
        // The offscreen pass clobbered the live frame — repaint it.
        invalidate();
      }
    };

    registerCapture(capture);
    return () => registerCapture(null);
  }, [gl, scene, camera, size, invalidate, registerCapture]);

  return null;
};
