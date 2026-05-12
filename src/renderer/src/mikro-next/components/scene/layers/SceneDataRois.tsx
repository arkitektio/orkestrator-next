import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import {
  type RoiBounds,
  useRoiSelectionStore,
} from "../store/roiSelectionStore";
import {
  useGetDataRoisQuery,
  type ListDataRoiFragment,
  RoiKind,
} from "@/mikro-next/api/graphql";
import { buildAffineMatrix } from "../panels/layer/affine-utils";

const ROI_RENDER_Z = 0.15;

function getRoiSelectionPoints(roi: ListDataRoiFragment): [number, number, number][] {
  const vectors = roi.vectors;
  if (!vectors || vectors.length === 0) return [];

  if (roi.kind === RoiKind.Point && vectors.length >= 1) {
    const [x, y] = vectors[0];
    return [[x, y, ROI_RENDER_Z]];
  }

  if (roi.kind === RoiKind.Line && vectors.length >= 2) {
    return vectors.map((v) => [v[0], v[1], ROI_RENDER_Z] as [number, number, number]);
  }

  if (roi.kind === RoiKind.Rectangle && vectors.length >= 2) {
    const [x0, y0] = vectors[0];
    const [x1, y1] = vectors[1];
    return [
      [x0, y0, ROI_RENDER_Z],
      [x1, y0, ROI_RENDER_Z],
      [x1, y1, ROI_RENDER_Z],
      [x0, y1, ROI_RENDER_Z],
    ];
  }

  if (roi.kind === RoiKind.Ellipsis && vectors.length >= 2) {
    const [x0, y0] = vectors[0];
    const [x1, y1] = vectors[1];
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const rx = Math.abs(x1 - x0) / 2;
    const ry = Math.abs(y1 - y0) / 2;
    const segments = 24;
    const points: [number, number, number][] = [];

    for (let index = 0; index < segments; index += 1) {
      const theta = (index / segments) * Math.PI * 2;
      points.push([
        cx + rx * Math.cos(theta),
        cy + ry * Math.sin(theta),
        ROI_RENDER_Z,
      ]);
    }

    return points;
  }

  return vectors.map((v) => [v[0], v[1], ROI_RENDER_Z] as [number, number, number]);
}

function getWorldBounds(
  roi: ListDataRoiFragment,
  affineMatrix: THREE.Matrix4,
): RoiBounds | null {
  const points = getRoiSelectionPoints(roi);
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
  const selectedRois = useRoiSelectionStore((s) => s.selectedRois);
  const selectOnlyRoi = useRoiSelectionStore((s) => s.selectOnlyRoi);
  const toggleSelectedRoi = useRoiSelectionStore((s) => s.toggleSelectedRoi);
  const setVisibleLayerRois = useRoiSelectionStore((s) => s.setVisibleLayerRois);
  const clearVisibleLayerRois = useRoiSelectionStore((s) => s.clearVisibleLayerRois);

  const sliceFilter = useMemo(() => {
    if (!layer) return undefined;
    return layer.lens.slices.map((s) => ({
      dim: s.dim,
      start: s.start,
      stop: s.stop,
      step: s.step,
    }));
  }, [layer]);

  const { data } = useGetDataRoisQuery({
    variables: {
      filters: {
        activeFor: sliceFilter,
        dataset: layer ? { exact: layer.lens.dataset.id } : undefined,
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
  isActive,
  onSelect,
}: {
  roi: ListDataRoiFragment;
  isActive: boolean;
  onSelect: (appendSelection: boolean) => void;
}) => {
  const vectors = roi.vectors; // Array of [x, y, z]
  if (!vectors || vectors.length === 0) return null;

  const Z = ROI_RENDER_Z; // slightly above the image plane for visibility
  const strokeColor = isActive ? "#f59e0b" : "#38bdf8";

  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(event.nativeEvent.shiftKey);
  };

  if (roi.kind === RoiKind.Point && vectors.length >= 1) {
    const [x, y] = vectors[0];
    return (
      <mesh position={[x, y, Z]} onClick={handleSelect}>
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
        points={vectors.map((v) => [v[0], v[1], Z] as [number, number, number])}
        color={strokeColor}
        lineWidth={2}
        onClick={handleSelect}
      />
    );
  }

  if (roi.kind === RoiKind.Rectangle && vectors.length >= 2) {
    const [x0, y0] = vectors[0];
    const [x1, y1] = vectors[1];
    return (
      <group onClick={handleSelect}>
        <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, Z]}>
          <planeGeometry args={[Math.abs(x1 - x0), Math.abs(y1 - y0)]} />
          <meshBasicMaterial
            color={strokeColor}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Line
          points={[
            [x0, y0, Z],
            [x1, y0, Z],
            [x1, y1, Z],
            [x0, y1, Z],
            [x0, y0, Z],
          ]}
          color={strokeColor}
          lineWidth={1.5}
        />
      </group>
    );
  }

  if (roi.kind === RoiKind.Ellipsis && vectors.length >= 2) {
    const [x0, y0] = vectors[0];
    const [x1, y1] = vectors[1];
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const rx = Math.abs(x1 - x0) / 2;
    const ry = Math.abs(y1 - y0) / 2;
    const segments = 48;
    const points: [number, number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push([cx + rx * Math.cos(theta), cy + ry * Math.sin(theta), Z]);
    }
    return <Line points={points} color={strokeColor} lineWidth={1.5} onClick={handleSelect} />;
  }

  if (
    (roi.kind === RoiKind.Polygon || roi.kind === RoiKind.Path) &&
    vectors.length >= 2
  ) {
    const pts = vectors.map(
      (v) => [v[0], v[1], Z] as [number, number, number],
    );
    if (roi.kind === RoiKind.Polygon) pts.push(pts[0]); // close polygon
    return <Line points={pts} color={strokeColor} lineWidth={1.5} onClick={handleSelect} />;
  }

  // Fallback: render any shape as a polyline
  if (vectors.length >= 2) {
    return (
      <Line
        points={vectors.map((v) => [v[0], v[1], Z] as [number, number, number])}
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

  // Only render for layers that are currently visible
  const visibleLayerIds = useMemo(
    () => layers.filter((l) => visibleLayers.includes(l.id)).map((l) => l.id),
    [layers, visibleLayers],
  );

  return (
    <group>
      {visibleLayerIds.map((id) => (
        <LayerDataRois key={id} layerId={id} />
      ))}
    </group>
  );
};
