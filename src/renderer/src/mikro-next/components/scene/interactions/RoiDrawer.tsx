import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { Line } from "../primitives/Line";
import { PreviewLine, type PreviewLineHandle } from "./PreviewLine";
import { VertexHandles } from "./VertexHandles";
import { isTypingTarget } from "./keyboardTarget";
import { useModeStore } from "../store/modeStore";
import {
  useRoiDrawingStore,
  DRAWING_TOOL_TO_ROI_KIND,
  isDrawingTool,
  isPrimitiveTool,
  type DrawingTool,
} from "../store/roiDrawingStore";
import { planarRadius, primitiveCornerVectors } from "../core/primitiveDraw";
import { useRoiDrawSessionStoreApi } from "../store/roiDrawSessionStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import { useCreateSceneAnnotation } from "./useCreateSceneAnnotation";
import { createRafCoalescer } from "../core/probe/rafCoalesce";
import {
  DRAG_THRESHOLD_PX,
  exceedsDragThreshold,
  intersectDrawPlane,
  withinSlop,
  type ScreenPoint,
} from "../core/drawGesture";
import { roiOutline, type OutlinePoint } from "../core/roiOutline";
import { formatDrawMeasure, measureDraw } from "../core/roiMeasure";
import { unitLabel } from "../core/sceneUnits";
import type { DrawnRoi } from "../store/roiDrawingStore";

/** Lift the border off the slice so it never z-fights the plane it sits on. */
const PREVIEW_Z_LIFT = 0.1;

const PREVIEW_COLOR = "#22d3ee";
const CLOSING_COLOR = "#0e7490";
const COMMITTED_COLOR = "#f59e0b";

type Phase = "idle" | "pressed" | "dragging" | "anchored";

interface DrawSession {
  phase: Phase;
  /** Canvas px at pointerdown — the drag-threshold basis. */
  downPx: ScreenPoint | null;
  /** True when the press in flight is the one that placed the anchor. */
  anchorPress: boolean;
  movedPastThreshold: boolean;
  /**
   * Frozen at gesture start. `currentZ` can change mid-drag (shift+wheel is not
   * gated on interaction mode), and letting the anchor and the cursor land on
   * different slices produces an annotation that straddles two z planes — which
   * the annotation layer then renders as a 3D box instead of a rectangle.
   */
  planeZ: number;
  vertices: THREE.Vector3[];
  cursor: THREE.Vector3 | null;
  lastClickPx: ScreenPoint | null;
}

const freshSession = (): DrawSession => ({
  phase: "idle",
  downPx: null,
  anchorPress: false,
  movedPastThreshold: false,
  planeZ: 0,
  vertices: [],
  cursor: null,
  lastClickPx: null,
});

const eventPx = (event: ThreeEvent<PointerEvent | MouseEvent>): ScreenPoint => ({
  x: event.nativeEvent.offsetX,
  y: event.nativeEvent.offsetY,
});

export const RoiDrawer = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const displayMode = useModeStore((s) => s.displayMode);
  const activeTool = useRoiDrawingStore((s) => s.activeTool);
  const addDrawnRoi = useRoiDrawingStore((s) => s.addDrawnRoi);
  const drawnRois = useRoiDrawingStore((s) => s.drawnRois);
  const removeDrawnRoi = useRoiDrawingStore((s) => s.removeDrawnRoi);
  const pendingPathSeed = useRoiDrawingStore((s) => s.pendingPathSeed);
  const setPendingPathSeed = useRoiDrawingStore((s) => s.setPendingPathSeed);
  const pendingPrimitiveAnchor = useRoiDrawingStore((s) => s.pendingPrimitiveAnchor);
  const setPendingPrimitiveAnchor = useRoiDrawingStore((s) => s.setPendingPrimitiveAnchor);
  const setPrimitiveSessionActive = useRoiDrawingStore((s) => s.setPrimitiveSessionActive);
  const spatialUnit = useSceneStore((s) => s.spatialUnit);
  const currentZ = useViewerStore((s) => s.currentZ);
  const invalidate = useThree((s) => s.invalidate);
  const readoutApi = useRoiDrawSessionStoreApi();

  const { createSceneAnnotation } = useCreateSceneAnnotation();

  /**
   * The only React state the gesture owns, and it moves at CLICK cadence — it
   * exists to drive the vertex handles. Everything that moves with the pointer
   * lives in `sessionRef` and is painted imperatively (P17).
   */
  const [placedVertices, setPlacedVertices] = useState<THREE.Vector3[]>([]);

  const sessionRef = useRef<DrawSession>(freshSession());
  const mainRef = useRef<PreviewLineHandle | null>(null);
  const closingRef = useRef<PreviewLineHandle | null>(null);
  const scratch = useRef(new THREE.Vector3());
  const cursorPxRef = useRef<ScreenPoint>({ x: 0, y: 0 });

  const tool: DrawingTool | null = isDrawingTool(activeTool) ? activeTool : null;
  const isPolygonLike = tool === "POLYGON" || tool === "PATH";
  const isPrimitive = isPrimitiveTool(tool);
  const unit = unitLabel(spatialUnit);

  const paint = useCallback(() => {
    const session = sessionRef.current;
    if (!tool) return;

    const z = session.planeZ + PREVIEW_Z_LIFT;
    let points = session.cursor
      ? [...session.vertices, session.cursor]
      : session.vertices;

    // Volumetric tools rubber-band a RADIUS around the probe-seeded center,
    // but outline/measure speak the corner-pair convention — translate here so
    // both stay single-sourced (`core/primitiveDraw.ts`).
    if (isPrimitiveTool(tool) && session.vertices.length === 1) {
      const anchor = session.vertices[0];
      const radius = session.cursor
        ? planarRadius(
            [anchor.x, anchor.y, anchor.z],
            [session.cursor.x, session.cursor.y, session.cursor.z],
          )
        : 0;
      const [low, high] = primitiveCornerVectors(
        [anchor.x, anchor.y, anchor.z],
        radius,
      );
      points = [
        new THREE.Vector3(...low),
        new THREE.Vector3(...high),
      ];
    }

    // `closePolygon: false` — the closing edge is the separate faint line below,
    // so the user can see the finished shape before committing to it.
    // `roiOutline` takes planar points and applies z itself — Vector3 satisfies
    // that, so nothing needs converting here.
    mainRef.current?.setPoints(
      roiOutline(tool, points, z, { closePolygon: false }),
    );

    const showClosing =
      tool === "POLYGON" && session.vertices.length >= 2 && session.cursor;
    closingRef.current?.setPoints(
      showClosing
        ? [
            [session.cursor!.x, session.cursor!.y, z],
            [session.vertices[0].x, session.vertices[0].y, z],
          ]
        : [],
    );

    const label = formatDrawMeasure(measureDraw(tool, points), unit);
    readoutApi.getState().setReadout(
      label
        ? { label, x: cursorPxRef.current.x, y: cursorPxRef.current.y }
        : null,
    );

    invalidate(); // the Canvas is frameloop="demand"
  }, [tool, unit, readoutApi, invalidate]);

  // Pointer-move storms coalesce to ≤1 repaint per frame (same idiom as the
  // brick layers): the ray math runs synchronously in the handler so the session
  // stays truthful for the next event, and only the idempotent paint is deferred.
  const paintCoalescer = useMemo(
    () => createRafCoalescer<() => void>((run) => run()),
    [],
  );
  useEffect(() => () => paintCoalescer.cancel(), [paintCoalescer]);

  const resetSession = useCallback(() => {
    sessionRef.current = freshSession();
    setPlacedVertices([]);
    paintCoalescer.cancel();
    mainRef.current?.clear();
    closingRef.current?.clear();
    readoutApi.getState().setReadout(null);
    // Whatever ends the session — commit, Escape, tool/mode change — the
    // volume may seed the next primitive anchor again.
    setPrimitiveSessionActive(false);
    invalidate();
  }, [paintCoalescer, readoutApi, setPrimitiveSessionActive, invalidate]);

  const submitRoi = useCallback(
    async (roi: DrawnRoi) => {
      // One annotation per drawn shape, in the scene's world. On failure the
      // committed local preview stays, so the shape is not silently lost.
      const created = await createSceneAnnotation(
        roi.kind,
        roi.worldVectors.map((v): [number, number, number] => [v.x, v.y, v.z]),
      );
      if (created) removeDrawnRoi(roi.id);
    },
    [createSceneAnnotation, removeDrawnRoi],
  );

  const finishShape = useCallback(
    (worldVectors: THREE.Vector3[]) => {
      if (!tool) return;

      const roi: DrawnRoi = {
        id: Math.random().toString(36).substring(2, 9),
        kind: DRAWING_TOOL_TO_ROI_KIND[tool],
        tool,
        worldVectors: worldVectors.map((v) => ({ x: v.x, y: v.y, z: v.z })),
      };

      addDrawnRoi(roi);
      submitRoi(roi);
      resetSession();
    },
    [tool, addDrawnRoi, submitRoi, resetSession],
  );

  /**
   * Cancel whatever is half-drawn whenever the context changes underneath it.
   *
   * Also fixes a live bug: `finishShape` reads the active tool at call time, so
   * finishing a polygon after switching to the ellipse tool used to commit an
   * ELLIPSIS carrying N vectors.
   */
  useEffect(
    () => resetSession,
    [activeTool, interactionMode, displayMode, resetSession],
  );

  // "Draw path from probe": consume the seeded first vertex. Declared AFTER
  // the reset effect above — within one commit React runs cleanups first, then
  // effect bodies in declaration order, so the mode/tool flip's reset lands
  // before the seed instead of wiping it. With phase "anchored" and one vertex
  // the normal PATH gestures take over (click extends, double-click commits,
  // Escape cancels).
  useEffect(() => {
    if (!pendingPathSeed) return;
    if (interactionMode !== "ANNOTATE" || tool !== "PATH") return;
    const session = sessionRef.current;
    session.planeZ = pendingPathSeed[2];
    session.vertices = [new THREE.Vector3(...pendingPathSeed)];
    session.phase = "anchored";
    session.cursor = null;
    session.lastClickPx = null;
    setPlacedVertices([...session.vertices]);
    paintCoalescer.schedule(paint);
    setPendingPathSeed(null);
  }, [pendingPathSeed, interactionMode, tool, paint, paintCoalescer, setPendingPathSeed]);

  // Probe-derived volumetric anchor: a click on the volume seeded the center
  // (see BrickVolumeLayer). Same declaration-order invariant as the path seed
  // above. From "anchored", pointer moves rubber-band the radius on the world
  // XY plane through the anchor, and a click commits. Raising
  // `primitiveSessionActive` here is what lets the commit click's same-event
  // hit on the volume be ignored instead of re-anchoring.
  useEffect(() => {
    if (!pendingPrimitiveAnchor) return;
    if (interactionMode !== "ANNOTATE" || !isPrimitiveTool(tool)) return;
    const session = sessionRef.current;
    session.planeZ = pendingPrimitiveAnchor[2];
    session.vertices = [new THREE.Vector3(...pendingPrimitiveAnchor)];
    session.phase = "anchored";
    session.cursor = null;
    session.lastClickPx = null;
    setPlacedVertices([...session.vertices]);
    setPrimitiveSessionActive(true);
    paintCoalescer.schedule(paint);
    setPendingPrimitiveAnchor(null);
  }, [
    pendingPrimitiveAnchor,
    interactionMode,
    tool,
    paint,
    paintCoalescer,
    setPendingPrimitiveAnchor,
    setPrimitiveSessionActive,
  ]);

  // Escape abandons the shape. Without it a half-placed polygon has no exit —
  // you have to finish a shape you don't want and then delete it server-side.
  // `pointercancel` has to be a window listener: R3F handles it at the canvas
  // and never forwards it to object handlers. (Deliberately NOT
  // `lostpointercapture`, which fires *before* pointerup and would kill every
  // gesture before it commits.)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (isTypingTarget(event.target as HTMLElement | null)) return;
      if (sessionRef.current.phase === "idle" && sessionRef.current.vertices.length === 0) {
        return; // nothing of ours to cancel; leave Escape to whoever else wants it
      }
      event.preventDefault();
      resetSession();
    };
    const onCancel = () => resetSession();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("blur", onCancel);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("blur", onCancel);
    };
  }, [resetSession]);

  // ANNOTATE mode + a *shape* tool is the whole condition. The Select tool arms
  // `RectangleDrawer` instead, so the two are mutually exclusive by
  // construction. Arming a layer is not part of it either: shapes land in the
  // scene's own coordinate system, so there is no layer to point at.
  if (interactionMode !== "ANNOTATE" || !tool) return null;

  /** The live pointer position on the slice being drawn — never `event.point`. */
  const pointOnPlane = (event: ThreeEvent<PointerEvent | MouseEvent>) => {
    const session = sessionRef.current;
    const planeZ = session.phase === "idle" && session.vertices.length === 0
      ? currentZ
      : session.planeZ;
    return intersectDrawPlane(event.ray, planeZ, scratch.current);
  };

  return (
    <group>
      {/* Invisible interaction plane. It still raycasts — Mesh.raycast never
          reads material.visible — while the renderer skips drawing it. */}
      <mesh
        position={[0, 0, 0.01]}
        onPointerDown={(e) => {
          // Click tools opt out entirely, so R3F's post-drag click can't
          // interfere with them. Primitives are click tools too — and their
          // anchor never comes from this plane (the volume seeds it).
          if (isPolygonLike || tool === "POINT" || isPrimitive) return;
          const hit = pointOnPlane(e);
          if (!hit) return;

          e.stopPropagation();
          (e.target as Element).setPointerCapture?.(e.pointerId);

          const session = sessionRef.current;
          session.downPx = eventPx(e);
          session.movedPastThreshold = false;

          if (session.vertices.length === 0) {
            session.planeZ = currentZ;
            session.vertices = [hit.clone().setZ(currentZ)];
            session.anchorPress = true;
            setPlacedVertices(session.vertices);
          } else {
            session.anchorPress = false;
          }

          session.phase = "pressed";
          session.cursor = hit.clone();
          cursorPxRef.current = eventPx(e);
          paintCoalescer.schedule(paint);
        }}
        onPointerMove={(e) => {
          const session = sessionRef.current;
          // A primitive tool with no anchor yet: the VOLUME owns the pointer
          // (hover probing, the anchoring click) — the plane must neither
          // consume the ray nor block propagation to it.
          if (isPrimitive && session.vertices.length === 0) return;
          // Otherwise unconditional: this plane sits in front of the image
          // planes, so stopping propagation is what keeps a probe from firing
          // while you draw.
          e.stopPropagation();

          const hit = pointOnPlane(e);
          if (!hit) return; // keep the last valid cursor rather than jumping

          if (session.phase === "pressed" && session.downPx) {
            if (exceedsDragThreshold(eventPx(e), session.downPx)) {
              session.phase = "dragging";
              session.movedPastThreshold = true;
            }
          }

          // Nothing to rubber-band against until the first vertex exists.
          if (session.vertices.length === 0) return;

          session.cursor = hit.clone();
          cursorPxRef.current = eventPx(e);
          paintCoalescer.schedule(paint);
        }}
        onPointerUp={(e) => {
          if (isPolygonLike || tool === "POINT" || isPrimitive) return;

          const session = sessionRef.current;
          e.stopPropagation();
          (e.target as Element).releasePointerCapture?.(e.pointerId);

          const hit = pointOnPlane(e);
          if (hit) session.cursor = hit.clone();

          // Commit when this press actually dragged, OR when it is the second
          // press of the click-move-click flow. A press that only placed the
          // anchor and didn't move stays anchored, rubber-banding on hover.
          const shouldCommit =
            session.vertices.length === 1 &&
            (session.movedPastThreshold || !session.anchorPress);

          if (shouldCommit && session.cursor) {
            finishShape([session.vertices[0], session.cursor.clone().setZ(session.planeZ)]);
            return;
          }

          session.phase = "anchored";
          session.downPx = null;
        }}
        onClick={(e) => {
          if (isPrimitive) {
            const session = sessionRef.current;
            // Only a probe-anchored session sizes and commits here. Early
            // returns deliberately do NOT stop propagation: an un-anchored
            // click must reach the volume so it can seed the anchor.
            if (session.phase !== "anchored" || session.vertices.length !== 1) return;
            const hit = pointOnPlane(e);
            if (!hit) return;
            const anchor = session.vertices[0];
            const radius = planarRadius(
              [anchor.x, anchor.y, anchor.z],
              [hit.x, hit.y, hit.z],
            );
            if (radius <= 0) return;
            // Suppress this click on the volume behind the plane. Combined
            // with the volume's `primitiveSessionActive` guard this is
            // order-independent: volume-first sees the flag still raised,
            // plane-first stops the event here.
            e.stopPropagation();
            const [low, high] = primitiveCornerVectors(
              [anchor.x, anchor.y, anchor.z],
              radius,
            );
            finishShape([new THREE.Vector3(...low), new THREE.Vector3(...high)]);
            return;
          }

          if (!isPolygonLike && tool !== "POINT") return;
          e.stopPropagation();

          const hit = pointOnPlane(e);
          if (!hit) return;
          const px = eventPx(e);
          const session = sessionRef.current;

          if (tool === "POINT") {
            // A stray drag shouldn't drop a point.
            if (e.delta > DRAG_THRESHOLD_PX) return;
            // In 3D the point is probe-derived: the volume places it at the
            // probed coordinate, so a plane point at `currentZ` would be a
            // duplicate on an arbitrary slab.
            if (displayMode === "3D") return;
            session.planeZ = currentZ;
            finishShape([hit.clone().setZ(currentZ)]);
            return;
          }

          // Finish on double-click — but only if the second click landed on the
          // first. `detail` is position-blind, so without this two quick vertex
          // placements would end the polygon.
          const isDoubleClick =
            e.detail >= 2 &&
            session.vertices.length >= 2 &&
            (!session.lastClickPx || withinSlop(px, session.lastClickPx));

          if (isDoubleClick) {
            finishShape([...session.vertices]);
            return;
          }

          if (session.vertices.length === 0) session.planeZ = currentZ;
          session.vertices = [
            ...session.vertices,
            hit.clone().setZ(session.planeZ),
          ];
          session.lastClickPx = px;
          session.phase = "anchored";
          session.cursor = hit.clone();
          cursorPxRef.current = px;
          setPlacedVertices(session.vertices);
          paintCoalescer.schedule(paint);
        }}
      >
        <planeGeometry args={[80000, 80000]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Mounted for the whole tool session so the handles never detach: these
          hide themselves rather than unmounting. */}
      <PreviewLine ref={mainRef} color={PREVIEW_COLOR} lineWidth={2} />
      <PreviewLine
        ref={closingRef}
        color={CLOSING_COLOR}
        lineWidth={2}
        dashed
        dashSize={3}
        gapSize={2}
      />

      {/* Each vertex already carries the frozen slice z, so the handles lift off
          it individually rather than reading the session during render. */}
      <VertexHandles
        vertices={placedVertices.map(
          (v) => [v.x, v.y, v.z + PREVIEW_Z_LIFT] as OutlinePoint,
        )}
      />

      {/* Committed locally, until the server copy arrives. */}
      {drawnRois.map((roi) => (
        <RoiShape key={roi.id} roi={roi} />
      ))}
    </group>
  );
};

/**
 * A shape that has been drawn and submitted but whose server copy hasn't landed
 * yet. One `roiOutline` call for every tool — which is what fixes the ellipse
 * that used to be stroked as a rectangle here (and in the live preview).
 */
const RoiShape = ({ roi }: { roi: DrawnRoi }) => {
  const vectors = roi.worldVectors;
  if (vectors.length === 0) return null;

  // Primitives carry BOUNDING corners; their committed footprint belongs on
  // the equator (the plane the user sized in), not the bottom face.
  const z =
    (isPrimitiveTool(roi.tool) && vectors.length >= 2
      ? ((vectors[0].z ?? 0) + (vectors[1].z ?? 0)) / 2
      : vectors[0].z ?? 0) + PREVIEW_Z_LIFT;

  if (roi.tool === "POINT") {
    return (
      <mesh position={[vectors[0].x, vectors[0].y, z]}>
        <circleGeometry args={[2, 16]} />
        <meshBasicMaterial color={COMMITTED_COLOR} transparent opacity={0.7} />
      </mesh>
    );
  }

  return (
    <Line
      points={roiOutline(roi.tool, vectors, z)}
      color={COMMITTED_COLOR}
      lineWidth={2}
      depthTest={false}
      renderOrder={9}
    />
  );
};
