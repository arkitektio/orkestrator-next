/* eslint-disable react-hooks/immutability --
 * Driving TSL UNIFORM NODES is this module's whole job, and a uniform node is a
 * deliberately mutable handle into an already-compiled shader graph — writing
 * `.value` is how a frame's data reaches the GPU without rebuilding the
 * material. The rule reads that as mutating a hook argument; treating these as
 * React state instead would mean recompiling the shader on every camera move,
 * which is exactly what the uniform-push contract exists to avoid. */
import { useThree } from "@react-three/fiber";
import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import { useEffect, useMemo, useRef } from "react";

import { useAttributeServiceOrNull } from "@/mikro-next/lib/attributes/AttributeServiceProvider";
import { level0StoreIdOf, systemIdOf } from "../../platform/model/layerLevel0";
import type { LayerState } from "../../platform/model/layerModel";
import { setLabelColorLut, setLabelColorStyle, type LabelLutNodes } from "./labelNodeMaterials";
import { useViewerStoreApi } from "../../platform/stores/viewerStore";
import { buildLabelColorLut } from "./labelColorLut";
import {
  DEFAULT_MEASURE_COLORMAP,
  paletteRowFor,
  type ValueLutArena,
} from "../../platform/attributes/valueLut";
import { qualitativePalette } from "../../platform/layerui/colormap-utils";
import { isColumnColorBy } from "../../platform/layerui/columnOptions";
import { loadSparseSource } from "@/mikro-next/lib/sparse/sparseSource";

/**
 * Resolve a label layer's ACTIVE colouring and filter rules into the material's
 * colour LUT, and keep it in step as the picker changes.
 *
 * Shared by the 2D plane and the 3D raymarcher because the answer is the same
 * one: both bind the same table and index it the same way, and
 * `setLabelColorLut` already takes the structural `LabelLutNodes` subset both
 * materials expose. The 2D/3D difference is in how a texel is USED (a fill or a
 * first-hit surface), never in how it is built.
 *
 * The lifecycle is the reason this is worth a hook rather than two copies: it is
 * an async build with a cancellation protocol, and getting the cancelled branch
 * wrong leaks a GPU texture per keystroke in the picker.
 */
export const useLabelColorLut = (
  nodes: LabelLutNodes | undefined,
  layer: LayerState | undefined,
): void => {
  const attributeService = useAttributeServiceOrNull();
  const invalidate = useThree((state) => state.invalidate);
  const viewerStoreApi = useViewerStoreApi();
  const client = useMikro();
  const datalayer = useDatalayerEndpoint();

  const render = layer?.labelRender;
  const storedColorBy =
    render?.activeColorBy != null ? (render.colorBys?.[render.activeColorBy] ?? null) : null;
  /**
   * Both arms render now. A SPARSE entry names a matrix and a position rather
   * than a table and a column, and is answered from the store directly — there
   * is no SQL and no database in that path.
   */
  const activeColorBy = storedColorBy;
  const sparseDatasetId = useMemo(
    () => (storedColorBy && !isColumnColorBy(storedColorBy) ? (storedColorBy.dataset ?? null) : null),
    [storedColorBy],
  );
  const activeRules = useMemo(
    () =>
      (render?.activeFilterBys ?? [])
        .map((index) => render?.filterBys?.[index])
        .filter((rule): rule is NonNullable<typeof rule> => Boolean(rule)),
    [render?.activeFilterBys, render?.filterBys],
  );

  /**
   * A CONTENT key, not references. The card folds the server's answer in with
   * `Object.assign` into an immer draft, so array identity is structural
   * sharing's call — keying on it would re-run this for nothing, or miss a real
   * change. (Same reasoning as `FabriksCollectionLayer`'s `lutKey`.)
   */
  // Two keys, not one. The table depends on WHICH values are read; the window
  // and the palette depend only on how they are drawn. Keying both off one
  // string meant a clim nudge rebuilt and re-uploaded the whole table — at a bin
  // lattice's scale, tens of megabytes to change how a number becomes a hue.
  //
  // `columnLut.ts` already makes this argument for the base colour, refusing to
  // bake it in because it would tie the texture to live uniforms; the value
  // encoding is that argument applied to the colormap as well.
  const dataKey = useMemo(
    () =>
      JSON.stringify([
        activeColorBy && {
          table: activeColorBy.table ?? null,
          column: activeColorBy.column ?? null,
          joinPath: activeColorBy.joinPath ?? null,
          dataset: activeColorBy.dataset ?? null,
          at: activeColorBy.at ?? null,
        },
        activeRules,
      ]),
    [activeColorBy, activeRules],
  );

  const styleKey = useMemo(
    () =>
      JSON.stringify([
        activeColorBy?.colormap ?? null,
        activeColorBy?.min ?? null,
        activeColorBy?.max ?? null,
      ]),
    [activeColorBy],
  );

  const systemId = layer ? systemIdOf(layer) : null;
  const storeId = layer ? level0StoreIdOf(layer) : null;

  /**
   * The table the last build painted into, offered to the next one.
   *
   * A gene switch, a filter edit and a colormap-independent colorBy change all
   * produce a table of the SAME slot count, so this is the difference between
   * refilling a buffer and allocating a fresh multi-megabyte one — plus a GPU
   * texture destroyed and recreated — on every one of them.
   *
   * A ref rather than state: nothing renders off it, and making it state would
   * re-run the effect that sets it.
   */
  const arenaRef = useRef<ValueLutArena | null>(null);

  useEffect(() => {
    if (!nodes) return;
    const off = () => {
      setLabelColorLut(
        nodes,
        { texture: null, width: 0, height: 0, idOffset: 0, valueMin: 0, valueMax: 1 },
        { colorize: false, filter: false },
      );
      // `setLabelColorLut` disposes what it unbinds, so the arena's texture is
      // gone with it. Holding the reference would offer a destroyed
      // `GPUTexture` to the next build.
      arenaRef.current = null;
      viewerStoreApi.getState().volumeInputs.bump("label-lut");
    };

    const nothingActive = !activeColorBy && activeRules.length === 0;
    if (!attributeService || !systemId || !storeId || nothingActive) {
      off();
      return;
    }

    let cancelled = false;
    void (async () => {
      const plans = await attributeService.plansFor(systemId);
      if (cancelled) return;
      // Fetched here rather than in the builder so the builder stays free of
      // Apollo — the same reason `readColumn` is injected on the column side.
      const sparse =
        sparseDatasetId && datalayer
          ? await loadSparseSource(client, datalayer, sparseDatasetId)
          : null;
      if (cancelled) return;
      const lut = await buildLabelColorLut({
        colorBy: activeColorBy,
        sparse,
        filterBys: activeRules,
        plans,
        storeId,
        engine: attributeService.engine,
        reuse: arenaRef.current,
        // Checked inside, after the reads and before the first write. Without
        // it a superseded build would still paint — into the LIVE buffer, now
        // that the table is reused — and a slow read finishing last would
        // overwrite the answer the user is actually looking at.
        stillWanted: () => !cancelled,
      });
      // A superseded build must not reach the GPU, and its texture is ours to
      // free — `setLabelColorLut` only ever disposes what it REPLACES, so a
      // texture that never got bound would leak. The one it must NOT free is
      // the reused arena's: that texture is still bound.
      if (cancelled || lut.superseded) {
        if (lut.texture && lut.texture !== arenaRef.current?.texture) lut.texture.dispose();
        return;
      }
      if (lut.skipped.length > 0) {
        console.warn("[label] picker entries that do not render yet:", lut.skipped);
      }
      // Adopted before the bind: `setLabelColorLut` disposes what it replaces,
      // and what it replaces is the arena we are letting go of.
      arenaRef.current = lut.arena ?? null;
      setLabelColorLut(nodes, lut, {
        colorize: activeColorBy !== null,
        filter: activeRules.length > 0,
      });
      viewerStoreApi.getState().volumeInputs.bump("label-lut");
      invalidate();
    })().catch((error) => {
      if (cancelled) return;
      console.warn("[label] could not build the colour lookup:", error);
      off();
    });

    return () => {
      cancelled = true;
    };
    // `activeColorBy` / `activeRules` are read inside; `dataKey` is what decides
    // whether this re-runs. See the note on the key itself.
    // `client` and `datalayer` are deliberately NOT here. They are infrastructure
    // read inside, and a provider that returns a fresh object per render would
    // rebuild the whole table on every render — which is the cost this split
    // exists to remove. What the table depends on is `dataKey` and the dataset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, attributeService, systemId, storeId, dataKey, sparseDatasetId, invalidate]);

  // The appearance half. Synchronous, no await, no allocation: two uniform
  // writes and a 1 KB palette row, both of which the table is indifferent to.
  useEffect(() => {
    if (!nodes || !activeColorBy) return;
    const palette = paletteRowFor(activeColorBy.colormap ?? DEFAULT_MEASURE_COLORMAP);
    // A qualitative colouring writes its ranks normalised onto 0..1 already, so
    // its window is the unit interval and a clim would only smear the classes
    // into each other. The UI never offers one; this makes that structural.
    const qualitative = qualitativePalette(activeColorBy.colormap) !== null;
    setLabelColorStyle(nodes, {
      palette,
      climMin: qualitative ? 0 : (activeColorBy.min ?? Number.NEGATIVE_INFINITY),
      climMax: qualitative ? 1 : (activeColorBy.max ?? Number.POSITIVE_INFINITY),
    });
    invalidate();
    // `activeColorBy` is read inside; `styleKey` decides whether this re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, styleKey, invalidate]);
};
