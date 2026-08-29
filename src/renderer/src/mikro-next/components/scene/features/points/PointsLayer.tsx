/**
 * A point cloud drawn from a table dataset.
 *
 * The layer kind the backend has had all along and nothing drew: `PointLayerRenderer` was
 * `() => null` in `shell/chrome/stubs.tsx`, registered so that implementing it later would be a
 * one-component change. This is that change.
 *
 * It is also the third and last way a sparse dataset gets drawn. Its object axis is identified
 * by a `DATASET` (a mask -> the label layer), a `MESH_COLLECTION` (-> the mesh layer) or a
 * `TABLE` -- and a table's rows have positions and nothing else, so until now they had no
 * renderer. See `docs/visualising-a-sparse-dataset.md`.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import { useAttributeServiceOrNull } from "@/mikro-next/lib/attributes/AttributeServiceProvider";
import { loadSparseSource } from "@/mikro-next/lib/sparse/sparseSource";
import { readColumnByObjectIdCached } from "../../platform/attributes/columnValueCache";
import { accessForTable } from "../../platform/attributes/columnLut";
import { paletteRowFor, DEFAULT_MEASURE_COLORMAP } from "../../platform/attributes/valueLut";
import { isColumnColorBy } from "../../platform/layerui/columnOptions";
import type { SceneLayerFragment } from "@/mikro-next/api/graphql";
import { useSceneStore } from "../../platform/stores/sceneStore";
import { placementToSpatialAffine, spatialAxisTriple } from "@/mikro-next/lib/coords/transformGraph";
import { affineToMatrix4 } from "../../platform/coords/worldTransform";
import { StorageInstancedBufferAttribute } from "three/webgpu";
import { createPointMaterial, setPointValues, type PointMaterialBundle } from "./pointsMaterial";
import {
  createCullPass,
  createScatterPass,
  loadScatterPairs,
  VERTICES_PER_POINT,
  type PointCull,
  type PointScatter,
} from "./pointsCompute";
import { loadPointGeometry, scatterPointValues, type PointGeometry } from "./pointsSource";
import { valueWindowOf } from "../../platform/attributes/valueWindow";

export const PointLayerRenderer = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) => s.sceneLayers.find((candidate) => candidate.id === layerId));
  if (!layer || layer.__typename !== "PointLayer") return null;
  if (!layer.tableDataset) return null;
  return <PointCloud layer={layer} />;
};

type PointLayerView = Extract<SceneLayerFragment, { __typename?: "PointLayer" }>;

const PointCloud = ({ layer }: { layer: PointLayerView }) => {
  const invalidate = useThree((state) => state.invalidate);
  // The WebGPU renderer, for the compute dispatches. `computeAsync` is the documented entry.
  const renderer = useThree((state) => state.gl) as unknown as {
    computeAsync: (node: unknown) => Promise<void>;
  };
  const service = useAttributeServiceOrNull();
  const client = useMikro();
  const datalayer = useDatalayerEndpoint();

  const [geometry, setGeometry] = useState<PointGeometry | null>(null);
  const [skipped, setSkipped] = useState<string[]>([]);
  const bundleRef = useRef<PointMaterialBundle | null>(null);
  const cullRef = useRef<PointCull | null>(null);
  const scatterRef = useRef<PointScatter | null>(null);
  const [bundle, setBundle] = useState<PointMaterialBundle | null>(null);

  const entity = layer as unknown as {
    id: string;
    tableDataset: { id: string; name: string; store: { id: string; bucket: string; key: string } };
    xColumn?: string | null;
    yColumn?: string | null;
    zColumn?: string | null;
    idColumn?: string | null;
    pointSize?: number | null;
    colormap?: string | null;
    visible?: boolean | null;
    opacity?: number | null;
    activeColorBy?: number | null;
    colorBys?: readonly Record<string, unknown>[] | null;
    asAffine?: { matrix: number[][]; inputAxes: string[]; outputAxes: string[] } | null;
    placementInvariance?: string | null;
  };

  // The world's own axis order, needed to read `asAffine`'s ROWS. Not the
  // scene's spatial unit — the names, which mikro writes with x last.
  const worldSystem = useSceneStore((s) => s.transformContext.worldCoordinateSystem);

  /**
   * `asAffine` is `M × (N+1)` over NAMED axes, and both sides need naming
   * separately here:
   *  - COLUMNS are the table's coordinate columns (`TableDataset.coordinateSystem`
   *    — "its axes are the table's coordinate columns"), and which of them is
   *    x/y/z is this layer's own `xColumn`/`yColumn`/`zColumn`. That is also
   *    the order `loadPointGeometry` writes the position buffer in.
   *  - ROWS are the world's axes, in the world's order, and only the ones the
   *    registration constrains.
   * Addressing either side by POSITION transposes the placement, and clamping
   * the translation to column 3 drops it into the z basis on a 2D layer, where
   * z=0 multiplies it away.
   */
  const affine = useMemo(
    () =>
      affineToMatrix4(
        placementToSpatialAffine(
          entity.asAffine,
          [entity.xColumn ?? null, entity.yColumn ?? null, entity.zColumn ?? null],
          spatialAxisTriple(worldSystem),
        ),
      ),
    [entity.asAffine, entity.xColumn, entity.yColumn, entity.zColumn, worldSystem],
  );

  const colorBy = useMemo(() => {
    const index = entity.activeColorBy;
    if (index == null) return null;
    return (entity.colorBys?.[index] ?? null) as never;
  }, [entity.activeColorBy, entity.colorBys]);

  // ------------------------------------------------------------------ positions
  // Read ONCE per table. Positions do not change with a colouring, and re-reading them on every
  // gene switch is the cost this split exists to avoid.
  useEffect(() => {
    const engine = service?.engine;
    if (!engine || !entity.xColumn || !entity.yColumn || !entity.idColumn) return;
    let cancelled = false;
    void loadPointGeometry(engine, entity.tableDataset.store as never, {
      key: entity.idColumn,
      x: entity.xColumn,
      y: entity.yColumn,
      z: entity.zColumn ?? null,
    })
      .then((read) => {
        if (cancelled || !read) return;
        if ("error" in read) {
          setSkipped([read.error]);
          return;
        }
        setSkipped([]);
        setGeometry(read);
      })
      .catch((error: unknown) => {
        if (!cancelled) console.warn("[points] could not read the positions:", error);
      });
    return () => {
      cancelled = true;
    };
  }, [service, entity.tableDataset.store, entity.xColumn, entity.yColumn, entity.zColumn, entity.idColumn]);

  // ------------------------------------------------------------------ the mesh
  useEffect(() => {
    if (!geometry) return;
    // The cull pass first: the material reads through its survivor list, so the two are built
    // together or the draw indexes the wrong points.
    const culling = createCullPass(
      // The material owns the position buffer, so it is created first and handed over.
      new StorageInstancedBufferAttribute(geometry.positions, geometry.stride),
      geometry.count,
      geometry.stride,
    );
    const made = createPointMaterial(geometry.positions, new Float32Array(geometry.count), geometry.stride, {
      attribute: culling.visible,
      count: geometry.count,
    });
    // Capacity is the point count: the worst slice a dataset can produce mentions every object,
    // and a buffer sized for the common case would refuse exactly the dense genes.
    const scattering = createScatterPass(made.values, geometry.count, geometry.count);
    bundleRef.current = made;
    cullRef.current = culling;
    scatterRef.current = scattering;
    setBundle(made);
    return () => {
      made.dispose();
      bundleRef.current = null;
      cullRef.current = null;
      scatterRef.current = null;
      setBundle(null);
    };
  }, [geometry]);

  // ------------------------------------------------------------------ the colouring
  // Keyed on what the colouring READS, not on how it is drawn — the appearance effect below is
  // the one that runs when a colormap or a window moves.
  const dataKey = useMemo(
    () =>
      JSON.stringify(
        colorBy && {
          table: (colorBy as { table?: string }).table ?? null,
          column: (colorBy as { column?: string }).column ?? null,
          dataset: (colorBy as { dataset?: string }).dataset ?? null,
          at: (colorBy as { at?: unknown }).at ?? null,
        },
      ),
    [colorBy],
  );

  useEffect(() => {
    const engine = service?.engine;
    const current = bundleRef.current;
    if (!engine || !geometry || !current) return;
    let cancelled = false;

    void (async () => {
      if (!colorBy) {
        setPointValues(current, new Float32Array(geometry.count), { valueMin: 0, valueMax: 1 });
        current.nodes.uColorize.value = 0;
        invalidate();
        return;
      }

      let byId: Map<number, unknown> = new Map();
      if (isColumnColorBy(colorBy)) {
        // A point layer's objects ARE rows of its own table, so the value is read from it
        // directly — no FIELD edge and no attribute plan, which is the whole difference from
        // a mask or a collection.
        const access =
          (colorBy as { table?: string }).table === entity.tableDataset.id
            ? { store: entity.tableDataset.store as never, keyColumn: entity.idColumn as string }
            : accessForTable([], (colorBy as { table: string }).table, { kind: "mesh" });
        if (!access) return;
        byId = await readColumnByObjectIdCached(engine, access, (colorBy as { column: string }).column);
      } else if (datalayer) {
        const sparse = await loadSparseSource(client, datalayer, (colorBy as { dataset: string }).dataset);
        const read = await sparse.read(
          sparse.source,
          ((colorBy as { at?: { axis: string; value: number }[] }).at ?? []).map((position) => ({
            axis: position.axis,
            value: position.value,
          })),
        );
        byId = read.values as Map<number, unknown>;
      }
      if (cancelled) return;

      const window = valueWindowOf(byId, colorBy as never);
      const scattering = scatterRef.current;
      if (scattering) {
        // The GPU path: upload only the pairs the colouring actually carries and let a compute
        // pass write them. JS never allocates or fills a per-point array, which at a million
        // points is the difference between a switch and a stall.
        const pairs: [number, number][] = [];
        for (const [objectId, raw] of byId) {
          const slot = geometry.slotOf(objectId);
          const value = Number(raw);
          if (slot >= 0 && Number.isFinite(value)) pairs.push([slot, value]);
        }
        if (loadScatterPairs(scattering, pairs, window.valueMin)) {
          void renderer.computeAsync(scattering.node as never);
          current.nodes.uValueMin.value = window.valueMin;
          current.nodes.uValueMax.value = window.valueMax;
          current.nodes.uColorize.value = 1;
          invalidate();
          return;
        }
      }
      // Fallback: a slice larger than the scatter capacity, or no pass built. Correct, just
      // paid for on the CPU.
      const painted = scatterPointValues(geometry, byId, colorBy as never);
      setPointValues(current, painted.values, painted);
      current.nodes.uColorize.value = 1;
      invalidate();
    })().catch((error: unknown) => {
      if (!cancelled) console.warn("[points] could not resolve the colouring:", error);
    });

    return () => {
      cancelled = true;
    };
    // `colorBy` is read inside; `dataKey` decides whether this re-runs, and `client`/`datalayer`
    // are infrastructure that would otherwise rebuild on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, geometry, bundle, dataKey, invalidate]);

  // ------------------------------------------------------------------ appearance
  // Two uniform writes and a 1 KB palette row. Never touches a buffer.
  useEffect(() => {
    const current = bundleRef.current;
    if (!current) return;
    const colormap = ((colorBy as { colormap?: string } | null)?.colormap ??
      entity.colormap ??
      DEFAULT_MEASURE_COLORMAP) as never;
    const row = paletteRowFor(colormap);
    const handle = current.material as unknown as { userData: Record<string, unknown> };
    handle.userData.palette = row;
    current.nodes.uClimMin.value =
      (colorBy as { min?: number | null } | null)?.min ?? Number.NEGATIVE_INFINITY;
    current.nodes.uClimMax.value =
      (colorBy as { max?: number | null } | null)?.max ?? Number.POSITIVE_INFINITY;
    current.nodes.uPointSize.value = entity.pointSize ?? 3;
    current.nodes.uOpacity.value = entity.opacity ?? 1;
    invalidate();
  }, [bundle, colorBy, entity.colormap, entity.pointSize, entity.opacity, invalidate]);

  // ------------------------------------------------------------------ culling
  // Re-run when the view moves, not every frame: the survivor list is only wrong once the
  // camera has actually changed what is on screen, and a dispatch per frame would spend more
  // than the culling saves at the sizes this layer is capped to.
  const cullBounds = useSceneStore((s) => s.transformContext);
  useEffect(() => {
    const culling = cullRef.current;
    if (!culling || !geometry) return;
    // The box is in the DATA's own space, because the layer's affine sits between it and the
    // world -- testing in world space would need the inverse per point. Unbounded until a
    // viewport box is threaded through, at which point this is the one place to set it.
    culling.bounds.min.value = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    culling.bounds.max.value = new THREE.Vector3(Infinity, Infinity, Infinity);
    void renderer.computeAsync(culling.node as never).then(() => invalidate());
    // `renderer` and `invalidate` are stable infrastructure; the view is what re-runs this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry, bundle, cullBounds]);

  useEffect(() => {
    if (skipped.length > 0) console.warn("[points] not drawn:", skipped);
  }, [skipped]);

  // A world-space point size is a well-defined length only from SIMILARITY up; below it the
  // number still draws but means nothing, so say so rather than implying a scale.
  useEffect(() => {
    const invariance = entity.placementInvariance;
    if (invariance && invariance !== "ISOMETRY" && invariance !== "SIMILARITY") {
      console.warn(
        `[points] this layer's placement is ${invariance}, so 'pointSize' in scene units is not a well-defined length here`,
      );
    }
  }, [entity.placementInvariance]);

  if (entity.visible === false || !bundle || !geometry) return null;

  return (
    <group matrix={affine} matrixAutoUpdate={false}>
      <mesh
        frustumCulled={false}
        // Six vertices per instance, one instance per point. The geometry carries no
        // attributes: the corner comes from `vertexIndex` and the position from a storage
        // buffer indexed by `instanceIndex`.
        args={[undefined, bundle.material]}
      >
        <bufferGeometry
          ref={(node) => {
            if (!node) return;
            node.setDrawRange(0, VERTICES_PER_POINT);
            // The cull pass writes `instanceCount` into the indirect buffer, so the GPU decides
            // how many points to draw. `instanceCount` here is only the ceiling.
            const culling = cullRef.current;
            if (culling) node.setIndirect(culling.indirect);
            (node as unknown as { instanceCount: number }).instanceCount = bundle.count;
          }}
        />
      </mesh>
    </group>
  );
};
