import { useEffect, useMemo, useRef } from "react";
import { EXCLUDE_FROM_CAPTURE } from "../core/captureVisibility";
import { computeSceneWorldBox } from "../core/sceneFit";
import { useModeStore } from "../store/modeStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import { PreviewLine, type PreviewLineHandle } from "./PreviewLine";

/**
 * Three axis-aligned guide lines through the probed point, spanning the scene
 * extent — the "where in the coordinate system am I" answer for a point
 * floating inside a volume. Shown whenever a probe exists in PROBE or
 * ANNOTATE mode (3D annotating is probe-derived, so the guides double as the
 * anchor preview).
 *
 * X/Y reuse the origin crosshair's colors (`SceneAxis`); Z completes the
 * RGB=XYZ convention. Rendering follows the PreviewLine idiom: three
 * mount-styled Line2s whose buffers are rewritten at probe cadence — the
 * probe stream is already voxel-deduped and rAF-coalesced upstream, the same
 * cadence `SceneProbedPoint` rides.
 */

const X_COLOR = "#ef4444";
const Y_COLOR = "#22c55e";
const Z_COLOR = "#3b82f6";

/** Guides overshoot the scene box slightly so they read as axes, not edges. */
const padOf = (min: number, max: number) => (max - min) * 0.05 + 1e-3;

export const ProbeAxisGuides = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const probe = useViewerStore((s) => s.probedCoordinate);
  const layers = useSceneStore((s) => s.layers);

  const xRef = useRef<PreviewLineHandle | null>(null);
  const yRef = useRef<PreviewLineHandle | null>(null);
  const zRef = useRef<PreviewLineHandle | null>(null);

  // The scene's three-space extent — the same box the initial camera fit
  // frames. Layers only change identity on real edits, so this is cold.
  const box = useMemo(() => computeSceneWorldBox(layers), [layers]);

  const worldPos =
    (interactionMode === "PROBE" || interactionMode === "ANNOTATE") &&
    probe?.worldPos
      ? probe.worldPos
      : null;

  useEffect(() => {
    if (!worldPos || !box) {
      xRef.current?.clear();
      yRef.current?.clear();
      zRef.current?.clear();
      return;
    }
    const [px, py, pz] = worldPos;
    const padX = padOf(box.min.x, box.max.x);
    const padY = padOf(box.min.y, box.max.y);
    const padZ = padOf(box.min.z, box.max.z);
    xRef.current?.setPoints([
      [box.min.x - padX, py, pz],
      [box.max.x + padX, py, pz],
    ]);
    yRef.current?.setPoints([
      [px, box.min.y - padY, pz],
      [px, box.max.y + padY, pz],
    ]);
    zRef.current?.setPoints([
      [px, py, box.min.z - padZ],
      [px, py, box.max.z + padZ],
    ]);
  }, [worldPos, box]);

  return (
    // Furniture: never baked into screenshots or animation captures.
    <group userData={{ [EXCLUDE_FROM_CAPTURE]: true }}>
      <PreviewLine ref={xRef} color={X_COLOR} lineWidth={1} renderOrder={8} />
      <PreviewLine ref={yRef} color={Y_COLOR} lineWidth={1} renderOrder={8} />
      <PreviewLine ref={zRef} color={Z_COLOR} lineWidth={1} renderOrder={8} />
    </group>
  );
};
