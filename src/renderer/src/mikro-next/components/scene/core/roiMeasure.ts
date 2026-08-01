import type { DrawingTool } from "../store/roiDrawingStore";
import type { OutlinePlanar } from "./roiOutline";

/**
 * What to tell the user about the shape they are dragging out.
 *
 * Assumes isotropic world units with x and y sharing the scene's `spatialUnit` —
 * the same simplification the scale bar already makes (`spatialUnit` is the unit
 * of the world coordinate system's *first* SPACE axis).
 */

export type DrawMeasure =
  | { kind: "box"; width: number; height: number }
  | { kind: "length"; length: number }
  | { kind: "path"; length: number; vertexCount: number };

export function measureDraw(
  tool: DrawingTool,
  points: readonly OutlinePlanar[],
): DrawMeasure | null {
  if (tool === "POINT" || points.length < 2) return null;

  if (tool === "RECTANGLE" || tool === "ELLIPSIS") {
    // Absolute, so which corner was pressed first doesn't matter.
    return {
      kind: "box",
      width: Math.abs(points[1].x - points[0].x),
      height: Math.abs(points[1].y - points[0].y),
    };
  }

  if (tool === "SPHERE" || tool === "CUBE") {
    // Corner-pair convention (`core/primitiveDraw.ts`): the extent is 2r on
    // every axis, so half the x span IS the radius — the number the sizing
    // gesture is choosing.
    return { kind: "length", length: Math.abs(points[1].x - points[0].x) / 2 };
  }

  if (tool === "LINE") {
    return { kind: "length", length: distance(points[0], points[1]) };
  }

  let length = 0;
  for (let index = 1; index < points.length; index += 1) {
    length += distance(points[index - 1], points[index]);
  }
  return { kind: "path", length, vertexCount: points.length };
}

const distance = (a: OutlinePlanar, b: OutlinePlanar): number =>
  Math.hypot(b.x - a.x, b.y - a.y);

/**
 * A fixed magnitude→decimals ladder, so the readout doesn't jitter between
 * widths while you drag.
 *
 * Deliberately not derived from `worldUnitsPerPixel`: that field is throttled
 * and React-subscribed, so it would be both stale mid-gesture and a re-render
 * source. Also not the scale bar's `getNiceNumber` — snapping to 1/2/5×10ⁿ is
 * right for choosing a bar length and wrong for reporting a measured extent.
 */
export function formatSceneLength(value: number): string {
  const magnitude = Math.abs(value);
  if (magnitude === 0) return "0";
  if (magnitude >= 100) return value.toFixed(0);
  if (magnitude >= 10) return value.toFixed(1);
  if (magnitude >= 1) return value.toFixed(2);
  return value.toPrecision(3);
}

/** e.g. "120 × 84 µm", "148 µm", "7 pts · 312 µm". */
export function formatDrawMeasure(
  measure: DrawMeasure | null,
  unit: string,
): string | null {
  if (!measure) return null;

  if (measure.kind === "box") {
    // U+00D7 MULTIPLICATION SIGN, not the letter x.
    return `${formatSceneLength(measure.width)} × ${formatSceneLength(measure.height)} ${unit}`;
  }

  if (measure.kind === "length") {
    return `${formatSceneLength(measure.length)} ${unit}`;
  }

  return `${measure.vertexCount} pts · ${formatSceneLength(measure.length)} ${unit}`;
}
