import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
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
 * Registers a `captureScreenshot()` callback in the viewer store so the HTML
 * SceneOverlay button (which lives outside <Canvas> and has no renderer handle)
 * can grab the current view as a PNG.
 *
 * The scene renders on demand with no `preserveDrawingBuffer`, so reading the
 * live canvas at click time can be blank. Instead we render the scene into an
 * offscreen RenderTarget and read those pixels back.
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
        const w = Math.max(1, Math.floor(size.width * dpr));
        const h = Math.max(1, Math.floor(size.height * dpr));

        // Render the scene into an offscreen RGBA8 target and read it back.
        // Rendering to a target skips the renderer's output color-space
        // conversion (only the canvas gets it), so tag the target texture with
        // the renderer's output space — otherwise the PNG comes out darker than
        // the on-screen view.
        const target = new THREE.RenderTarget(w, h);
        target.texture.colorSpace = gl.outputColorSpace ?? THREE.SRGBColorSpace;
        const prev = gl.getRenderTarget();
        gl.setRenderTarget(target);
        gl.render(scene, camera);
        // Returns the pixel buffer (no out-param); bottom-up, RGBA8.
        const buf = await gl.readRenderTargetPixelsAsync(target, 0, 0, w, h);
        gl.setRenderTarget(prev);
        target.dispose();
        // The offscreen pass clobbered the live frame — repaint it.
        invalidate();

        // GPU pixels are bottom-up; flip rows into a 2D canvas, then encode PNG.
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        if (!ctx) return null;
        const img = ctx.createImageData(w, h);
        const rowBytes = w * 4;
        for (let y = 0; y < h; y++) {
          const src = (h - 1 - y) * rowBytes;
          img.data.set(buf.subarray(src, src + rowBytes), y * rowBytes);
        }
        ctx.putImageData(img, 0, 0);

        return await new Promise<Blob | null>((resolve) =>
          c.toBlob(resolve, "image/png"),
        );
      } catch (error) {
        console.error("[scene] screenshot capture failed", error);
        return null;
      }
    };

    registerCapture(capture);
    return () => registerCapture(null);
  }, [gl, scene, camera, size, invalidate, registerCapture]);

  return null;
};
