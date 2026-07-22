import { useEffect } from "react";
import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import { acquireAttributeService } from "@/mikro-next/lib/attributes/attributeService";
import { createAttributeResolver } from "@/mikro-next/lib/attributes/attributeResolver";
import type {
  AttributePlanLike,
  PlanRowsState,
} from "@/mikro-next/lib/attributes/attributeTypes";
import { planIdentity } from "@/mikro-next/lib/attributes/attributeTypes";
import type { AxisCoords } from "@/mikro-next/lib/coords/axisPath";
import { applyPathToCoords } from "@/mikro-next/lib/coords/axisPath";
import {
  buildHeld,
  isBackground,
  probeCoordsFor,
  resolveSampleIndex,
} from "@/mikro-next/lib/attributes/planExec";
import {
  sceneAttributeKey,
  useViewerStoreApi,
  type SceneAttributeKey,
} from "../store/viewerStore";
import { useSceneStoreApi } from "../store/sceneStore";
import type { ProbeResult } from "../core/probe/probeTypes";
import type { LayerState } from "../core/layerModel";
import { buildSliceMap, resolveFixedDimIndex } from "../core/selection";
import { createResidentSampler } from "./residentSampling";

/**
 * Headless "what is under this pixel?" executor: whenever the active probe
 * moves, discover the probed system's attribute plans and run each one
 * locally through the SHARED attribute service (`acquireAttributeService`) —
 * the scene contributes only what is genuinely scene-y: assembling the
 * probed point's level-0 coordinates, the resident atlas fast path, and the
 * store merges. Hover cards or tables acquiring the same service hit the
 * caches this tracker warmed, and vice versa.
 *
 * Transient store subscription (no React re-render per probe move, P17), a
 * debounce so hover sweeps cost nothing until they settle, and a latest-wins
 * resolver (the exactValueResolver pattern).
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
      const layer = layerById(key.layerId);
      if (!layer) {
        warnUnreachable(planIdentity(plan), "probed layer missing from scene", {
          layerId: key.layerId,
        });
        return { status: "unreachable", rows: [] };
      }
      return service.executePlanAt(plan, coordsFor(layer, key), {
        isStale,
        sampleSync: residentSamplerFor(plan),
        onUnreachable: warnUnreachable,
      });
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
        const value = residentSamplerFor(plan)?.(index) ?? null;
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
        const rows = service.peekRows(plan, held);
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
        service.followReference(column, value),
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
      service.registerArrayProvider(null);
      acquired.release();
      viewerStore.getState().registerFollowAttributeReference(null);
      viewerStore.getState().clearProbedAttributes();
    };
  }, [viewerStore, sceneStore, client, datalayer]);

  return null;
}
