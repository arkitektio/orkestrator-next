import { useCallback, useMemo, useState } from "react";
import * as THREE from "three";
import { Line } from "../primitives/Line";
import { useModeStore } from "../store/modeStore";
import { useRoiDrawingStore, DRAWING_TOOL_TO_ROI_KIND } from "../store/roiDrawingStore";
import { useSceneStore } from "../store/sceneStore";
import { useSelectionStore } from "../store/selectionStore";
import { useViewerStore } from "../store/viewerStore";
import { affineToMatrix4 } from "../core/worldTransform";
import { useCreateDataRoiMutation } from "@/mikro-next/api/graphql";
import type { DrawnRoi } from "../store/roiDrawingStore";

/** Convert a world-space point to voxel-space using the inverse affine */
function worldToVoxel(worldPt: THREE.Vector3, invAffine: THREE.Matrix4) {
  return worldPt.clone().applyMatrix4(invAffine);
}

export const RoiDrawer = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const activeTool = useRoiDrawingStore((s) => s.activeTool);
  const addDrawnRoi = useRoiDrawingStore((s) => s.addDrawnRoi);
  const drawnRois = useRoiDrawingStore((s) => s.drawnRois);
  const removeDrawnRoi = useRoiDrawingStore((s) => s.removeDrawnRoi);
  const layers = useSceneStore((s) => s.layers);
  const armedLayerIds = useSelectionStore((s) => s.armedLayerIds);
  const currentZ = useViewerStore((s) => s.currentZ);

  const [createDataRoi] = useCreateDataRoiMutation();

  // Drawing state
  const [startPos, setStartPos] = useState<THREE.Vector3 | null>(null);
  const [currentPos, setCurrentPos] = useState<THREE.Vector3 | null>(null);
  const [polyPoints, setPolyPoints] = useState<THREE.Vector3[]>([]);

  const armedLayers = useMemo(
    () => layers.filter((layer) => armedLayerIds.includes(layer.id)),
    [armedLayerIds, layers],
  );

  const primaryArmedLayer = armedLayers[0];

  const pointOnCurrentSlice = useCallback(
    (point: THREE.Vector3) => new THREE.Vector3(point.x, point.y, currentZ),
    [currentZ],
  );

  const previewInvAffine = useMemo(() => {
    if (!primaryArmedLayer) return new THREE.Matrix4().identity();
    return affineToMatrix4(primaryArmedLayer.affineMatrix).invert();
  }, [primaryArmedLayer]);

  const submitRoi = useCallback(
    async (roi: DrawnRoi) => {
      if (armedLayers.length === 0) return;

      try {
        await Promise.all(
          armedLayers.map(async (layer) => {
            // An ROI is anchored to the coordinate system it was drawn in —
            // the clicked layer's lens space. The layer's composed affine maps
            // lens voxels → world, so its inverse resolves the drawn world
            // points into exactly that system, once, at creation time.
            const coordinateSystemId = layer.lens.coordinateSystem?.id;
            if (!coordinateSystemId) return;

            const invAffine = affineToMatrix4(layer.affineMatrix).invert();
            const voxelVectors = roi.worldVectors.map((worldVector) => {
              const vector = worldToVoxel(
                new THREE.Vector3(worldVector.x, worldVector.y, worldVector.z),
                invAffine,
              );
              return [Math.round(vector.x), Math.round(vector.y), Math.round(vector.z)] as [number, number, number];
            });

            await createDataRoi({
              variables: {
                input: {
                  coordinateSystem: coordinateSystemId,
                  kind: roi.kind,
                  vectors: voxelVectors,
                },
              },
            });
          }),
        );
        console.log(`Data ROI created successfully for ${armedLayers.length} layer(s)`);
        removeDrawnRoi(roi.id);
      } catch (err) {
        console.error("Failed to create data ROI:", err);
      }
    },
    [armedLayers, createDataRoi, removeDrawnRoi],
  );

  const finishShape = useCallback(
    (worldVectors: THREE.Vector3[]) => {
      if (!activeTool || !primaryArmedLayer) return;
      const voxelVectors = worldVectors.map((wv) => {
        const v = worldToVoxel(wv, previewInvAffine);
        return { x: Math.round(v.x), y: Math.round(v.y), z: Math.round(v.z) };
      });
      const worldVecs = worldVectors.map((wv) => ({
        x: wv.x,
        y: wv.y,
        z: wv.z,
      }));

      const roi: DrawnRoi = {
        id: Math.random().toString(36).substring(2, 9),
        layerId: primaryArmedLayer.id,
        kind: DRAWING_TOOL_TO_ROI_KIND[activeTool],
        vectors: voxelVectors,
        worldVectors: worldVecs,
      };

      addDrawnRoi(roi);
      submitRoi(roi);
    },
    [activeTool, primaryArmedLayer, previewInvAffine, addDrawnRoi, submitRoi],
  );

  // Only render when in EDIT mode with an active tool and at least one armed layer
  if (interactionMode !== "EDIT" || !activeTool || armedLayers.length === 0) return null;

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
