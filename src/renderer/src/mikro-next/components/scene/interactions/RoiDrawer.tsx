import { useCallback, useMemo, useState } from "react";
import * as THREE from "three";
import { Line } from "../primitives/Line";
import { useModeStore } from "../store/modeStore";
import { useRoiDrawingStore, DRAWING_TOOL_TO_ROI_KIND } from "../store/roiDrawingStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import { useCreateAnnotationMutation } from "@/mikro-next/api/graphql";
import type { DrawnRoi } from "../store/roiDrawingStore";

export const RoiDrawer = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const activeTool = useRoiDrawingStore((s) => s.activeTool);
  const addDrawnRoi = useRoiDrawingStore((s) => s.addDrawnRoi);
  const drawnRois = useRoiDrawingStore((s) => s.drawnRois);
  const removeDrawnRoi = useRoiDrawingStore((s) => s.removeDrawnRoi);
  const sceneId = useSceneStore((s) => s.id);
  const sceneLayers = useSceneStore((s) => s.sceneLayers);
  const currentZ = useViewerStore((s) => s.currentZ);

  // Drawing on the scene mints its annotation collection, the collection's
  // registration into the world AND the AnnotationLayer that draws it — but
  // only on first use. Until that layer exists there is nothing to render the
  // shape, so the first draw has to refetch the scene itself; later ones only
  // need the layer's own annotation query.
  const hasAnnotationLayer = useMemo(
    () => sceneLayers.some((layer) => layer.__typename === "AnnotationLayer"),
    [sceneLayers],
  );

  const [createAnnotation] = useCreateAnnotationMutation();

  // Drawing state
  const [startPos, setStartPos] = useState<THREE.Vector3 | null>(null);
  const [currentPos, setCurrentPos] = useState<THREE.Vector3 | null>(null);
  const [polyPoints, setPolyPoints] = useState<THREE.Vector3[]>([]);

  const pointOnCurrentSlice = useCallback(
    (point: THREE.Vector3) => new THREE.Vector3(point.x, point.y, currentZ),
    [currentZ],
  );

  const submitRoi = useCallback(
    async (roi: DrawnRoi) => {
      try {
        // One annotation per drawn shape, in the scene's world. An annotation
        // belongs to a collection, not to a layer, so there is no per-armed-
        // layer copy any more — and no world→voxel inversion, because the
        // scene's collection is registered into the world by identity.
        await createAnnotation({
          variables: {
            input: {
              scene: sceneId,
              kind: roi.kind,
              vectors: roi.worldVectors.map((vector) => [vector.x, vector.y, vector.z]),
            },
          },
          refetchQueries: hasAnnotationLayer ? ["GetAnnotations"] : ["GetScene"],
          awaitRefetchQueries: false,
        });
        removeDrawnRoi(roi.id);
      } catch (err) {
        console.error("Failed to create annotation:", err);
      }
    },
    [createAnnotation, hasAnnotationLayer, removeDrawnRoi, sceneId],
  );

  const finishShape = useCallback(
    (worldVectors: THREE.Vector3[]) => {
      if (!activeTool) return;

      const roi: DrawnRoi = {
        id: Math.random().toString(36).substring(2, 9),
        kind: DRAWING_TOOL_TO_ROI_KIND[activeTool],
        worldVectors: worldVectors.map((wv) => ({ x: wv.x, y: wv.y, z: wv.z })),
      };

      addDrawnRoi(roi);
      submitRoi(roi);
    },
    [activeTool, addDrawnRoi, submitRoi],
  );

  // EDIT mode + a tool is the whole condition. Arming a layer is not part of
  // it: shapes land in the scene's own coordinate system, so there is no layer
  // for the user to be pointing at.
  if (interactionMode !== "EDIT" || !activeTool) return null;

  const isPolygonLike = activeTool === "POLYGON" || activeTool === "PATH";

  return (
    <group>
      {/* Invisible interaction plane */}
      <mesh
        position={[0, 0, 0.01]}
        onPointerMove={(e) => {
          if (isPolygonLike) {
            if (polyPoints.length > 0) {
              setCurrentPos(pointOnCurrentSlice(e.point));
            }
            return;
          }

          if (startPos) {
            e.stopPropagation();
            setCurrentPos(pointOnCurrentSlice(e.point));
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          const anchorPoint = pointOnCurrentSlice(e.point);

          if (isPolygonLike) {
            // Double-click to finish polygon
            if (e.detail >= 2 && polyPoints.length >= 2) {
              finishShape([...polyPoints]);
              setPolyPoints([]);
              setCurrentPos(null);
              return;
            }
            setPolyPoints((prev) => [...prev, anchorPoint]);
            return;
          }

          if (activeTool === "POINT") {
            finishShape([anchorPoint]);
            return;
          }

          if (!startPos) {
            setStartPos(anchorPoint);
            setCurrentPos(anchorPoint);
            return;
          }

          finishShape([startPos, anchorPoint]);
          setStartPos(null);
          setCurrentPos(null);
        }}
      >
        <planeGeometry args={[80000, 80000]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Live preview for click-anchored line / rectangle / ellipsis */}
      {startPos && currentPos && !isPolygonLike && activeTool !== "POINT" && (
        activeTool === "LINE" ? (
          <Line
            points={[
              [startPos.x, startPos.y, 0.1],
              [currentPos.x, currentPos.y, 0.1],
            ]}
            color="#22d3ee"
            lineWidth={2}
          />
        ) : (
          <Line
            points={[
              [startPos.x, startPos.y, 0.1],
              [currentPos.x, startPos.y, 0.1],
              [currentPos.x, currentPos.y, 0.1],
              [startPos.x, currentPos.y, 0.1],
              [startPos.x, startPos.y, 0.1],
            ]}
            color="#22d3ee"
            lineWidth={2}
            dashed
            dashSize={3}
            gapSize={2}
          />
        )
      )}

      {/* Live preview for polygon/path drawing */}
      {isPolygonLike && polyPoints.length > 0 && (
        <Line
          points={[
            ...polyPoints.map((p) => [p.x, p.y, 0.1] as [number, number, number]),
            ...(currentPos
              ? [[currentPos.x, currentPos.y, 0.1] as [number, number, number]]
              : []),
          ]}
          color="#22d3ee"
          lineWidth={2}
          dashed
          dashSize={3}
          gapSize={2}
        />
      )}

      {/* Render committed ROIs */}
      {drawnRois.map((roi) => (
        <RoiShape key={roi.id} roi={roi} />
      ))}
    </group>
  );
};

/** Renders a committed ROI shape */
const RoiShape = ({ roi }: { roi: DrawnRoi }) => {
  const wv = roi.worldVectors;
  if (wv.length === 0) return null;

  if (roi.kind === "POINT") {
    return (
      <mesh position={[wv[0].x, wv[0].y, 0.05]}>
        <circleGeometry args={[2, 16]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.7} />
      </mesh>
    );
  }

  if (roi.kind === "LINE" && wv.length >= 2) {
    return (
      <Line
        points={wv.map((v) => [v.x, v.y, 0.1] as [number, number, number])}
        color="#f59e0b"
        lineWidth={2}
      />
    );
  }

  if (
    (roi.kind === "RECTANGLE" || roi.kind === "ELLIPSIS") &&
    wv.length >= 2
  ) {
    return (
      <Line
        points={[
          [wv[0].x, wv[0].y, 0.1],
          [wv[1].x, wv[0].y, 0.1],
          [wv[1].x, wv[1].y, 0.1],
          [wv[0].x, wv[1].y, 0.1],
          [wv[0].x, wv[0].y, 0.1],
        ]}
        color="#f59e0b"
        lineWidth={2}
      />
    );
  }

  if (
    (roi.kind === "POLYGON" || roi.kind === "PATH") &&
    wv.length >= 2
  ) {
    const points = wv.map((v) => [v.x, v.y, 0.1] as [number, number, number]);
    if (roi.kind === "POLYGON") points.push(points[0]); // close polygon
    return <Line points={points} color="#f59e0b" lineWidth={2} />;
  }

  return null;
};
