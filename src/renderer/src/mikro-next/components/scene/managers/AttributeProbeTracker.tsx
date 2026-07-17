import { useEffect } from "react";
import {
  RequestGeneralParquetAccessDocument,
  RequestGeneralParquetAccessMutation,
  RequestParquetAccessDocument,
  RequestParquetAccessMutation,
} from "@/mikro-next/api/graphql";
import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import {
  ensureHttpfs,
  getDuckDb,
  resolveDuckDbEndpoint,
} from "@/mikro-next/components/tables/useDuckDbTable";
import { useViewerStoreApi } from "../store/viewerStore";
import { useSceneStoreApi } from "../store/sceneStore";
import type { ProbeResult } from "../core/probe/probeTypes";
import type {
  AttributeFetchKey,
  AttributePlanLike,
  PlanRowsState,
} from "../core/attributes/attributeTypes";
import { planIdentity } from "../core/attributes/attributeTypes";
import { createAttributeResolver } from "../core/attributes/attributeResolver";
import { AttributeLookupEngine } from "../core/attributes/lookupEngine";
import type { AxisCoords } from "../core/attributes/axisPath";
import { applyPathToCoords } from "../core/attributes/axisPath";
import {
  buildHeld,
  isBackground,
  probeCoordsFor,
  resolveSampleIndex,
} from "../core/attributes/planExec";
import { AttributePlanCache } from "./attributePlanCache";
import { createSampleSourceFactory } from "./attributeSampleSources";
import type { LayerState } from "../core/layerModel";
import { buildSliceMap, resolveFixedDimIndex } from "../core/selection";

/**
 * Headless "what is under this pixel?" executor: whenever the active probe
 * moves, discover the probed system's attribute plans (cached per scene) and
 * run each one locally — map the point along the plan's path, sample the
 * field array, look the value up in its parquet with DuckDB — merging
 * per-table row states into the store as they settle. Transient store
 * subscription (no React re-render per probe move, P17), a debounce so hover
 * sweeps cost nothing until they settle, and a latest-wins resolver (the
 * exactValueResolver pattern).
 *
 * All GraphQL here is imperative (`client.query`/`client.mutate`, the
 * sceneStores.ts pattern): no hooks mount, so the Guard.Mikro obligation
 * stays on the hosts mounting <Scene>.
 */
export function AttributeProbeTracker() {
  const viewerStore = useViewerStoreApi();
  const sceneStore = useSceneStoreApi();
  const client = useMikro();
  const datalayer = useDatalayerEndpoint();

  useEffect(() => {
    const planCache = new AttributePlanCache(client);

    const engine = new AttributeLookupEngine({
      connect: async () => {
        const db = await getDuckDb();
        const connection = await db.connect();
        await ensureHttpfs(connection);
        return connection;
      },
      requestGrant: async (storeId) => {
        const response = (await client.mutate({
          mutation: RequestParquetAccessDocument,
          variables: { input: { storeId } },
        })) as { data?: RequestParquetAccessMutation };
        const grant = response.data?.requestParquetAccess;
        if (!grant) throw new Error("Failed to request parquet access");
        return grant;
      },
      requestRegion: async () => {
        const response = (await client.mutate({
          mutation: RequestGeneralParquetAccessDocument,
          variables: { input: {} },
        })) as { data?: RequestGeneralParquetAccessMutation };
        const grant = response.data?.requestGeneralParquetAccess;
        if (!grant) throw new Error("Failed to request general parquet access");
        return grant.region;
      },
      endpoint: resolveDuckDbEndpoint(datalayer),
    });

    const sampleSourceFor = createSampleSourceFactory({
      getArrayForStoreId: (storeId) => viewerStore.getState().getArrayForStoreId(storeId),
      getBrickSystem: () => viewerStore.getState().brickSystem,
      getLayers: () => sceneStore.getState().layers,
      client,
      // Scene hosts always resolve a datalayer before mounting; the empty
      // fallback only makes a foreign-store open fail (caught) rather than TS.
      datalayer: datalayer ?? "",
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
    const coordsFor = (layer: LayerState, probe: AttributeFetchKey): AxisCoords => {
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

    // Warn-once diagnostics: an unreachable plan is an honest absence in the
    // UI, but a silent one is undebuggable — say WHERE it died, once per
    // (plan, reason).
    const warned = new Set<string>();
    const unreachable = (
      planKey: string,
      reason: string,
      detail?: unknown,
    ): PlanRowsState => {
      const dedupeKey = `${planKey}:${reason}`;
      if (!warned.has(dedupeKey)) {
        warned.add(dedupeKey);
        console.warn(`[attributePlans] plan unreachable: ${reason}`, detail ?? "");
      }
      return { status: "unreachable", rows: [] };
    };

    const executePlan = async (
      key: AttributeFetchKey,
      plan: AttributePlanLike,
      isStale: () => boolean,
    ): Promise<PlanRowsState | null> => {
      const planKey = planIdentity(plan);
      const layer = layerById(key.layerId);
      if (!layer) {
        return unreachable(planKey, "probed layer missing from scene", {
          layerId: key.layerId,
        });
      }

      const startCoords = coordsFor(layer, key);
      const mapped = plan.path.length
        ? applyPathToCoords(plan.path, startCoords)
        : startCoords;
      if (mapped === null) {
        return unreachable(planKey, "cannot map the probed point along the plan's path", {
          table: plan.table.name,
          startCoords,
          path: plan.path.map(
            (step) => `${step.inverted ? "~" : ""}${step.transformation?.__typename}`,
          ),
        });
      }
      const index = resolveSampleIndex(plan, mapped);
      if (index === null) {
        return unreachable(planKey, "mapped point does not index the field array", {
          table: plan.table.name,
          mapped,
          axes: [...plan.sample.system.axes].sort((a, b) => a.order - b.order).map((a) => a.name),
          shape: plan.sample.store.shape,
        });
      }

      const source = sampleSourceFor(plan);

      // Resident-first sampling: the atlas CPU mirror is free and already on
      // screen. The chunk read is a FALLBACK only (mask not rendered, mirror
      // stale) — the point is to avoid network reads on the hover path, and
      // hover does not need exactness.
      let value = source.sampleSync(index);
      let sampleSource: "resident" | "exact" = "resident";
      if (value === null) {
        value = await source.sampleExact(index);
        sampleSource = "exact";
        if (isStale()) return null;
      }
      if (value === null) {
        return { status: "error", rows: [], error: "could not sample the field array" };
      }
      if (isBackground(value)) {
        return { status: "background", rows: [], sampledValue: value, sampleSource };
      }
      const held = buildHeld(plan, mapped, value);
      if (held === null) {
        return unreachable(planKey, "held values do not cover the plan's key axes", {
          table: plan.table.name,
          passthrough: plan.sample.passthrough,
          produces: plan.sample.produces,
          mapped,
        });
      }
      const rows = await engine.lookup(plan, held, isStale);
      if (rows === null) return null;
      return { status: "rows", rows, sampledValue: value, sampleSource };
    };

    const resolver = createAttributeResolver({
      resolvePlans: async (key) => planCache.get(key.systemId),
      executePlan,
      begin: (key, plans) => viewerStore.getState().beginProbedAttributes(key, plans),
      deliver: (key, planKey, state) =>
        viewerStore.getState().mergeAttributeRows(key, planKey, state),
    });

    const keyOf = (probe: ProbeResult): AttributeFetchKey | null => {
      const layer = layerById(probe.layerId);
      const systemId = layer ? systemIdFor(layer) : null;
      if (!systemId) return null;
      return {
        layerId: probe.layerId,
        voxelIndex: probe.voxelIndex,
        sliceSignature: probe.sliceSignature,
        systemId,
      };
    };

    /**
     * Synchronous fast path: when EVERYTHING needed is already cached —
     * plans fetched, mask value resident, rows in the engine's result LRU —
     * deliver instantly instead of waiting out the debounce. Any miss (a
     * step that would fetch) returns false and the debounced resolver path
     * runs unchanged, so the read-avoidance contract holds.
     */
    const tryInstant = (key: AttributeFetchKey): boolean => {
      const plans = planCache.peek(key.systemId);
      if (plans === null) return false;
      if (plans.length === 0) {
        viewerStore.getState().beginProbedAttributes(key, plans);
        return true;
      }
      const layer = layerById(key.layerId);
      if (!layer) return false;
      const startCoords = coordsFor(layer, key);

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
        const index = resolveSampleIndex(plan, mapped);
        if (index === null) {
          states.push([planKey, { status: "unreachable", rows: [] }]);
          continue;
        }
        const value = sampleSourceFor(plan).sampleSync(index);
        if (value === null) return false; // not resident: needs the async path
        if (isBackground(value)) {
          states.push([
            planKey,
            { status: "background", rows: [], sampledValue: value, sampleSource: "resident" },
          ]);
          continue;
        }
        const held = buildHeld(plan, mapped, value);
        if (held === null) {
          states.push([planKey, { status: "unreachable", rows: [] }]);
          continue;
        }
        const rows = engine.peek(plan, held);
        if (rows === null) return false; // LRU miss: a real lookup is needed
        states.push([
          planKey,
          { status: "rows", rows, sampledValue: value, sampleSource: "resident" },
        ]);
      }

      const store = viewerStore.getState();
      store.beginProbedAttributes(key, plans);
      for (const [planKey, state] of states) {
        store.mergeAttributeRows(key, planKey, state);
      }
      return true;
    };

    // Debounced execution: attribute lookups fire only once the probe has
    // rested on a voxel for a beat — a hover sweep across the image costs
    // nothing until it settles. (The upstream probe is RAF-coalesced; this is
    // the slower, read-avoiding tier on top.) The instant path above bypasses
    // the wait when no fetch would happen anyway.
    const ATTRIBUTE_DEBOUNCE_MS = 150;
    let debounce: ReturnType<typeof setTimeout> | null = null;
    const request = (probe: ProbeResult | null) => {
      if (debounce !== null) {
        clearTimeout(debounce);
        debounce = null;
      }
      if (probe === null) {
        viewerStore.getState().clearProbedAttributes();
        return;
      }
      const key = keyOf(probe);
      if (!key) return;
      if (tryInstant(key)) return;
      debounce = setTimeout(() => {
        debounce = null;
        resolver.request(key);
      }, ATTRIBUTE_DEBOUNCE_MS);
    };

    viewerStore
      .getState()
      .registerFollowAttributeReference((column, value) =>
        engine.followReference(column, value),
      );

    let lastProbe = viewerStore.getState().probedCoordinate;
    request(lastProbe);
    const unsubscribe = viewerStore.subscribe((state) => {
      if (state.probedCoordinate !== lastProbe) {
        // Exact-value merges replace the probe object too, but the fetch key
        // (voxel + signature) is unchanged, so the resolver dedupes them.
        lastProbe = state.probedCoordinate;
        request(lastProbe);
      }
    });

    return () => {
      unsubscribe();
      if (debounce !== null) clearTimeout(debounce);
      resolver.dispose();
      engine.dispose();
      viewerStore.getState().registerFollowAttributeReference(null);
      viewerStore.getState().clearProbedAttributes();
    };
  }, [viewerStore, sceneStore, client, datalayer]);

  return null;
}
