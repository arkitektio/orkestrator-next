import { useMemo, useState } from "react";
import * as THREE from "three";
import { Html, Line } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import {
  useGetDataRoisQuery,
  type ListDataRoiFragment,
  RoiKind,
} from "@/mikro-next/api/graphql";
import { buildAffineMatrix } from "../panels/layer/affine-utils";
import { useNavigate } from "react-router";

/** Renders all DataROIs for a single layer, queried by the layer's slices + dataset */
const LayerDataRois = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) => s.layers.find((l) => l.id === layerId));
  const [activeRoiId, setActiveRoiId] = useState<string | null>(null);

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
  if (!rois || rois.length === 0) return null;

  const activeRoi = rois.find((roi) => roi.id === activeRoiId) ?? null;

  return (
    <group matrix={affineMatrix} matrixAutoUpdate={false}>
      {rois.map((roi) => (
        <DataRoiShape
          key={roi.id}
          roi={roi}
          isActive={roi.id === activeRoiId}
          onSelect={() => setActiveRoiId((current) => current === roi.id ? null : roi.id)}
        />
      ))}
      {activeRoi && (
        <DataRoiPopover roi={activeRoi} onClose={() => setActiveRoiId(null)} />
      )}
    </group>
  );
};

const getRoiAnchor = (roi: ListDataRoiFragment): [number, number, number] => {
  const vectors = roi.vectors;
  if (!vectors || vectors.length === 0) return [0, 0, 0.2];

  if (roi.kind === RoiKind.Rectangle || roi.kind === RoiKind.Ellipsis) {
    const [start, end] = vectors;
    if (start && end) {
      return [
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
        0.2,
      ];
    }
  }

  const sums = vectors.reduce(
    (acc, vector) => {
      acc.x += vector[0] ?? 0;
      acc.y += vector[1] ?? 0;
      acc.z += vector[2] ?? 0;
      return acc;
    },
    { x: 0, y: 0, z: 0 },
  );

  return [
    sums.x / vectors.length,
    sums.y / vectors.length,
    (sums.z / vectors.length) + 0.2,
  ];
};

const DataRoiPopover = ({
  roi,
  onClose,
}: {
  roi: ListDataRoiFragment;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const [x, y, z] = getRoiAnchor(roi);

  return (
    <Html position={[x, y, z]} center distanceFactor={1.2}>
      <Card className="min-w-[180px] border-white/10 bg-black/85 p-3 text-white shadow-xl backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-300">
              Data ROI
            </div>
            <div className="truncate text-xs font-medium text-white/90">
              {roi.name || `ROI ${roi.id}`}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[10px] text-white/45 transition-colors hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="mt-2 rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-white/65">
          {roi.id}
        </div>
        <Button
          size="xs"
          className="mt-2 w-full"
          onClick={() => navigate(`/mikro/rois/${roi.id}`)}
        >
          Open Data ROI
        </Button>
      </Card>
    </Html>
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
  onSelect: () => void;
}) => {
  const vectors = roi.vectors; // Array of [x, y, z]
  if (!vectors || vectors.length === 0) return null;

  const Z = 0.15; // slightly above the image plane for visibility
  const strokeColor = isActive ? "#f59e0b" : "#38bdf8";

  const handleSelect = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onSelect();
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
