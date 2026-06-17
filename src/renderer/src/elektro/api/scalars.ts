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
