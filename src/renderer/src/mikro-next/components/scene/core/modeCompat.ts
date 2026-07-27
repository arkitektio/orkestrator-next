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
  "ELLIPSIS",
  "POINT",
  "LINE",
  "POLYGON",
  "PATH",
];

/** Where a coercion lands. Never null: a null tool leaves ANNOTATE inert. */
export const FALLBACK_MODE: InteractionMode = "NAVIGATE";
export const FALLBACK_TOOL: AnnotateTool = "RECTANGLE";

/**
 * Only the brick layers emit probes, and `sceneStore.layers` is *already*
 * exactly the image layers (`scene.layers.filter(isImageLayer)`; the raw
 * polymorphic list is `sceneLayers`). Both brick layers bail on
 * `visible === false`, so visibility is the whole predicate.
 *
 * Deliberately not gated on brick residency: that is streaming cadence, and
 * gating the mode picker on it would make the Probe button flicker while bricks
 * stream in.
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

/** The marquee (`interactions/RectangleDrawer.tsx`) is 2D-only. */
export function isAnnotateToolAvailable(
  tool: AnnotateTool,
  ctx: Pick<ModeContext, "displayMode">,
): boolean {
  return tool === "SELECT" ? ctx.displayMode === "2D" : true;
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
      : FALLBACK_TOOL;

  return { interactionMode, activeTool };
}
