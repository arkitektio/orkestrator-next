import { useEffect } from "react";
import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import { acquireAttributeService } from "@/mikro-next/lib/attributes/attributeService";
import { createAttributeResolver } from "@/mikro-next/lib/attributes/attributeResolver";
import type {
  AttributePlanLike,
  PlanRowsState,
} from "@/mikro-next/lib/attributes/attributeTypes";
import { isMeshSample, planIdentity } from "@/mikro-next/lib/attributes/attributeTypes";
import type { AxisCoords } from "@/mikro-next/lib/coords/axisPath";
import { applyPathToCoords } from "@/mikro-next/lib/coords/axisPath";
import {
  buildHeld,
  isBackground,
  probeCoordsFor,
  resolveSampleIndex,
  type HeldValue,
} from "@/mikro-next/lib/attributes/planExec";
import {
  sceneAttributeKey,
  useViewerStoreApi,
  type SceneAttributeKey,
} from "../../platform/stores/viewerStore";
import { useSceneStoreApi } from "../../platform/stores/sceneStore";
import type { ProbeResult } from "../../platform/probe/probeTypes";
import type { LayerState } from "../../platform/model/layerModel";
import { buildSliceMap, resolveFixedDimIndex } from "../../platform/coords/selection";
import { collectionSpatialAxes } from "../../platform/model/collectionPlacement";
import { createResidentSampler } from "../bricks/residency/residentSampling";

/**
 * Headless "what is under this pixel?" executor: whenever the active probe
 * moves, discover the probed system's attribute plans and run each one
 * locally through the SHARED attribute service (`acquireAttributeService`) —
 * the scene contributes only what is genuinely scene-y: assembling the
 * probed point's level-0 coordinates, the resident atlas fast path, and the
 * store merges. Hover cards or tables acquiring the same service hit the
 * caches this tracker warmed, and vice versa.
 *
 * Transient store subscription (no React re-render per probe move, P17),
 * driven by the SETTLED `probeReadout` so hover sweeps cost nothing until they
 * stop, and a latest-wins resolver (the exactValueResolver pattern).
 *
 * All GraphQL here is imperative (`client.query`/`client.mutate`, the
 * zarrSources.ts pattern): no hooks mount, so the Guard.Mikro obligation
 * stays on the hosts mounting <Scene>.
 */
export function AttributeProbeTracker() {
  const viewerStore = useViewerStoreApi();
  const sceneStore = useSceneStoreApi();
  const client = useMikro();
  const datalayer = useDatalayerEndpoint();

  useEffect(() => {
    // Scene hosts always resolve a datalayer before mounting; the empty
    // fallback only makes a foreign-store open fail (caught) rather than TS.
    const acquired = acquireAttributeService({ client, datalayer: datalayer ?? "" });
    const service = acquired.service;

    // The scene's already-open arrays (hovering a rendered mask costs no new
    // credentials); unknown stores fall back to the service's foreign open.
    service.registerArrayProvider((storeId) => {
      try {
        return viewerStore.getState().getArrayForStoreId(storeId);
      } catch {
        return null;
      }
    });

    const residentSamplerFor = createResidentSampler({
      getBrickSystem: () => viewerStore.getState().brickSystem,
      getLayers: () => sceneStore.getState().layers,
    });

    const level0Of = (layer: LayerState) =>
      layer.lens.dataset.dataArrays.reduce<
        LayerState["lens"]["dataset"]["dataArrays"][number] | null
      >((best, da) => (best === null || da.level < best.level ? da : best), null);

    /**
     * The probed layer's level-0 system id — the frame `voxelIndex` is
     * expressed in (the composeLayerAffine reduction), so the server-resolved
     * plan path starts exactly where our coordinates live.
     */
    const systemIdFor = (layer: LayerState): string | null =>
      level0Of(layer)?.coordinateSystem?.id ??
      layer.lens.dataset.intrinsicSystem?.id ??
      null;

    /**
     * The probed point as named level-0 coordinates: spatial axes from the
     * probe's voxel, collapsed dims resolved EXACTLY as the brick pools do
     * (scene-wide selection clamped, else the lens slice's collapsed
     * default) — so a locally-rooted plan reads the same slice the screen
     * shows.
     */
    const coordsFor = (layer: LayerState, probe: SceneAttributeKey): AxisCoords => {
      const dims = layer.lens.dataset.axisNames;
      const level0 = level0Of(layer);
      const sliceMap = buildSliceMap(layer.lens.slices);
      const dimSelections = viewerStore.getState().dimSelections;
      const ra = layer.lens.renderAxes;
      const spatial = new Set([ra.x, ra.y, ra.z].filter(Boolean));
      const resolved: Record<string, number> = {};
      dims.forEach((dim, d) => {
        if (spatial.has(dim)) return;
        resolved[dim] = resolveFixedDimIndex(
          sliceMap[dim],
          dimSelections[dim],
          level0?.shape[d] ?? 1,
        );
      });
      return probeCoordsFor({
        axisNames: dims,
        renderAxes: { x: ra.x, y: ra.y, z: ra.z },
        voxelIndex: probe.voxelIndex,
        dimSelections: resolved,
      });
    };

    const layerById = (layerId: string): LayerState | null =>
      sceneStore.getState().layers.find((layer) => layer.id === layerId) ?? null;

    /** The MESH layer (with a collection) behind a mesh-strategy probe. */
    const meshLayerById = (layerId: string) => {
      const layer = sceneStore
        .getState()
        .sceneLayers.find((candidate) => candidate.id === layerId);
      return layer?.__typename === "MeshLayer" && layer.collection ? layer : null;
    };

    /**
     * A mesh probe's voxelIndex as named coordinates in the COLLECTION's
     * coordinate system — vertex-component slots mapped to axis names by the
     * store's declared order (the placement module's one convention). Plans
     * for that system then path/lookup exactly as for an image probe; the
     * instance value replaces the field-array sample.
     */
    const meshCoordsFor = (layerId: string, key: SceneAttributeKey): AxisCoords | null => {
      const layer = meshLayerById(layerId);
      if (!layer || !layer.collection) return null;
      const spatial = collectionSpatialAxes(layer.collection);
      const coords: AxisCoords = {};
      spatial.forEach((axis, slot) => {
        if (axis) coords[axis] = key.voxelIndex[slot];
      });
      return Object.keys(coords).length > 0 ? coords : null;
    };

    /**
     * REVERSE sync — declaration-driven: when a voxel probe's ARRAY plan
     * settles with an instance id, the probed system's MESH-SAMPLE plans say
     * which collection(s) that id names (`MeshSample.store` is the fabriks
     * store — matched against each mesh layer's `collection.store.id`). The
     * matched instance is MARKED (highlight + hull) — but only while the
     * debug page's "marked boundary" setting is on, and never re-entered by
     * mesh probes (their pick set the selection in the first place). Rides
     * plan settlement, so it inherits the tracker's debounce.
     */
    const syncMeshSelection = (key: SceneAttributeKey, state: PlanRowsState): void => {
      if (key.instanceValue !== undefined) return;
      if (!viewerStore.getState().markProbedInstances) return;
      const value = state.sampledValue;
      if (state.status !== "rows" || value == null) return;

      // The system's mesh-sample plans declare the id → collection linkage
      // (cached by the time any plan settles — plansFor ran first).
      const meshPlans = (service.peekPlans(key.systemId) ?? []).filter((candidate) =>
        isMeshSample(candidate.sample),
      );
      if (meshPlans.length === 0) return;
      const meshStoreIds = new Set(meshPlans.map((candidate) => candidate.sample.store.id));

      const systems = viewerStore.getState().meshSystems;
      for (const [layerId, manager] of Object.entries(systems)) {
        const mesh = meshLayerById(layerId);
        if (!mesh?.collection || !meshStoreIds.has(mesh.collection.store.id)) continue;
        void manager
          .identifyObjectId(Number(value))
          .then((entry) => {
            if (!entry) return;
            // Latest-wins: only apply while this probe is still the active one.
            const probe = viewerStore.getState().probedCoordinate;
            if (!probe || keyOf(probe)?.pointId !== key.pointId) return;
            const previous = viewerStore.getState().meshSelection;
            viewerStore.getState().setMeshSelection({
              layerId,
              ordinal: entry.ordinal,
              objectId: entry.objectId,
              stats: { vertices: entry.vertexCount, indices: entry.indexCount },
              isolate: previous?.layerId === layerId ? previous.isolate : false,
            });
          })
          .catch(() => {
            /* no catalog: probing still works, only the marking is absent */
          });
        break; // first matching collection claims the marking
      }
    };

    /**
     * Display metadata per plan, memoized on the plan LIST's identity — the
     * attribute service hands back the same array for a system for the life of
     * the session, so this collapses to one build per system instead of one
     * per probe.
     */
    const planMetaCache = new WeakMap<
      readonly AttributePlanLike[],
      NonNullable<ReturnType<typeof viewerStore.getState>["probedAttributes"]>["planMeta"]
    >();
    const planMetaFor = (plans: readonly AttributePlanLike[]) => {
      const cached = planMetaCache.get(plans);
      if (cached) return cached;
      const meta = Object.fromEntries(
        plans.map((plan) => [
          planIdentity(plan),
          {
            tableName: plan.table.name,
            tableId: plan.table.id,
            attributes: plan.lookup.attributes,
          },
        ]),
      );
      planMetaCache.set(plans, meta);
      return meta;
    };

    // Warn-once diagnostics: an unreachable plan is an honest absence in the
    // UI, but a silent one is undebuggable — say WHERE it died, once per
    // (plan, reason).
    const warned = new Set<string>();
    const warnUnreachable = (planKey: string, reason: string, detail?: unknown) => {
      const dedupeKey = `${planKey}:${reason}`;
      if (!warned.has(dedupeKey)) {
        warned.add(dedupeKey);
        console.warn(`[attributePlans] plan unreachable: ${reason}`, detail ?? "");
      }
    };

    const executePlan = async (
      key: SceneAttributeKey,
      plan: AttributePlanLike,
      isStale: () => boolean,
    ): Promise<PlanRowsState | null> => {
      // Mesh probes: the instance id IS the field value — value-known path.
      if (key.instanceValue !== undefined) {
        const coords = meshCoordsFor(key.layerId, key);
        if (!coords) {
          warnUnreachable(planIdentity(plan), "mesh probe's collection missing from scene", {
            layerId: key.layerId,
          });
          return { status: "unreachable", rows: [] };
        }
        const state = await service.executePlanWithValue(plan, coords, key.instanceValue, {
          isStale,
          onUnreachable: warnUnreachable,
        });
        return state;
      }

      const layer = layerById(key.layerId);
      if (!layer) {
        warnUnreachable(planIdentity(plan), "probed layer missing from scene", {
          layerId: key.layerId,
        });
        return { status: "unreachable", rows: [] };
      }
      const state = await service.executePlanAt(plan, coordsFor(layer, key), {
        isStale,
        sampleSync: residentSamplerFor(plan),
        onUnreachable: warnUnreachable,
      });
      if (state !== null && !isStale()) syncMeshSelection(key, state);
      return state;
    };

    // Warm each system's plans once at discovery: secret creation and
    // statement prepare then run on the engine's chain WHILE the first hover
    // is still zarr-sampling, instead of serially after it.
    const warmedSystems = new Set<string>();
    const resolver = createAttributeResolver<SceneAttributeKey>({
      resolvePlans: async (key) => {
        const plans = await service.plansFor(key.systemId);
        if (!warmedSystems.has(key.systemId)) {
          warmedSystems.add(key.systemId);
          for (const plan of plans) service.engine.warm(plan);
        }
        return plans;
      },
      executePlan,
      begin: (key, plans) => viewerStore.getState().beginProbedAttributes(key, plans),
      deliver: (key, planKey, state) =>
        viewerStore.getState().mergeAttributeRows(key, planKey, state),
    });

    const keyOf = (probe: ProbeResult): SceneAttributeKey | null => {
      if (probe.strategy === "mesh") {
        const systemId = meshLayerById(probe.layerId)?.collection?.coordinateSystem.id ?? null;
        if (!systemId) return null;
        return sceneAttributeKey(probe, systemId);
      }
      const layer = layerById(probe.layerId);
      const systemId = layer ? systemIdFor(layer) : null;
      if (!systemId) return null;
      return sceneAttributeKey(probe, systemId);
    };

    /**
     * Synchronous fast path: when EVERYTHING needed is already cached —
     * plans fetched, mask value resident, rows in the engine's result LRU —
     * deliver instantly instead of waiting out the debounce. Any miss (a
     * step that would fetch) returns false and the debounced resolver path
     * runs unchanged, so the read-avoidance contract holds.
     */
    const tryInstant = (key: SceneAttributeKey): boolean => {
      const plans = service.peekPlans(key.systemId);
      if (plans === null) return false;
      if (plans.length === 0) {
        viewerStore.getState().beginProbedAttributes(key, plans);
        return true;
      }
      // Mesh probes carry the field value with them — no residency needed.
      const isMesh = key.instanceValue !== undefined;
      const layer = isMesh ? null : layerById(key.layerId);
      if (!isMesh && !layer) return false;
      const startCoords = isMesh ? meshCoordsFor(key.layerId, key) : coordsFor(layer!, key);
      if (!startCoords) return false;

      const states: [string, PlanRowsState][] = [];
      for (const plan of plans) {
        const planKey = planIdentity(plan);
        const mapped = plan.path.length
          ? applyPathToCoords(plan.path, startCoords)
          : startCoords;
        if (mapped === null) {
          states.push([planKey, { status: "unreachable", rows: [] }]);
          continue;
        }
        let value: HeldValue;
        const sampleSource: "resident" | "exact" = isMesh ? "exact" : "resident";
        if (isMesh) {
          value = key.instanceValue!;
        } else {
          const index = resolveSampleIndex(plan, mapped);
          if (index === null) {
            // Also the mesh-sample-plan case under a voxel probe: no array.
            states.push([planKey, { status: "unreachable", rows: [] }]);
            continue;
          }
          const resident = residentSamplerFor(plan)?.(index) ?? null;
          if (resident === null) return false; // not resident: needs the async path
          value = resident;
        }
        if (isBackground(value)) {
          states.push([
            planKey,
            { status: "background", rows: [], sampledValue: value, sampleSource },
          ]);
          continue;
        }
        const held = buildHeld(plan, mapped, value);
        if (held === null) {
          states.push([planKey, { status: "unreachable", rows: [] }]);
          continue;
        }
        const rows = service.peekRows(plan, held);
        if (rows === null) return false; // LRU miss: a real lookup is needed
        states.push([
          planKey,
          { status: "rows", rows, sampledValue: value, sampleSource },
        ]);
      }

      const store = viewerStore.getState();
      // ONE commit for N plans (and none at all when nothing changed): this
      // path runs whenever the cursor re-crosses an already-visited voxel, and
      // `begin` + a `merge` per plan woke every subscriber 1+N times for it.
      store.commitProbedAttributes(key, planMetaFor(plans), states);
      for (const [, state] of states) syncMeshSelection(key, state);
      return true;
    };

    /**
     * Attribute lookups ride the SETTLED probe (`probeReadout`), not the hot
     * one: a hover sweep costs nothing until the cursor rests, and the numeric
     * readout and the attribute rows then describe the same point instead of
     * reflowing the panel twice. This used to be a second, independent 150 ms
     * debounce on top of the hot field — one settle point is both cheaper and
     * honest about what the user is looking at.
     *
     * `probeReadout` is already null for "placement" probes, so annotation
     * drawing never triggers a lookup: those probes are the drawer's cursor,
     * not a question about the data.
     *
     * `tryInstant` stays: after the settle it is a latency win (deliver from
     * cache rather than wait out a round trip), not a throttle.
     */
    const request = (probe: ProbeResult | null) => {
      if (probe === null) {
        viewerStore.getState().clearProbedAttributes();
        return;
      }
      // A mesh probe still awaiting its objectId (first pick, catalog in
      // flight) has no lookup key yet; the layer re-publishes when it lands.
      if (probe.strategy === "mesh" && probe.values[0]?.value == null) return;
      const key = keyOf(probe);
      if (!key) return;
      if (tryInstant(key)) return;
      resolver.request(key);
    };

    viewerStore
      .getState()
      .registerFollowAttributeReference((column, value) =>
        service.followReference(column, value),
      );

    let lastProbe = viewerStore.getState().probeReadout;
    request(lastProbe);
    const unsubscribe = viewerStore.subscribe((state) => {
      if (state.probeReadout !== lastProbe) {
        // Exact-value merges replace the probe object too, but the fetch key
        // (voxel + signature) is unchanged, so the resolver dedupes them.
        lastProbe = state.probeReadout;
        request(lastProbe);
      }
    });

    return () => {
      unsubscribe();
      resolver.dispose();
      service.registerArrayProvider(null);
      acquired.release();
      viewerStore.getState().registerFollowAttributeReference(null);
      viewerStore.getState().clearProbedAttributes();
    };
  }, [viewerStore, sceneStore, client, datalayer]);

  return null;
}
