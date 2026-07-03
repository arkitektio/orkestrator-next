// Named TypeScript types for elektro's pint-like quantity scalars.
//
// These are referenced from `elektro.yml` (the `scalars:` codegen config) so the
// generated `graphql.ts` types each field with a meaningful name — `Duration`,
// `Length`, … — instead of `any` or a bare `string`. They are string-based: the
// wire format carries the magnitude *and* unit together, e.g. "100 ms", "1 µm",
// "-70 mV", "5 nS", "50 Hz".
//
// Parse / format / unit-convert these via `../lib/quantities.ts` (`parseQuantity`,
// `formatQuantity`, `toBase`) — never do arithmetic on them directly.

/** A quantity of time, e.g. "5 ms", "2 s". */
export type Duration = string;

/** A length, e.g. "1 µm", "10 mm". */
export type Length = string;

/** An electric potential / voltage, e.g. "-70 mV", "5 V". */
export type ElectricPotential = string;

/** An electrical conductance, e.g. "5 nS", "2 µS". */
export type ElectricalConductance = string;

/** A frequency, e.g. "50 Hz", "2 kHz". */
export type Frequency = string;

/** An ion concentration, e.g. "10 mM", "140 mM" (NEURON nai/nao/…). */
export type Concentration = string;

/** An axial resistivity, e.g. "35.4 Ω·cm" (NEURON Ra). */
export type Resistivity = string;

/** A specific membrane capacitance, e.g. "1 µF/cm²" (NEURON cm). */
export type SpecificCapacitance = string;

/** A thermodynamic temperature, e.g. "309.15 K" (NEURON celsius bath temp). */
export type Temperature = string;

// --- Dimension-free / metadata quantity scalars --------------------------
//
// Unlike the nine dimension-locked scalars above, these are not pinned to a
// single physical dimension — they describe or carry a value of *any* dimension.
// Used by the grounded mechanism-parameter system: a `Parameter` port declares a
// `Dimension` + `Unit`s, and its value travels as a `GenericQuantity`.

/**
 * A physical quantity of *any* dimension, magnitude + unit together, e.g.
 * "0.12 S/cm2", "-54.3 mV", "2 mM". Unlike the dimension-locked scalars it keeps
 * whatever unit the value carries; validating it against an expected dimension is
 * the caller's job. Parse / format via `../lib/quantities.ts`.
 */
export type GenericQuantity = string;

/** A physical unit symbol, e.g. "mV", "S/cm2", "second". */
export type Unit = string;

/**
 * A pint dimensionality string, e.g. "[length]", "[current] / [length] ** 2",
 * "dimensionless". NOTE: this is distinct from the editor-local `Dimension`
 * *union* in `../lib/quantities.ts` (`"length" | "voltage" | …`) — that one names
 * a curated unit table; this one is the backend's raw pint dimensionality.
 */
export type Dimension = string;

/**
 * An RGBA color as a 4-element list `[r, g, b, a]` — `r`/`g`/`b` in 0–255, `a` in
 * 0–1 (react-colorful's native ranges). Used e.g. to tint a biophysics
 * compartment. Convert to/from CSS + picker objects via `../lib/color.ts`.
 */
export type RGBAColor = number[];
