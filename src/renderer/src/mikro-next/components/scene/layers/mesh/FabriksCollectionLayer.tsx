import { useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";

import { createRafCoalescer } from "../../core/probe/rafCoalesce";
import { sceneZExtent } from "../../core/worldTransform";
import { useModeStore } from "../../store/modeStore";
import { isDrawingTool, useRoiDrawingStore } from "../../store/roiDrawingStore";
import { perfMonitor } from "../../managers/perfMonitor";
import {
  clickProbeEnabled,
  hoverProbeEnabled,
  type ProbeGateInput,
} from "../../core/probe/probeGating";
import { useSceneStore, type MeshLayerSessionState } from "../../store/sceneStore";
import { useViewerStore, useViewerStoreApi } from "../../store/viewerStore";
import { useViewStoreApi } from "../../store/viewStore";
import { FabriksCollection } from "../../render/fabriks/fabriksCollection";
import { FabriksCollectionManager } from "../../render/fabriks/fabriksManager";
import { openFabriksCollection } from "../../render/fabriks/fabriksSource";
import { buildColorLut } from "../../render/fabriks/fabriksColorLut";
import { useAttributeServiceOrNull } from "@/mikro-next/lib/attributes/AttributeServiceProvider";
import {
  resolveCollectionMatrix,
  type MeshCollectionRef,
  type MeshLayerVariant,
} from "./collectionPlacement";

/**
 * MeshLayer renderer: a fabriks collection — a self-describing prefix of
 * Parquet files — streamed by row group and placed by its own `pathToWorld`
 * composed through the scene's transform graph, nothing else
 * (`collectionPlacement.ts`; COORDINATE_SYSTEMS.md "Coordinate conventions").
 *
 * The React layer owns only lifecycle, transform resolution and the settle
 * cadence. Planning and streaming live in `FabriksCollectionManager`
 * (imperative — no React re-render per batch, OCTREE_RENDERER.md P17), the
 * read plan in `FabriksCollection`, and the byte contract in `fabriksDecode`.
 */

export const FabriksCollectionLayer = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) =>
    s.sceneLayers.find((candidate) => candidate.id === layerId),
  );
  if (!layer || layer.__typename !== "MeshLayer") return null;
  if (!layer.collection || layer.visible === false) return null;
  return <FabriksCollectionGroup layer={layer} collection={layer.collection} />;
};

/** The fragment plus the card's session-local render state. */
type MeshLayerView = MeshLayerVariant & MeshLayerSessionState;

/** The card's LOD presets → the planner's pixel-error budget. */
const DETAIL_BUDGETS = { fine: 1, balanced: 2, fast: 4 } as const;

const FabriksCollectionGroup = ({
  layer,
  collection,
}: {
  layer: MeshLayerView;
  collection: MeshCollectionRef;
}) => {
  const invalidate = useThree((state) => state.invalidate);
  const transformContext = useSceneStore((s) => s.transformContext);
  const viewApi = useViewStoreApi();
  const viewerApi = useViewerStoreApi();
  const datalayer = useDatalayerEndpoint();
  const client = useMikro();

  // Streaming-cadence stats → debug-only `meshVersion`, throttled here so the
  // manager stays cadence-blind and the store sees at most ~8 writes/s.
  const onStatsChanged = useMemo(() => {
    let last = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const bump = () => {
      last = performance.now();
      viewerApi.getState().bumpMeshVersion();
    };
    return () => {
      const elapsed = performance.now() - last;
      if (elapsed >= 120) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        bump();
      } else if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          bump();
        }, 120 - elapsed);
      }
    };
  }, [viewerApi]);

  // VALUE-stable: the memo's inputs churn identity on unrelated store writes,
  // so a recompute that lands on the same placement must return the SAME
  // Matrix4 — downstream effects key on it, and a fresh-but-equal instance
  // used to rebuild the whole manager and refetch every cell.
  const matrixRef = useRef<THREE.Matrix4 | null>(null);
  const matrix = useMemo(() => {
    const next = resolveCollectionMatrix(layer, collection, transformContext);
    if (matrixRef.current?.equals(next)) return matrixRef.current;
    matrixRef.current = next;
    return next;
  }, [layer, collection, transformContext]);

  // Opening reads fabriks.json and nothing else; the catalogs come with the
  // first plan. Collections are immutable per version, so the open survives as
  // long as (collection, version).
  const [opened, setOpened] = useState<FabriksCollection | null>(null);
  useEffect(() => {
    if (!datalayer) return; // no endpoint configured: nothing to read from
    let cancelled = false;
    openFabriksCollection(collection, client, datalayer)
      .then((next) => {
        if (!cancelled) setOpened(next);
      })
      .catch((error) => console.error(`[fabriks] cannot open collection ${collection.id}:`, error));
    return () => {
      cancelled = true;
    };
  }, [collection, client, datalayer]);

  // Keyed on the OPEN alone. A placement change goes through
  // `setVoxelToWorld` below — index rebuild and replan, caches untouched —
  // never through a manager rebuild, which would refetch everything.
  const manager = useMemo(() => {
    if (!opened) return null;
    return new FabriksCollectionManager({
      collection: opened,
      loadDecoder: async () => {
        await MeshoptDecoder.ready;
        return MeshoptDecoder;
      },
      onInvalidate: invalidate,
      onStatsChanged,
    });
  }, [opened, invalidate, onStatsChanged]);

  useEffect(() => () => manager?.dispose(), [manager]);

  // Placement, applied before the first plan (effects run in order) and again
  // on any real change. Value-equal matrices are a no-op inside the manager.
  useEffect(() => {
    manager?.setVoxelToWorld(matrix);
  }, [manager, matrix]);

  // Debug registration: DebugPanel reads stats and steers the planner through
  // this handle — the mesh twin of registerBrickSystem.
  useEffect(() => {
    if (!manager) return;
    const { registerMeshSystem, bumpMeshVersion } = viewerApi.getState();
    registerMeshSystem(layer.id, manager);
    bumpMeshVersion();
    return () => {
      viewerApi.getState().registerMeshSystem(layer.id, null);
    };
  }, [manager, viewerApi, layer.id]);

  useEffect(() => {
    manager?.setMaterialConfig({
      color: layer.materialColor,
      wireframe: layer.wireframe,
      opacity: layer.opacity,
      instanceColormap: layer.instanceColormap,
      colorByInstance: layer.colorByInstance,
      doubleSided: layer.doubleSided,
    });
    invalidate();
  }, [
    manager,
    layer.materialColor,
    layer.wireframe,
    layer.opacity,
    layer.instanceColormap,
    layer.colorByInstance,
    layer.doubleSided,
    invalidate,
  ]);

  /**
   * The layer's STORED pickers, resolved to pixels.
   *
   * `colorBys` / `filterBys` are what the layer offers and the two active
   * indices are the choice; everything below the choice — which table, which
   * column, which rows — is data this API never returns. It is read out of the
   * table's parquet with the same DuckDB and the same grants the attribute
   * probe uses, baked into an ordinal-indexed texture
   * (`fabriksColorLut.ts`), and handed to the material as one bind.
   *
   * Nothing active means no LUT at all, not an all-white one: the placeholder
   * is already the identity, and skipping the read is what keeps a layer with
   * no colouring exactly as cheap as it was before any of this existed.
   */
  const attributeService = useAttributeServiceOrNull();
  const activeColorByIndex = layer.activeColorBy ?? null;
  const colorBy =
    activeColorByIndex === null ? null : (layer.colorBys?.[activeColorByIndex] ?? null);
  const filterBys = layer.filterBys;
  const activeFilterBys = layer.activeFilterBys;
  const activeRules = useMemo(
    () =>
      (activeFilterBys ?? [])
        .map((index) => filterBys?.[index])
        .filter((rule): rule is NonNullable<typeof rule> => Boolean(rule)),
    [activeFilterBys, filterBys],
  );
  const systemId = collection.coordinateSystem?.id ?? null;
  /**
   * A CONTENT key, not the object references, because the fold after a picker
   * mutation writes the server's arrays back with `Object.assign` into an immer
   * draft — whether that yields new array identities is structural sharing's
   * call, not ours. Depending on references would let an edited bound show in
   * the card while the meshes kept the old one.
   */
  const lutKey = useMemo(() => JSON.stringify([colorBy, activeRules]), [colorBy, activeRules]);

  useEffect(() => {
    if (!manager) return;
    if (!attributeService || !systemId || (!colorBy && activeRules.length === 0)) {
      manager.setColorLut(null, { colorize: false, filter: false });
      return;
    }
    let cancelled = false;
    void (async () => {
      // The object catalog is shared with picking, so this is free once
      // anything has resolved an ordinal — and vice versa.
      const [objects, plans] = await Promise.all([
        manager.listObjects(),
        attributeService.plansFor(systemId),
      ]);
      if (cancelled) return;
      const lut = await buildColorLut({
        objects,
        colorBy,
        filterBys: activeRules,
        plans,
        engine: attributeService.engine,
      });
      // A superseded build must not reach the GPU, and its texture is ours to
      // free — `setColorLut` only ever disposes what it replaces.
      if (cancelled) {
        lut.texture.dispose();
        return;
      }
      if (lut.skipped.length > 0) {
        console.warn("[mesh] picker entries that do not render yet:", lut.skipped);
      }
      manager.setColorLut(lut, {
        colorize: colorBy !== null,
        filter: activeRules.length > 0,
      });
      invalidate();
    })().catch((error) => {
      if (cancelled) return;
      console.warn("[mesh] could not build the colour lookup:", error);
      manager.setColorLut(null, { colorize: false, filter: false });
    });
    return () => {
      cancelled = true;
    };
    // `colorBy` / `activeRules` are read inside the effect; `lutKey` is what
    // decides whether it re-runs. See the note on the key itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager, attributeService, systemId, lutKey, invalidate]);

  // Per-layer LOD preset: replans immediately against the last settle.
  useEffect(() => {
    manager?.setPlanConfig({ pixelBudget: DETAIL_BUDGETS[layer.detail ?? "fine"] });
  }, [manager, layer.detail]);

  useEffect(() => {
    manager?.setFlatNormals(layer.flatNormals ?? true);
    invalidate();
  }, [manager, layer.flatNormals, invalidate]);

  // The scene-wide picked instance, pushed into this layer's shader uniforms
  // (highlight/isolate) — uniform writes only, never a recompile.
  const meshSelection = useViewerStore((s) => s.meshSelection);
  useEffect(() => {
    if (!manager) return;
    manager.setSelection(
      meshSelection && meshSelection.layerId === layer.id
        ? { ordinal: meshSelection.ordinal, isolate: meshSelection.isolate }
        : null,
    );
    invalidate();
  }, [manager, meshSelection, layer.id, invalidate]);

  // Planning cadence: once the cell index is in, plan on mount and on every
  // camera SETTLE — never per camera tick.
  useEffect(() => {
    if (!manager) return;
    let cancelled = false;

    const plan = () => {
      if (cancelled) return;
      const { viewProjectionMatrix, viewportSize, cameraPose } = viewApi.getState();
      if (!viewProjectionMatrix) return;

      // WORLD space throughout: the cell index was transformed once at load,
      // so there is no inverse-matrix pull-through and no per-plan clone, and
      // an anisotropic voxel grid cannot skew the error test.
      const frustum = new THREE.Frustum().setFromProjectionMatrix(viewProjectionMatrix);
      let cameraPosition: [number, number, number] | null = null;
      let focalPixels = 0;
      let errorBudget: number | undefined;
      if (cameraPose?.isPerspective && cameraPose.fovY > 0) {
        cameraPosition = [...cameraPose.position] as [number, number, number];
        // An object of world size s at distance d covers s·focalPixels/d px.
        focalPixels = (0.5 * viewportSize.height) / Math.tan(0.5 * cameraPose.fovY);
      } else {
        // Ortho (2D): distance-independent LOD via the planner's camera-free
        // branch — allow a world-space error worth `pixelBudget` on-screen
        // pixels at the current zoom. Without this an ortho plan refines
        // everything to level 0.
        errorBudget =
          manager.getPlanConfig().pixelBudget * viewerApi.getState().worldUnitsPerPixel;
      }
      // Budgets (pixelBudget, maxCells) live in the manager's plan config so
      // the debug panel can steer them between settles.
      manager.updatePlan({ frustum, cameraPosition, focalPixels, errorBudget });
    };

    manager
      .ensureIndex()
      .then(plan)
      .catch((error) => console.error("[fabriks] failed to load the cell catalog:", error));

    const unsubscribe = viewApi.subscribe((state, prev) => {
      if (prev.cameraMoving && !state.cameraMoving) plan();
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [manager, viewApi, viewerApi]);

  // 2D slab: clip the collection to one z-step around the displayed slice
  // (the annotation layer's slab convention). Thickness comes from the finest
  // image layer's z-step; a scene without one falls back to one mesh voxel
  // (the placement matrix's z basis length). Z-scrub mutates only the plane
  // constants — no replan, no pipeline rebuild.
  const displayMode = useModeStore((s) => s.displayMode);
  const currentZ = useViewerStore((s) => s.currentZ);
  const imageLayers = useSceneStore((s) => s.layers);
  const slabThickness = useMemo(() => {
    const step = sceneZExtent(imageLayers)?.step;
    const base =
      step && Number.isFinite(step)
        ? step
        : Math.max(new THREE.Vector3().setFromMatrixColumn(matrix, 2).length(), 1e-3);
    return base * (layer.slabScale ?? 1);
  }, [imageLayers, matrix, layer.slabScale]);
  useEffect(() => {
    if (!manager) return;
    manager.setSlabClip(
      displayMode === "3D" ? null : { z: currentZ, thickness: slabThickness },
    );
    invalidate();
  }, [manager, displayMode, currentZ, slabThickness, invalidate]);

  // --- Instance picking: click (PROBE) + debounced hover (PROBE follow /
  // ANNOTATE drawing tools — the brick layers' etiquette). Reads the hit's
  // per-vertex ordinal; BatchedMesh raycast windows the SHARED merged buffers
  // via drawRange, so `face.a` addresses the batch attribute on both paths.
  const interactionMode = useModeStore((s) => s.interactionMode);
  const probeFollowsCursor = useModeStore((s) => s.probeFollowsCursor);
  // A RENDER subscription: the handler PROPS below are the raycast gate, and
  // for this layer that gate is the whole point. `manager.group` holds a
  // BatchedMesh of every mounted cell, so an unconditionally-attached
  // onPointerMove costs a full per-instance raycast on every pointer move in
  // EVERY mode — NAVIGATE included, where none of these handlers can act. The
  // click-class props matter just as much: R3F does not filter those by
  // handler kind, so an unarmed onClick bought that same raycast at the start
  // of every orbit drag. See core/probe/probeGating.ts (P20).
  const activeTool = useRoiDrawingStore((s) => s.activeTool);
  const gate: ProbeGateInput = {
    interactionMode,
    probeFollowsCursor,
    drawingToolActive: isDrawingTool(activeTool),
    annotateProbes: true,
  };
  const hoverEnabled = hoverProbeEnabled(gate);
  // Picking a mesh instance is a PROBE-mode act only: in ANNOTATE the click
  // belongs to the shape being drawn.
  const pickEnabled = clickProbeEnabled(gate) && interactionMode === "PROBE";
  const hoverCoalescer = useMemo(() => createRafCoalescer<() => void>((run) => run()), []);
  useEffect(() => () => hoverCoalescer.cancel(), [hoverCoalescer]);
  const lastHover = useRef<string | null>(null);

  /** The picked ordinal + frame, or null when the event isn't a usable hit. */
  const resolveMeshHit = (event: ThreeEvent<MouseEvent | PointerEvent>) => {
    const face = event.face;
    const attr = (event.object as THREE.Mesh).geometry?.getAttribute("objectOrdinal");
    if (!face || !attr) return null;
    const ordinal = attr.getX(face.a);
    // Mesh-local IS collection voxel space (corner-anchored), so the hit
    // point through the inverse placement is the voxel coordinate.
    const worldPos: [number, number, number] = [event.point.x, event.point.y, event.point.z];
    const local = event.point.clone().applyMatrix4(matrix.clone().invert());
    const voxelIndex: [number, number, number] = [
      Math.floor(local.x),
      Math.floor(local.y),
      Math.floor(local.z),
    ];
    return { ordinal, voxelIndex, worldPos };
  };

  /**
   * Publish a pick as a first-class PROBE — SYNCHRONOUSLY. The cursor-tracking
   * contract: the probe (and the gated highlight) move with the pointer; only
   * the table LOOKUP settles behind the tracker's debounce. The ordinal is
   * known instantly from the vertex attribute; the objectId answers from the
   * synchronous catalog peek (the common case after the first pick). Only the
   * very first pick — catalog still loading — emits a value-less probe (the
   * tracker skips those) and re-publishes when identity lands.
   *
   * Clicks always select (highlight/hull); hovers select only under the debug
   * page's "marked boundary" setting, mirroring the reverse-sync gate.
   */
  const publishMeshProbe = (
    hit: { ordinal: number; voxelIndex: [number, number, number]; worldPos: [number, number, number] },
    origin: "click" | "hover",
  ) => {
    if (!manager) return;
    perfMonitor.markProbe(); // no-op unless a perf recording is armed
    const state = viewerApi.getState();

    // Instant highlight by ordinal — no catalog involved (the hull resolves
    // itself asynchronously inside the manager).
    if (origin === "hover" && state.markProbedInstances) {
      const current = state.meshSelection;
      if (!(current?.layerId === layer.id && current.ordinal === hit.ordinal)) {
        state.setMeshSelection({
          layerId: layer.id,
          ordinal: hit.ordinal,
          objectId: null,
          stats: null,
          isolate: current?.layerId === layer.id ? current.isolate : false,
        });
      }
    }

    const emitProbe = (objectId: number | null) =>
      viewerApi.getState().setProbedCoordinate({
        layerId: layer.id,
        localPos: [0, 0, 0], // meshes carry no unit-box frame; worldPos is truth
        voxelIndex: hit.voxelIndex,
        worldPos: hit.worldPos,
        strategy: "mesh",
        origin,
        purpose: interactionMode === "ANNOTATE" ? "placement" : "readout",
        values: [{ channel: 0, value: objectId }],
        provenance: { source: "exact", level: 0 },
        dtype: "uint32",
        sliceSignature: `mesh:${collection.version ?? "0"}`,
      });

    const patchSelection = (entry: NonNullable<ReturnType<typeof manager.peekOrdinal>>) => {
      const current = viewerApi.getState().meshSelection;
      if (current?.layerId === layer.id && current.ordinal === hit.ordinal) {
        viewerApi.getState().setMeshSelection({
          ...current,
          objectId: entry.objectId,
          stats: { vertices: entry.vertexCount, indices: entry.indexCount },
        });
      }
    };

    const peeked = manager.peekOrdinal(hit.ordinal);
    if (peeked) {
      emitProbe(peeked.objectId); // fully synchronous — the hot path
      patchSelection(peeked);
      return;
    }
    emitProbe(null); // instant pending readout ("#…"); no lookup yet
    void manager
      .identifyOrdinal(hit.ordinal)
      .then((entry) => {
        if (!entry) return;
        // Re-publish only if this pick is still the one on display.
        const probe = viewerApi.getState().probedCoordinate;
        if (
          probe?.strategy === "mesh" &&
          probe.layerId === layer.id &&
          probe.values[0]?.value == null &&
          probe.voxelIndex.join(",") === hit.voxelIndex.join(",")
        ) {
          emitProbe(entry.objectId);
        }
        patchSelection(entry);
      })
      .catch((error) => console.warn("[fabriks] object identification failed:", error));
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (interactionMode !== "PROBE" || !manager) return;
    const hit = resolveMeshHit(event);
    if (!hit) return;
    event.stopPropagation();

    const state = viewerApi.getState();
    const previous = state.meshSelection;
    if (previous && previous.layerId === layer.id && previous.ordinal === hit.ordinal) {
      state.setMeshSelection(null); // clicking the selected object deselects
      if (
        state.probedCoordinate?.strategy === "mesh" &&
        state.probedCoordinate.layerId === layer.id
      ) {
        state.setProbedCoordinate(null); // and retracts its probe
      }
      return;
    }
    // Immediate highlight (ordinal known); identity patches in async.
    const isolate = previous?.layerId === layer.id ? previous.isolate : false;
    state.setMeshSelection({
      layerId: layer.id,
      ordinal: hit.ordinal,
      objectId: null,
      stats: null,
      isolate,
    });
    publishMeshProbe(hit, "click");
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (event.buttons !== 0 || !manager) return;
    const hit = resolveMeshHit(event);
    if (!hit) return;
    event.stopPropagation();
    // Dedupe: same instance at the same voxel republishes nothing; the
    // tracker's 150 ms debounce (and its instant path) do the rest.
    const signature = `${hit.ordinal}:${hit.voxelIndex.join(",")}`;
    if (lastHover.current === signature) return;
    lastHover.current = signature;
    hoverCoalescer.schedule(() => publishMeshProbe(hit, "hover"));
  };

  const handlePointerOut = () => {
    hoverCoalescer.cancel();
    lastHover.current = null;
    const state = viewerApi.getState();
    // Only hover probes retract on leave — a clicked probe stays pinned.
    if (
      state.probedCoordinate?.strategy === "mesh" &&
      state.probedCoordinate.layerId === layer.id &&
      state.probedCoordinate.origin === "hover"
    ) {
      state.setProbedCoordinate(null);
    }
  };

  if (!manager) return null;
  return (
    <primitive
      object={manager.group}
      onClick={pickEnabled ? handleClick : undefined}
      onPointerMove={hoverEnabled ? handlePointerMove : undefined}
      onPointerOut={hoverEnabled ? handlePointerOut : undefined}
    />
  );
};
