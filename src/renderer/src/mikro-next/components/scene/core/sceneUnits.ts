/**
 * Display symbols for the scene's spatial unit.
 *
 * `sceneStore.spatialUnit` is a raw server string (the unit of the world
 * coordinate system's first SPACE axis), so anything unrecognised passes through
 * verbatim rather than being swallowed. Shared so the scale bar and the drawing
 * readout can never disagree about what "µm" means.
 */
export const UNIT_LABELS: Record<string, string> = {
  MICROMETERS: "µm",
  NANOMETERS: "nm",
  ANGSTROMS: "Å",
  PIXELS: "px",
  UNKNOWN: "units",
};

export const unitLabel = (spatialUnit: string): string =>
  UNIT_LABELS[spatialUnit] ?? spatialUnit;
