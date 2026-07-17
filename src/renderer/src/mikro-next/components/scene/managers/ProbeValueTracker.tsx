import { useEffect } from "react";
import { useViewerStoreApi } from "../store/viewerStore";
import { createExactValueResolver } from "../core/probe/exactValueResolver";
import type { ProbeFetchKey, ProbeResult } from "../core/probe/probeTypes";

/**
 * Headless async upgrade of probe values to exactness: whenever the active
 * probe (or a newly saved probe) is not yet "exact" — a resident-LOD
 * approximation, or "pending" because the atlas CPU mirror is stale — fetch
 * the level-0 voxel through the decoded-chunk cache and merge the values
 * back into the store. Uses a transient store subscription (no React
 * re-render per probe move, P17) and the latest-wins resolver so hover
 * storms collapse to one in-flight fetch.
 */
export function ProbeValueTracker() {
  const viewerStore = useViewerStoreApi();

  useEffect(() => {
    const keyOf = (probe: ProbeResult): ProbeFetchKey => ({
      layerId: probe.layerId,
      voxelIndex: probe.voxelIndex,
      sliceSignature: probe.sliceSignature,
    });

    const resolver = createExactValueResolver({
      fetch: async (key) => {
        const result = await viewerStore
          .getState()
          .brickSystem?.fetchExactVoxel(key.layerId, key.voxelIndex);
        if (!result || result.sliceSignature !== key.sliceSignature) return null;
        return result.values;
      },
      deliver: (key, values) =>
        viewerStore.getState().mergeExactProbeValues(key, values),
    });

    let lastProbe = viewerStore.getState().probedCoordinate;
    let lastSaved = viewerStore.getState().savedProbes;
    const requestIfInexact = (probe: ProbeResult | null) => {
      if (probe && probe.provenance.source !== "exact") resolver.request(keyOf(probe));
    };
    requestIfInexact(lastProbe);

    const unsubscribe = viewerStore.subscribe((state) => {
      if (state.probedCoordinate !== lastProbe) {
        // Only genuine moves re-request: an exact-merge changes the object,
        // but its provenance guard makes that a no-op here.
        lastProbe = state.probedCoordinate;
        requestIfInexact(lastProbe);
      }
      if (state.savedProbes !== lastSaved) {
        const previous = lastSaved;
        lastSaved = state.savedProbes;
        for (const probe of state.savedProbes) {
          if (!previous.includes(probe)) requestIfInexact(probe);
        }
      }
    });

    return () => {
      unsubscribe();
      resolver.dispose();
    };
  }, [viewerStore]);

  return null;
}
