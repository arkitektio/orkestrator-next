import { useMemo } from "react";
import {
  DetailNeuronModelFragment,
  SectionDominanceFragment,
  useSectionDominanceQuery,
} from "../api/graphql";

/**
 * "Importance" heatmap helpers.
 *
 * The elektro backend computes a `sectionDominance` list scoring how dominant
 * each morphology section is (its blended `globalScore`). These helpers let the
 * 3D renderer and the tree view recolor sections by that score as a heatmap,
 * and let the user tune the three blend weights that feed the score.
 */

/**
 * The three factors the backend blends into `globalScore`. Each weight defaults
 * to `null` → the backend's built-in blend. Setting one overrides that factor's
 * contribution; the others stay on their defaults.
 */
export type DominanceWeights = {
  axial: number | null;
  capacitance: number | null;
  conductance: number | null;
};

export const DEFAULT_WEIGHTS: DominanceWeights = {
  axial: null,
  capacitance: null,
  conductance: null,
};

/**
 * Blend factors in the backend's emphasis order, each with the built-in default
 * weight it falls back to (dominance.py `DEFAULT_WEIGHTS = 0.5 / 0.3 / 0.2`).
 * A null weight shows the slider at this default position.
 */
export const WEIGHT_FIELDS: {
  key: keyof DominanceWeights;
  label: string;
  defaultValue: number;
  description: string;
}[] = [
  {
    key: "conductance",
    label: "Conductance load",
    defaultValue: 0.5,
    description: "Σ gbar · area — how many ion channels the section carries",
  },
  {
    key: "capacitance",
    label: "Capacitance",
    defaultValue: 0.3,
    description: "cm · area — how much charge its membrane stores",
  },
  {
    key: "axial",
    label: "Axial coupling",
    defaultValue: 0.2,
    description: "diam² / (Ra · length) — how strongly it is wired to neighbours",
  },
];

/** True when every weight is on its default (no override) — no query needed. */
export const isDefaultWeights = (w: DominanceWeights): boolean =>
  w.axial == null && w.capacitance == null && w.conductance == null;

/** Grey used for sections that have no dominance entry. */
export const IMPORTANCE_MUTED = "rgb(60, 60, 66)";

// Viridis-style control points (low → high). RGB in 0–255, evenly spaced in t.
const HEATMAP_STOPS: [number, number, number][] = [
  [68, 1, 84], // deep purple
  [59, 82, 139], // blue
  [33, 145, 140], // teal
  [94, 201, 98], // green
  [253, 231, 37], // yellow
];

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/**
 * Sample the heatmap colormap at `t ∈ [0, 1]`, returning a CSS `rgb(...)`
 * string (parseable by `THREE.Color` and usable directly in the DOM). Linearly
 * interpolates between the viridis-style control points.
 */
export const sampleHeatmap = (t: number): string => {
  const x = clamp01(t) * (HEATMAP_STOPS.length - 1);
  const i = Math.floor(x);
  const frac = x - i;
  const a = HEATMAP_STOPS[i];
  const b = HEATMAP_STOPS[Math.min(i + 1, HEATMAP_STOPS.length - 1)];
  const r = Math.round(a[0] + (b[0] - a[0]) * frac);
  const g = Math.round(a[1] + (b[1] - a[1]) * frac);
  const bl = Math.round(a[2] + (b[2] - a[2]) * frac);
  return `rgb(${r}, ${g}, ${bl})`;
};

/** A CSS `linear-gradient(...)` across the heatmap, for legends/swatches. */
export const heatmapGradientCss = (steps = 8): string => {
  const stops = Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return `${sampleHeatmap(t)} ${Math.round(t * 100)}%`;
  });
  return `linear-gradient(to right, ${stops.join(", ")})`;
};

export type ImportanceColors = {
  /** sectionId → heatmap CSS color (by `globalScore`). */
  colors: Map<string, string>;
  /** sectionId → raw `globalScore` (for readouts). */
  values: Map<string, number>;
  min: number;
  max: number;
  /** False when there is no dominance data. */
  hasData: boolean;
};

/**
 * Build per-section heatmap colors from a dominance list, min/max normalizing
 * `globalScore` across all sections. Keyed by `sectionId` (both surfaces treat
 * section ids as globally unique across the model). When every value is equal
 * (or a single section), everything maps to the mid color.
 */
export const buildImportanceColors = (
  dominance: readonly SectionDominanceFragment[],
): ImportanceColors => {
  const values = new Map<string, number>();
  dominance.forEach((d) => values.set(d.sectionId, d.globalScore));

  const colors = new Map<string, string>();

  if (values.size === 0) {
    return { colors, values, min: 0, max: 0, hasData: false };
  }

  const nums = Array.from(values.values());
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = max - min;

  values.forEach((v, sectionId) => {
    const t = span > 0 ? (v - min) / span : 0.5;
    colors.set(sectionId, sampleHeatmap(t));
  });

  return { colors, values, min, max, hasData: true };
};

/**
 * Resolve the importance heatmap for a model at the given blend `weights`.
 *
 * With default weights the already-fetched `model.sectionDominance` (the
 * built-in blend) is used — no extra request. As soon as the user overrides a
 * weight, a `SectionDominance` query re-runs with those weights; while it loads
 * we keep showing the last good colors so the heatmap doesn't flicker away.
 */
export const useImportanceColors = (
  model: DetailNeuronModelFragment,
  weights: DominanceWeights,
): ImportanceColors => {
  const custom = !isDefaultWeights(weights);

  const { data } = useSectionDominanceQuery({
    variables: {
      id: model.id,
      weightAxial: weights.axial,
      weightCapacitance: weights.capacitance,
      weightConductance: weights.conductance,
    },
    skip: !custom,
    // Keep the previous heatmap visible while a new weighting resolves.
    fetchPolicy: "cache-and-network",
  });

  const dominance =
    (custom ? data?.neuronModel.sectionDominance : undefined) ??
    model.sectionDominance;

  return useMemo(() => buildImportanceColors(dominance), [dominance]);
};
