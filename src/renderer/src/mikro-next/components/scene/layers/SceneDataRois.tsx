import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import {
  useGetDataRoisQuery,
  type ListDataRoiFragment,
  RoiKind,
} from "@/mikro-next/api/graphql";
import { buildAffineMatrix } from "../panels/layer/affine-utils";

/** Renders all DataROIs for a single layer, queried by the layer's slices + dataset */
const LayerDataRois = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) => s.layers.find((l) => l.id === layerId));

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

  return (
    <group matrix={affineMatrix} matrixAutoUpdate={false}>
      {rois.map((roi) => (
        <DataRoiShape key={roi.id} roi={roi} />
      ))}
    </group>
  );
};

/** Renders a single DataROI in voxel-space (parent group applies the affine) */
const DataRoiShape = ({ roi }: { roi: ListDataRoiFragment }) => {
  const vectors = roi.vectors; // Array of [x, y, z]
  if (!vectors || vectors.length === 0) return null;

  const Z = 0.15; // slightly above the image plane for visibility

  if (roi.kind === RoiKind.Point && vectors.length >= 1) {
    const [x, y] = vectors[0];
    return (
      <mesh position={[x, y, Z]}>
        <circleGeometry args={[1.5, 16]} />
        <meshBasicMaterial
          color="#38bdf8"
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
        color="#38bdf8"
        lineWidth={2}
      />
    );
  }

  if (roi.kind === RoiKind.Rectangle && vectors.length >= 2) {
    const [x0, y0] = vectors[0];
    const [x1, y1] = vectors[1];
    return (
      <group>
        <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, Z]}>
          <planeGeometry args={[Math.abs(x1 - x0), Math.abs(y1 - y0)]} />
          <meshBasicMaterial
            color="#38bdf8"
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
          color="#38bdf8"
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
    return <Line points={points} color="#38bdf8" lineWidth={1.5} />;
  }

  if (
    (roi.kind === RoiKind.Polygon || roi.kind === RoiKind.Path) &&
    vectors.length >= 2
  ) {
    const pts = vectors.map(
      (v) => [v[0], v[1], Z] as [number, number, number],
    );
    if (roi.kind === RoiKind.Polygon) pts.push(pts[0]); // close polygon
    return <Line points={pts} color="#38bdf8" lineWidth={1.5} />;
  }

  // Fallback: render any shape as a polyline
  if (vectors.length >= 2) {
    return (
      <Line
        points={vectors.map((v) => [v[0], v[1], Z] as [number, number, number])}
        color="#38bdf8"
        lineWidth={1.5}
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
