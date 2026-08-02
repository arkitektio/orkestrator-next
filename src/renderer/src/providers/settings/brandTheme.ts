/**
 * The single writer of `--brand-hue` / `--brand-chroma` on `<html>`.
 *
 * Two independent sources want those variables:
 *   - the BASE, from user settings (ThemeCustomizer → settingsStore), and
 *   - an OVERRIDE, from whatever scene is currently open (its main layer's
 *     colormap tints the whole app).
 *
 * They must not write the inline style directly or the last writer wins by
 * accident — saving an unrelated setting mid-scene would snap the hue back, and
 * leaving a scene would wipe the user's chosen brand color. Both go through
 * here instead, and the effective value is always `override ?? base`.
 */

export type Brand = {
  hue: number;
  chroma: number;
};

/**
 * What a source ASKS for, before it is resolved against the current hue.
 *
 * `hue: null` means "no opinion on hue" — an achromatic color (a grey colormap)
 * still sets a chroma, and at chroma ≈ 0 the hue is both invisible and
 * numerically meaningless, so the hue already in play is left where it is
 * rather than spun to a noise angle.
 */
export type BrandTarget = {
  hue: number | null;
  chroma: number;
};

/** Fallback when neither source has a value — the stylesheet's own cascade
 * (`:root` / `.dark`) takes over, so we remove the inline property. */
type PartialBrand = {
  hue: number | undefined;
  chroma: number | undefined;
};

let base: PartialBrand = { hue: undefined, chroma: undefined };
let override: Brand | null = null;

const writeProperty = (name: string, value: number | undefined) => {
  if (value === undefined) {
    document.documentElement.style.removeProperty(name);
    return;
  }
  document.documentElement.style.setProperty(name, value.toString());
};

const apply = () => {
  if (typeof document === "undefined") {
    return;
  }
  writeProperty("--brand-hue", override?.hue ?? base.hue);
  writeProperty("--brand-chroma", override?.chroma ?? base.chroma);
};

/** The user's configured brand, from settings. `undefined` fields fall back to
 * the stylesheet (which is how a user who never touched the customizer gets the
 * `.dark` block's own hue). */
export const setBrandBase = (next: PartialBrand) => {
  base = next;
  apply();
};

/** A scene's tint, or `null` to hand control back to the base. */
export const setBrandOverride = (next: Brand | null) => {
  override = next;
  apply();
};

/** What is currently on screen. The hue may be UNWRAPPED (outside 0–360) —
 * callers keep it continuous so a 350° → 10° change transitions the short way
 * round rather than sweeping backwards through the whole circle. `oklch()`
 * treats hue as modulo-360, so an unwrapped value renders identically. */
export const getEffectiveBrand = (): PartialBrand => ({
  hue: override?.hue ?? base.hue,
  chroma: override?.chroma ?? base.chroma,
});

/** Test seam — resets both sources without touching the DOM state semantics. */
export const resetBrandTheme = () => {
  base = { hue: undefined, chroma: undefined };
  override = null;
  apply();
};
