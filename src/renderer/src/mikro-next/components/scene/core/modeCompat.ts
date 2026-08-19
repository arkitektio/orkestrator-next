import type { DisplayMode, InteractionMode } from "../store/modeStore";
import type { AnnotateTool } from "../store/roiDrawingStore";

/**
 * Which interaction modes and annotate tools are *offered*, given the current
 * view. The rule lives here rather than in the pickers so that the toolbar, the
 * ROI toolbar and the coercion guard can never disagree about what is active.
 *
 * The principle: an option that would be inert is not shown. Marquee select
 * does nothing in 3D; probing does nothing without a probeable layer.
 */

export type ModeContext = {
  displayMode: DisplayMode;
  /** At least one layer can answer a probe. See `hasProbeableLayer`. */
  hasProbeableLayer: boolean;
};

/** Canonical order — the pickers render exactly this, filtered. */
const ALL_MODES: InteractionMode[] = ["NAVIGATE", "ANNOTATE", "PROBE"];

const ALL_TOOLS: AnnotateTool[] = [
  "SELECT",
  "RECTANGLE",
  "ELLIPSE",
  "POLYGON",
  "SPHERE",
  "CUBE",
  "POINT",
  "LINE",
  "PATH",
  "BRUSH",
];

/**
 * Tools that only make sense on the flat draw plane. Just the marquee: it has
 * nothing to drag against in 3D.
 *
 * The planar shapes used to be here too, because in 3D they landed on an
 * arbitrary z slab (`currentZ`, a flat-view concept). They no longer do — in 3D
 * every vertex is placed by the volume probe, on the data (`RoiDrawer`), so a
 * rectangle drawn in 3D is a real box between two probed corners.
 */
const FLAT_ONLY_TOOLS = new Set<AnnotateTool>(["SELECT"]);

/** The volumetric tools: anchored by a probe click on the volume — 3D only. */
const VOLUMETRIC_TOOLS = new Set<AnnotateTool>(["SPHERE", "CUBE"]);

/**
 * The skeleton brush: a stroke painted onto the volume via the probe march —
 * 3D only. Kept out of `VOLUMETRIC_TOOLS`, whose membership drives the
 * anchor-then-size gesture (`isPrimitiveTool`); the brush has its own session
 * (`interactions/BrushStrokeSession.tsx`).
 */
const BRUSH_TOOLS = new Set<AnnotateTool>(["BRUSH"]);

/** Where a coercion lands. Never null: a null tool leaves ANNOTATE inert. */
export const FALLBACK_MODE: InteractionMode = "NAVIGATE";

/**
 * The default tool per view: the volumetric sphere in 3D (marking around a
 * probed point IS the 3D gesture), the rectangle on the flat plane.
 */
export const fallbackToolFor = (
  ctx: Pick<ModeContext, "displayMode">,
): AnnotateTool => (ctx.displayMode === "3D" ? "SPHERE" : "RECTANGLE");

/**
 * Only the brick layers emit probes, and `sceneStore.layers` is *already*
 * exactly the brick-backed layers (`scene.layers.filter(isBrickLayer)` — images
 * AND label masks; the raw polymorphic list is `sceneLayers`). They all bail on
 * `visible === false`, so visibility is the whole predicate.
 *
 * Deliberately not gated on brick residency: that is streaming cadence, and
 * gating the mode picker on it would make the Probe button flicker while bricks
 * stream in.
 *
 * Equivalent by design to `effectiveProbeLayerId(…) !== null`
 * (`core/probe/probeTargeting.ts`): some layer can answer the probe exactly
 * when some layer is visible.
 *
 * KNOWN GAP: the 3D label raymarcher does not answer the probe (only the label
 * PLANE does — see `BrickLabelVolumeLayer`), so a 3D scene whose only visible
 * layer is a mask reports probeable while nothing responds. Narrow and
 * deliberate: a first-hit surface makes "which voxel" a second question, and the
 * 3D probe closure is entangled with ROI drawing and annotation placement.
 */
export const hasProbeableLayer = (
  layers: readonly { visible?: boolean }[],
): boolean => layers.some((layer) => layer.visible !== false);

export function isInteractionModeAvailable(
  mode: InteractionMode,
  ctx: ModeContext,
): boolean {
  return mode === "PROBE" ? ctx.hasProbeableLayer : true;
}

export function availableInteractionModes(ctx: ModeContext): InteractionMode[] {
  return ALL_MODES.filter((mode) => isInteractionModeAvailable(mode, ctx));
}

/**
 * The marquee is 2D-only; the volumetric tools are 3D-only. Every shape tool
 * works in both — flat on the drawn slice, probe-placed in the volume. The
 * vector enhancer rides along in both too: it searches the box its anchors
 * span, which is a flat one when the flat view drew them.
 */
export function isAnnotateToolAvailable(
  tool: AnnotateTool,
  ctx: Pick<ModeContext, "displayMode">,
): boolean {
  if (FLAT_ONLY_TOOLS.has(tool)) return ctx.displayMode === "2D";
  if (VOLUMETRIC_TOOLS.has(tool) || BRUSH_TOOLS.has(tool))
    return ctx.displayMode === "3D";
  return true;
}

export function availableAnnotateTools(
  ctx: Pick<ModeContext, "displayMode">,
): AnnotateTool[] {
  return ALL_TOOLS.filter((tool) => isAnnotateToolAvailable(tool, ctx));
}

/**
 * The (mode, tool) pair that should be active. Returns the *same* values when
 * nothing needs to change, so the guard can identity-compare and skip the store
 * write — that is what stops a set → render → set loop.
 */
export function coerceModeState(
  requested: {
    interactionMode: InteractionMode;
    activeTool: AnnotateTool | null;
  },
  ctx: ModeContext,
): { interactionMode: InteractionMode; activeTool: AnnotateTool | null } {
  const interactionMode = isInteractionModeAvailable(
    requested.interactionMode,
    ctx,
  )
    ? requested.interactionMode
    : FALLBACK_MODE;

  // The tool is coerced whatever the active mode is, so flipping back into
  // ANNOTATE later never lands on a tool that cannot draw.
  const activeTool =
    requested.activeTool === null ||
    isAnnotateToolAvailable(requested.activeTool, ctx)
      ? requested.activeTool
      : fallbackToolFor(ctx);

  return { interactionMode, activeTool };
}
