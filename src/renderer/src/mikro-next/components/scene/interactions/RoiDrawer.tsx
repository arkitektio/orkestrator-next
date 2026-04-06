import { useCallback, useMemo, useState } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useModeStore } from "../store/modeStore";
import { useRoiDrawingStore, DRAWING_TOOL_TO_ROI_KIND } from "../store/roiDrawingStore";
import { useSceneStore } from "../store/sceneStore";
import { useSelectionStore } from "../store/layerStore";
import { affineToMatrix4 } from "../panels/layer/affine-utils";
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
  const selectedLayerId = useSelectionStore((s) => s.selectedLayerId);

  const [createDataRoi] = useCreateDataRoiMutation();

  // Drawing state
  const [startPos, setStartPos] = useState<THREE.Vector3 | null>(null);
  const [currentPos, setCurrentPos] = useState<THREE.Vector3 | null>(null);
  const [polyPoints, setPolyPoints] = useState<THREE.Vector3[]>([]);

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedLayerId),
    [layers, selectedLayerId],
  );

  const invAffine = useMemo(() => {
    if (!selectedLayer) return new THREE.Matrix4().identity();
    return affineToMatrix4(selectedLayer.affineMatrix).invert();
  }, [selectedLayer]);

  const submitRoi = useCallback(
    async (roi: DrawnRoi) => {
      if (!selectedLayer) return;
      const layer = selectedLayer;
      const slices = layer.lens.slices.map((s) => ({
        dim: s.dim,
        start: s.start,
        stop: s.stop,
        step: s.step,
      }));

      try {
        await createDataRoi({
          variables: {
            input: {
              dataset: layer.lens.dataset.id,
              drawnOnLens: layer.lens.dataset.dataArrays[0]?.id,
              kind: roi.kind,
              vectors: roi.vectors.map((v) => [v.x, v.y, v.z]),
              slices,
              xDim: layer.xDim,
              yDim: layer.yDim,
              zDim: layer.zDim,
            },
          },
        });
        console.log("Data ROI created successfully");
        removeDrawnRoi(roi.id);
      } catch (err) {
        console.error("Failed to create data ROI:", err);
      }
    },
    [selectedLayer, createDataRoi, removeDrawnRoi],
  );

  const finishShape = useCallback(
    (worldVectors: THREE.Vector3[]) => {
      if (!activeTool || !selectedLayer) return;
      const voxelVectors = worldVectors.map((wv) => {
        const v = worldToVoxel(wv, invAffine);
        return { x: Math.round(v.x), y: Math.round(v.y), z: Math.round(v.z) };
      });
      const worldVecs = worldVectors.map((wv) => ({
        x: wv.x,
        y: wv.y,
        z: wv.z,
      }));

      const roi: DrawnRoi = {
        id: Math.random().toString(36).substring(2, 9),
        layerId: selectedLayer.id,
        kind: DRAWING_TOOL_TO_ROI_KIND[activeTool],
        vectors: voxelVectors,
        worldVectors: worldVecs,
      };

      addDrawnRoi(roi);
      submitRoi(roi);
    },
    [activeTool, selectedLayer, invAffine, addDrawnRoi, submitRoi],
  );

  // Only render when in EDIT mode with an active tool and selected layer
  if (interactionMode !== "EDIT" || !activeTool || !selectedLayer) return null;

  const isPolygonLike = activeTool === "POLYGON" || activeTool === "PATH";

  return (
    <group>
      {/* Invisible interaction plane */}
      <mesh
        position={[0, 0, 0.01]}
        onPointerDown={(e) => {
          if (isPolygonLike) return; // polygon uses click
          e.stopPropagation();
          if (activeTool === "POINT") {
            finishShape([e.point.clone()]);
            return;
          }
          setStartPos(e.point.clone());
        }}
        onPointerMove={(e) => {
          if (isPolygonLike) {
            if (polyPoints.length > 0) {
              setCurrentPos(e.point.clone());
            }
            return;
          }
          if (startPos) {
            e.stopPropagation();
            setCurrentPos(e.point.clone());
          }
        }}
        onPointerUp={(e) => {
          if (isPolygonLike) return;
          if (startPos && currentPos) {
            e.stopPropagation();
            if (activeTool === "LINE") {
              finishShape([startPos, currentPos]);
            } else {
              // Rectangle / Ellipsis: 2 corner vectors
              finishShape([startPos, currentPos]);
            }
          }
          setStartPos(null);
          setCurrentPos(null);
        }}
        onClick={(e) => {
          if (!isPolygonLike) return;
          e.stopPropagation();
          // Double-click to finish polygon
          if (e.detail >= 2 && polyPoints.length >= 2) {
            finishShape([...polyPoints]);
            setPolyPoints([]);
            setCurrentPos(null);
            return;
          }
          setPolyPoints((prev) => [...prev, e.point.clone()]);
        }}
      >
        <planeGeometry args={[80000, 80000]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Live preview for rectangle / ellipsis drag */}
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
