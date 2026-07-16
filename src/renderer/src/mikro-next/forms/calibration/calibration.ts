/**
 * Authoring a calibration: a dataset's intrinsic pixels -> a PHYSICAL space.
 *
 * `createCalibration` creates two things in one call — the physical coordinate
 * system (whose axes carry the units) and the single edge mapping the pixels
 * into it. `axes` order defines `scale` order: entry i of `scale` is the pixel
 * size of axis i of `axes`. That is the same single-ordered-list discipline
 * ../registration/mapping.ts exists for, and for the same reason: the arrays
 * must not be able to disagree.
 *
 * Kept free of generated imports so its suite runs in `node` — see the note at
 * the top of ../registration/mapping.ts.
 */

/** Structural subset of a generated `Axis` fragment. */
export type IntrinsicAxis = {
  name: string;
  order: number;
  type: string;
  longName?: string | null;
};

export type CalibrationRow = {
  axis: IntrinsicAxis;
  /** A pint-parseable unit string, e.g. "µm". Required for EVERY axis. */
  unit: string;
  /** The pixel size: how much of `unit` one step of this axis spans. */
  scale: unknown;
};

/**
 * A plausible unit per axis type — a starting point, not a claim. The user
 * retypes whatever the acquisition actually used.
 *
 * CHANNEL and INDEX get "dimensionless" because the schema requires a unit on
 * every axis of a calibrated system (`CalibratedAxisInput.unit: Unit!`) while
 * these two have nothing to measure — an INDEX axis's own docstring says "there
 * is nothing to measure — the distance between object 3 and object 4 means
 * nothing". "dimensionless" is the pint spelling of exactly that.
 *
 * OPEN: unconfirmed against the server. If it rejects "dimensionless", a
 * (c,y,x) dataset cannot be calibrated through this form at all and we need the
 * spelling the server does accept.
 */
export const DEFAULT_UNITS: Record<string, string> = {
  SPACE: "µm",
  TIME: "s",
  MICROTIME: "ns",
  SPECTRUM: "nm",
  COORDINATE: "µm",
  DISPLACEMENT: "µm",
  CHANNEL: "dimensionless",
  INDEX: "dimensionless",
};

export const DIMENSIONLESS = "dimensionless";

/** Axis types where a pixel size is a real measurement the user should set. */
const MEASURED_TYPES = new Set([
  "SPACE",
  "TIME",
  "MICROTIME",
  "SPECTRUM",
  "COORDINATE",
  "DISPLACEMENT",
]);

export const isMeasured = (axis: IntrinsicAxis): boolean =>
  MEASURED_TYPES.has(axis.type);

/**
 * One row per intrinsic axis, in `order` — that order IS the array's dimension
 * order, and it becomes both `axes` order and `scale` order.
 */
export const prefillCalibration = (
  axes: readonly IntrinsicAxis[],
): CalibrationRow[] =>
  [...axes]
    .sort((a, b) => a.order - b.order)
    .map((axis) => ({
      axis,
      unit: DEFAULT_UNITS[axis.type] ?? DIMENSIONLESS,
      // A non-measured axis steps one index at a time by definition; only a
      // measured axis has a pixel size worth defaulting to 1 and editing.
      scale: 1,
    }));

const num = (value: unknown): number => {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value ?? "").trim());
  if (!Number.isFinite(parsed)) throw new Error(`"${String(value)}" is not a number`);
  return parsed;
};

export type CalibrationDraft = {
  dataset: string;
  name: string;
  rows: readonly CalibrationRow[];
};

export type CreateCalibrationVariables = {
  dataset: string;
  name: string;
  axes: { name: string; type: string; unit: string; longName?: string | null }[];
  scale: number[];
};

/**
 * The draft -> `CreateCalibrationInput`. `axes` and `scale` are built from one
 * pass over one ordered list, so entry i of each is the same axis by
 * construction.
 */
export const buildCalibrationInput = (
  draft: CalibrationDraft,
): CreateCalibrationVariables => ({
  dataset: draft.dataset,
  name: draft.name.trim() || "physical",
  axes: draft.rows.map((row) => ({
    name: row.axis.name,
    type: row.axis.type,
    unit: row.unit.trim(),
    longName: row.axis.longName ?? null,
  })),
  scale: draft.rows.map((row) => num(row.scale)),
});

export type CalibrationIssue = {
  level: "error" | "warning";
  message: string;
  row?: number;
};

export const validateCalibration = (
  draft: CalibrationDraft,
): CalibrationIssue[] => {
  const issues: CalibrationIssue[] = [];

  if (draft.rows.length === 0) {
    issues.push({
      level: "error",
      message: "The dataset has no axes to calibrate.",
    });
  }

  draft.rows.forEach((row, index) => {
    // Unit is non-null on every axis, so an empty one is a guaranteed server
    // rejection — catch it here where we can name the axis.
    if (!row.unit.trim()) {
      issues.push({
        level: "error",
        row: index,
        message: `"${row.axis.name}" needs a unit: a calibrated system carries one on every axis.`,
      });
    }

    let scale: number | null = null;
    try {
      scale = num(row.scale);
    } catch {
      issues.push({
        level: "error",
        row: index,
        message: `Pixel size for "${row.axis.name}" is not a number.`,
      });
    }

    if (scale !== null && scale === 0) {
      // A zero pixel size collapses the axis and makes the calibration edge
      // singular, so nothing can map back out of it.
      issues.push({
        level: "error",
        row: index,
        message: `Pixel size for "${row.axis.name}" cannot be zero.`,
      });
    }

    if (scale !== null && scale < 0) {
      issues.push({
        level: "warning",
        row: index,
        message: `Pixel size for "${row.axis.name}" is negative — that flips the axis, which is legal but rarely intended.`,
      });
    }
  });

  return issues;
};

export const hasBlockingIssue = (
  issues: readonly CalibrationIssue[],
): boolean => issues.some((issue) => issue.level === "error");
