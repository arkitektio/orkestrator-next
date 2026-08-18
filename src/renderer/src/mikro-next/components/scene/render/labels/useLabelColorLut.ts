/* eslint-disable react-hooks/immutability --
 * Driving TSL UNIFORM NODES is this module's whole job, and a uniform node is a
 * deliberately mutable handle into an already-compiled shader graph — writing
 * `.value` is how a frame's data reaches the GPU without rebuilding the
 * material. The rule reads that as mutating a hook argument; treating these as
 * React state instead would mean recompiling the shader on every camera move,
 * which is exactly what the uniform-push contract exists to avoid. */
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";

import { useAttributeServiceOrNull } from "@/mikro-next/lib/attributes/AttributeServiceProvider";
import { level0StoreIdOf, systemIdOf } from "../../core/layerLevel0";
import type { LayerState } from "../../core/layerModel";
import { setLabelColorLut, type LabelLutNodes } from "../bricks/labelNodeMaterials";
import { buildLabelColorLut } from "./labelColorLut";

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

  const render = layer?.labelRender;
  const activeColorBy =
    render?.activeColorBy != null ? (render.colorBys?.[render.activeColorBy] ?? null) : null;
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
  const lutKey = useMemo(
    () => JSON.stringify([activeColorBy, activeRules]),
    [activeColorBy, activeRules],
  );

  const systemId = layer ? systemIdOf(layer) : null;
  const storeId = layer ? level0StoreIdOf(layer) : null;

  useEffect(() => {
    if (!nodes) return;
    const off = () =>
      setLabelColorLut(
        nodes,
        { texture: null, width: 0, height: 0, idOffset: 0 },
        { colorize: false, filter: false },
      );

    const nothingActive = !activeColorBy && activeRules.length === 0;
    if (!attributeService || !systemId || !storeId || nothingActive) {
      off();
      return;
    }

    let cancelled = false;
    void (async () => {
      const plans = await attributeService.plansFor(systemId);
      if (cancelled) return;
      const lut = await buildLabelColorLut({
        colorBy: activeColorBy,
        filterBys: activeRules,
        plans,
        storeId,
        engine: attributeService.engine,
      });
      // A superseded build must not reach the GPU, and its texture is ours to
      // free — `setLabelColorLut` only ever disposes what it REPLACES, so a
      // texture that never got bound would leak.
      if (cancelled) {
        lut.texture?.dispose();
        return;
      }
      if (lut.skipped.length > 0) {
        console.warn("[label] picker entries that do not render yet:", lut.skipped);
      }
      setLabelColorLut(nodes, lut, {
        colorize: activeColorBy !== null,
        filter: activeRules.length > 0,
      });
      invalidate();
    })().catch((error) => {
      if (cancelled) return;
      console.warn("[label] could not build the colour lookup:", error);
      off();
    });

    return () => {
      cancelled = true;
    };
    // `activeColorBy` / `activeRules` are read inside; `lutKey` is what decides
    // whether this re-runs. See the note on the key itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, attributeService, systemId, storeId, lutKey, invalidate]);
};
