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
 * subscription (no React re-render per probe move, P17) and a latest-wins
 * resolver, mirroring ProbeValueTracker.
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

    const unreachable: PlanRowsState = { status: "unreachable", rows: [] };

    const executePlan = async (
      key: AttributeFetchKey,
      plan: AttributePlanLike,
      isStale: () => boolean,
    ): Promise<PlanRowsState | null> => {
      const layer = layerById(key.layerId);
      if (!layer) return unreachable;

      const startCoords = coordsFor(layer, key);
      const mapped = plan.path.length
        ? applyPathToCoords(plan.path, startCoords)
        : startCoords;
      if (mapped === null) return unreachable;
      const index = resolveSampleIndex(plan, mapped);
      if (index === null) return unreachable;

      const source = sampleSourceFor(plan);
      const planKey = planIdentity(plan);

      // Optimistic resident pre-read: an instant provisional row set from the
      // atlas CPU mirror, always superseded by the exact read below (coarser
      // LODs can misattribute a label at object boundaries).
      const residentValue = source.sampleSync(index);
      if (residentValue !== null && !isBackground(residentValue)) {
        const residentHeld = buildHeld(plan, mapped, residentValue);
        if (residentHeld) {
          engine
            .lookup(plan, residentHeld, isStale)
            .then((rows) => {
              if (rows !== null && !isStale()) {
                viewerStore.getState().mergeAttributeRows(key, planKey, {
                  status: "rows",
                  rows,
                  sampledValue: residentValue,
                  sampleSource: "resident",
                });
              }
            })
            .catch(() => undefined);
        }
      }

      const exactValue = await source.sampleExact(index);
      if (isStale()) return null;
      if (exactValue === null) {
        // Keep the provisional resident state if one was delivered.
        if (residentValue !== null) return null;
        return { status: "error", rows: [], error: "could not sample the field array" };
      }
      if (isBackground(exactValue)) {
        return { status: "background", rows: [], sampledValue: exactValue, sampleSource: "exact" };
      }
      const held = buildHeld(plan, mapped, exactValue);
      if (held === null) return unreachable;
      const rows = await engine.lookup(plan, held, isStale);
      if (rows === null) return null;
      return { status: "rows", rows, sampledValue: exactValue, sampleSource: "exact" };
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

    const request = (probe: ProbeResult | null) => {
      if (probe === null) {
        viewerStore.getState().clearProbedAttributes();
        return;
      }
      const key = keyOf(probe);
      if (key) resolver.request(key);
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
      resolver.dispose();
      engine.dispose();
      viewerStore.getState().registerFollowAttributeReference(null);
      viewerStore.getState().clearProbedAttributes();
    };
  }, [viewerStore, sceneStore, client, datalayer]);

  return null;
}
