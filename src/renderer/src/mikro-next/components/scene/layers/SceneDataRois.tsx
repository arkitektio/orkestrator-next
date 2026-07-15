import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Line } from "../primitives/Line";
import type { ThreeEvent } from "@react-three/fiber";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import { useModeStore } from "../store/modeStore";
import {
  type RoiBounds,
  useRoiSelectionStore,
} from "../store/roiSelectionStore";
import {
  useGetDataRoisQuery,
  type ListDataRoiFragment,
  RoiKind,
} from "@/mikro-next/api/graphql";
import { buildAffineMatrix } from "../core/worldTransform";

const ROI_RENDER_Z = 0.15;
const MIN_DEPTH = 0.001;

function getVectorPoint(vector: number[], flattenToPlane: boolean): [number, number, number] {
  return [vector[0] ?? 0, vector[1] ?? 0, flattenToPlane ? ROI_RENDER_Z : (vector[2] ?? 0)];
}

function getRectangleCorners(
  start: number[],
  end: number[],
  flattenToPlane: boolean,
): [number, number, number][] {
  const [x0, y0, z0] = getVectorPoint(start, flattenToPlane);
  const [x1, y1, z1] = getVectorPoint(end, flattenToPlane);

  if (flattenToPlane || Math.abs(z1 - z0) < MIN_DEPTH) {
    return [
      [x0, y0, z0],
      [x1, y0, z0],
      [x1, y1, z0],
      [x0, y1, z0],
    ];
  }

  return [
    [x0, y0, z0],
    [x1, y0, z0],
    [x1, y1, z0],
    [x0, y1, z0],
    [x0, y0, z1],
    [x1, y0, z1],
    [x1, y1, z1],
    [x0, y1, z1],
  ];
}

function getEllipsisPoints(
  start: number[],
  end: number[],
  flattenToPlane: boolean,
  segments = 24,
): [number, number, number][] {
  const [x0, y0, z0] = getVectorPoint(start, flattenToPlane);
  const [x1, y1, z1] = getVectorPoint(end, flattenToPlane);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const rx = Math.abs(x1 - x0) / 2;
  const ry = Math.abs(y1 - y0) / 2;
  const points: [number, number, number][] = [];

  for (let index = 0; index < segments; index += 1) {
    const theta = (index / segments) * Math.PI * 2;
    points.push([
      cx + rx * Math.cos(theta),
      cy + ry * Math.sin(theta),
      z0,
    ]);
  }

  if (!flattenToPlane && Math.abs(z1 - z0) >= MIN_DEPTH) {
    for (let index = 0; index < segments; index += 1) {
      const theta = (index / segments) * Math.PI * 2;
      points.push([
        cx + rx * Math.cos(theta),
        cy + ry * Math.sin(theta),
        z1,
      ]);
    }
  }

  return points;
}

function getRoiSelectionPoints(
  roi: ListDataRoiFragment,
  flattenToPlane: boolean,
): [number, number, number][] {
  const vectors = roi.vectors;
  if (!vectors || vectors.length === 0) return [];

  if (roi.kind === RoiKind.Point && vectors.length >= 1) {
    return [getVectorPoint(vectors[0], flattenToPlane)];
  }

  if (roi.kind === RoiKind.Line && vectors.length >= 2) {
    return vectors.map((vector) => getVectorPoint(vector, flattenToPlane));
  }

  if (roi.kind === RoiKind.Rectangle && vectors.length >= 2) {
    return getRectangleCorners(vectors[0], vectors[1], flattenToPlane);
  }

  if (roi.kind === RoiKind.Ellipsis && vectors.length >= 2) {
    return getEllipsisPoints(vectors[0], vectors[1], flattenToPlane);
  }

  return vectors.map((vector) => getVectorPoint(vector, flattenToPlane));
}

function getWorldBounds(
  roi: ListDataRoiFragment,
  affineMatrix: THREE.Matrix4,
): RoiBounds | null {
  const points = getRoiSelectionPoints(roi, false);
  if (points.length === 0) return null;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  points.forEach(([x, y, z]) => {
    const world = new THREE.Vector3(x, y, z).applyMatrix4(affineMatrix);
    minX = Math.min(minX, world.x);
    maxX = Math.max(maxX, world.x);
    minY = Math.min(minY, world.y);
    maxY = Math.max(maxY, world.y);
  });

  return { minX, maxX, minY, maxY };
}

/** Renders all DataROIs for a single layer, queried by the layer's slices + dataset */
const LayerDataRois = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) => s.layers.find((l) => l.id === layerId));
  const displayMode = useModeStore((s) => s.displayMode);
  const selectedRois = useRoiSelectionStore((s) => s.selectedRois);
  const selectOnlyRoi = useRoiSelectionStore((s) => s.selectOnlyRoi);
  const toggleSelectedRoi = useRoiSelectionStore((s) => s.toggleSelectedRoi);
  const setVisibleLayerRois = useRoiSelectionStore((s) => s.setVisibleLayerRois);
  const clearVisibleLayerRois = useRoiSelectionStore((s) => s.clearVisibleLayerRois);

  const sliceFilter = useMemo(() => {
    if (!layer) return undefined;
    return layer.lens.slices.map((s) => ({
      dim: s.axis,
      start: s.start,
      stop: s.stop,
      step: s.step,
    }));
  }, [layer]);

  const { data } = useGetDataRoisQuery({
    variables: {
      filters: {
        // `DataRoiFilter` has no server-side "active for these slices" filter;
        // `sliceFilter` is still used below purely as a query-readiness gate.
        dataset: layer ? layer.lens.dataset.id : undefined,
      },
    },
    skip: !layer || !sliceFilter,
    pollInterval: 5000,
  });

  const affineMatrix = useMemo(() => {
    if (!layer) return new THREE.Matrix4().identity();
    return buildAffineMatrix(layer);
  }, [layer]);

  const rois = data?.dataRois;
  const visibleRois = useMemo(() => {
    if (!rois || !layer) return [];

    return rois
      .map((roi) => {
        const bounds = getWorldBounds(roi, affineMatrix);
        if (!bounds) return null;

        return {
          id: roi.id,
          layerId,
          name: roi.name,
          kind: roi.kind,
          bounds,
        };
      })
      .filter((roi): roi is NonNullable<typeof roi> => roi !== null);
  }, [affineMatrix, layer, layerId, rois]);

  useEffect(() => {
    setVisibleLayerRois(layerId, visibleRois);

    return () => {
      clearVisibleLayerRois(layerId);
    };
  }, [clearVisibleLayerRois, layerId, setVisibleLayerRois, visibleRois]);

  if (!rois || rois.length === 0) return null;
  const selectedRoiIds = new Set(selectedRois.map((roi) => roi.id));

  return (
    <group matrix={affineMatrix} matrixAutoUpdate={false}>
      {rois.map((roi) => (
        <DataRoiShape
          key={roi.id}
          roi={roi}
          flattenToPlane={displayMode !== "3D"}
          isActive={selectedRoiIds.has(roi.id)}
          onSelect={(appendSelection) => {
            const selectedRoi = {
              id: roi.id,
              layerId,
              name: roi.name,
              kind: roi.kind,
            };

            if (appendSelection) {
              toggleSelectedRoi(selectedRoi);
              return;
            }

            selectOnlyRoi(selectedRoi);
          }}
        />
      ))}
    </group>
  );
};

/** Renders a single DataROI in voxel-space (parent group applies the affine) */
const DataRoiShape = ({
  roi,
  flattenToPlane,
  isActive,
  onSelect,
}: {
  roi: ListDataRoiFragment;
  flattenToPlane: boolean;
  isActive: boolean;
  onSelect: (appendSelection: boolean) => void;
}) => {
  const vectors = roi.vectors; // Array of [x, y, z]
  if (!vectors || vectors.length === 0) return null;

  const strokeColor = isActive ? "#f59e0b" : "#38bdf8";

  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(event.nativeEvent.shiftKey);
  };

  if (roi.kind === RoiKind.Point && vectors.length >= 1) {
    const [x, y, z] = getVectorPoint(vectors[0], flattenToPlane);
    return (
      <mesh position={[x, y, z]} onClick={handleSelect}>
        <circleGeometry args={[1.5, 16]} />
        <meshBasicMaterial
          color={strokeColor}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }

  if (roi.kind === RoiKind.Line && vectors.length >= 2) {
    return (
      <Line
        points={vectors.map((vector) => getVectorPoint(vector, flattenToPlane))}
        color={strokeColor}
        lineWidth={2}
        onClick={handleSelect}
      />
    );
  }

  if (roi.kind === RoiKind.Rectangle && vectors.length >= 2) {
    const [[x0, y0, z0], [x1, y1, z1]] = vectors.map((vector) =>
      getVectorPoint(vector, flattenToPlane),
    );
    const width = Math.abs(x1 - x0);
    const height = Math.abs(y1 - y0);
    const depth = Math.abs(z1 - z0);

    if (!flattenToPlane && depth >= MIN_DEPTH) {
      const centerX = (x0 + x1) / 2;
      const centerY = (y0 + y1) / 2;
      const centerZ = (z0 + z1) / 2;

      return (
        <group onClick={handleSelect}>
          <mesh position={[centerX, centerY, centerZ]}>
            <boxGeometry args={[width, height, depth]} />
            <meshBasicMaterial
              color={strokeColor}
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[centerX, centerY, centerZ]}>
            <boxGeometry args={[width, height, depth]} />
            <meshBasicMaterial
              color={strokeColor}
              wireframe
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>
      );
    }

    return (
      <group onClick={handleSelect}>
        <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, z0]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            color={strokeColor}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Line
          points={[
            [x0, y0, z0],
            [x1, y0, z0],
            [x1, y1, z0],
            [x0, y1, z0],
            [x0, y0, z0],
          ]}
          color={strokeColor}
          lineWidth={1.5}
        />
      </group>
    );
  }

  if (roi.kind === RoiKind.Ellipsis && vectors.length >= 2) {
    const [[x0, y0, z0], [x1, y1, z1]] = vectors.map((vector) =>
      getVectorPoint(vector, flattenToPlane),
    );
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const cz = (z0 + z1) / 2;
    const rx = Math.abs(x1 - x0) / 2;
    const ry = Math.abs(y1 - y0) / 2;
    const rz = Math.abs(z1 - z0) / 2;

    if (!flattenToPlane && rz >= MIN_DEPTH) {
      return (
        <group onClick={handleSelect}>
          <mesh position={[cx, cy, cz]} scale={[rx, ry, rz]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshBasicMaterial
              color={strokeColor}
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[cx, cy, cz]} scale={[rx, ry, rz]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshBasicMaterial
              color={strokeColor}
              wireframe
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>
      );
    }

    const points = getEllipsisPoints(vectors[0], vectors[1], flattenToPlane, 48);
    if (flattenToPlane || Math.abs(z1 - z0) < MIN_DEPTH) {
      points.push(points[0]);
    }

    return <Line points={points} color={strokeColor} lineWidth={1.5} onClick={handleSelect} />;
  }

  if (
    (roi.kind === RoiKind.Polygon || roi.kind === RoiKind.Path) &&
    vectors.length >= 2
  ) {
    const pts = vectors.map((vector) => getVectorPoint(vector, flattenToPlane));
    if (roi.kind === RoiKind.Polygon) pts.push(pts[0]); // close polygon
    return <Line points={pts} color={strokeColor} lineWidth={1.5} onClick={handleSelect} />;
  }

  // Fallback: render any shape as a polyline
  if (vectors.length >= 2) {
    return (
      <Line
        points={vectors.map((vector) => getVectorPoint(vector, flattenToPlane))}
        color={strokeColor}
        lineWidth={1.5}
        onClick={handleSelect}
      />
    );
  }

  return null;
};

/** Top-level component: renders DataROIs for all visible layers */
export const SceneDataRois = () => {
  const visibleLayers = useViewerStore((s) => s.visibleLayers);
  const layers = useSceneStore((s) => s.layers);
  const displayMode = useModeStore((s) => s.displayMode);

  // Only render for layers that are currently visible
  const visibleLayerIds = useMemo(
    () => layers
      .filter((layer) => layer.visible !== false)
      .filter((layer) => displayMode === "3D" || visibleLayers.includes(layer.id))
      .map((layer) => layer.id),
    [displayMode, layers, visibleLayers],
  );

  return (
    <group>
      {visibleLayerIds.map((id) => (
        <LayerDataRois key={id} layerId={id} />
      ))}
    </group>
  );
};
