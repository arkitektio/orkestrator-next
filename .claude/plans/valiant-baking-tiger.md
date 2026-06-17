# Quantity widgets for elektro pint-like scalars

## Context

The elektro GraphQL wire format changed: numeric fields became "pint-like quantity"
scalars carried as **strings with an explicit unit** — `Duration` (`"100 ms"`),
`Length` (`"1 µm"`), `ElectricPotential` (`"-70 mV"`), `ElectricalConductance`
(`"5 nS"`), `Frequency` (`"50 Hz"`). In the generated TS
(`src/renderer/src/elektro/api/graphql.ts`) all five map to `any`.

Two problems follow:

1. **No edit affordance.** The user wants dedicated form widgets: a numeric input
   for the magnitude plus a unit-selector dropdown, that parse `"100 ms"` → `100` +
   `ms` for display and re-serialize on change. The flagged surface is the
   **NeuronModelEdit page** (`NeuronEditorPage` → `NeuronEditor`), the only place that
   currently edits these scalars (section `length`, `diam`).
2. **Silent breakage.** Because the scalars are now `any`, TypeScript does **not**
   flag the existing code that does arithmetic on them. At runtime those strings
   produce `NaN`: the 3D layout math, the renderer geometry, coord interpolation,
   the simulation-card duration display, and the editor's pre-save validation are
   all broken until they parse the magnitude out of the string.

Goal: ship a reusable quantity-input toolkit covering all five dimensions, wire it
into the NeuronEditor, and repair every numeric consumer of these scalars.

## Approach

### 1. Quantity utility module — `src/renderer/src/elektro/lib/quantities.ts` (new)

The single source of truth for parsing, formatting, and unit conversion.

- `type Dimension = "time" | "length" | "voltage" | "conductance" | "frequency"`.
- Per-dimension unit tables `{ symbol, toBase }` with one `base` unit each:
  - length: pm, nm, **µm**(base), mm, cm, m
  - time: ns, µs, **ms**(base), s, min
  - voltage: µV, **mV**(base), V
  - conductance: pS, **nS**(base), µS, mS, S
  - frequency: **Hz**(base), kHz, MHz
- `SCALAR_DIMENSION: Record<"Length"|"Duration"|"ElectricPotential"|"ElectricalConductance"|"Frequency", Dimension>`
  so a GraphQL scalar name maps to a dimension.
- `parseQuantity(value): { magnitude: number | null; unit: string }` — regex split
  of leading number (incl. sign / decimal / exponent) from trailing unit symbol;
  tolerant of `null`/`""` (→ `{magnitude: null, unit: base}`).
- `formatQuantity(magnitude, unit): string` → `"100 ms"`.
- `toBase(value, dimension, fallback = NaN): number` — parse + convert magnitude
  into the dimension's base unit; used everywhere geometry/comparison math needs a
  number regardless of the unit the user picked. Returns `fallback` when unparseable.
- `formatDisplay(value, dimension): string` — pretty read-only rendering (reuses
  `parseQuantity`; falls back to the raw string).

### 2. Controlled widget — `src/renderer/src/elektro/components/QuantityInput.tsx` (new)

Standalone controlled component (NeuronEditor uses local `useState`, not
react-hook-form):

- Props: `{ value: string | null; onChange: (next: string) => void; dimension: Dimension; placeholder?: string; className?: string }`.
- Parses `value` once; renders an `InputGroup`
  (`src/renderer/src/components/ui/input-group.tsx`) with `InputGroupInput`
  (numeric magnitude) and an `InputGroupAddon align="inline-end"` holding a shadcn
  `Select` (`src/renderer/src/components/ui/select.tsx`) of the dimension's unit
  symbols.
- On magnitude **or** unit change → `onChange(formatQuantity(mag, unit))`.
- If the incoming unit isn't in the preset list, inject it as an extra option so an
  unusual server value is preserved, not silently dropped.

### 3. react-hook-form field — `src/renderer/src/components/fields/QuantityField.tsx` (new)

Thin wrapper for future create/edit forms, matching the existing field convention
(`FloatField.tsx`): `FieldProps & { dimension: Dimension; placeholder?: string }`,
`useFormContext` + `FormField` scaffolding, renders `QuantityInput` bound to
`field.value` / `field.onChange`. Built for reuse; no form consumes it yet.

### 4. Wire into the NeuronEditor — `src/renderer/src/elektro/components/NeuronEditor.tsx`

- Replace the **Length** input (~lines 679–691) and **Diameter** input (~693–705)
  with `<QuantityInput dimension="length" value={section.length}
  onChange={v => updateSection(section.id, { length: v })} />` (and `diam`).
- `addSection` defaults (~lines 341–348): `diam: "1 µm"`, `length: "10 µm"` (strings).
- Layout math in `useNeuronLayout` (~line 153): `const length = toBase(section.length, "length", 10)`.
- `InteractiveSegment` (~lines 246, 265): derive `const diamUm = toBase(section.diam, "length", 1)` and use `diamUm/2`, `hitRadius`.
- "Location on parent" absolute-µm readout (~lines 713–714): `parentLength` via `toBase(parent.length, "length", 0)`.

### 5. Repair the other numeric consumers

- `src/renderer/src/elektro/components/NeuronRenderer.tsx` (~lines 160, 208, 212) —
  `section.length`/`section.diam` via `toBase(..., "length", default)`.
- `src/renderer/src/elektro/model_render/utils.tsx` `interpolateCoords` — coords
  `x/y/z` are now `Length` strings; wrap each in `toBase(c.x, "length", 0)` before
  the `THREE.Vector3` math.
- `src/renderer/src/elektro/components/cards/SimulationCard.tsx` (~lines 13–15) —
  `item.duration` is now a `Duration` string; compute `durationMs = toBase(item.duration, "time", 0)` and keep the existing seconds/ms formatting.
- `src/renderer/src/elektro/lib/modelSerialization.ts` validation (~lines 152–156):
  `s.length <= 0` / `s.diam <= 0` now compare a string to a number and never fire —
  parse with `toBase(..., "length")` before the comparison. `serializeSection` /
  `serializeCoord` pass the strings straight through to the server, which is correct
  for the new scalars; no change needed there.

## Notes / decisions

- Unit lists are **fixed presets per dimension** (per the user). No free-text unit
  entry; an out-of-list server value is still shown (injected option) but the
  dropdown only offers the curated set.
- `config.celsius` is a temperature, not one of the five new scalars — left as-is.
- This is a runtime-correctness fix as much as a feature: the `any` typing means
  `yarn typecheck` will stay green either way, so verification must be by running
  the app, not by the type gate (see Verification).

## Verification

1. `yarn typecheck` — must not regress the baseline (the new code is fully typed;
   the scalars remain `any`).
2. Run the app (`yarn dev` / project run skill) and open a neuron model's **Edit**
   page (`NeuronModelEditorPage`):
   - Expand a section: Length/Diameter now show a number + unit dropdown, pre-filled
     from the stored value (e.g. `10` + `µm`).
   - Change the magnitude and the unit; confirm the 3D cylinder resizes correctly
     (geometry uses the µm-normalized magnitude, so switching `µm`→`mm` rescales).
   - Add a new section: it appears with a sane default size (`10 µm` / `1 µm`), not a
     zero/NaN-collapsed segment.
   - Save: the mutation sends `length`/`diam` as `"<n> <unit>"` strings; saving
     succeeds and the reopened model round-trips the values.
3. Open a Simulation list/card and confirm the duration renders (e.g. "2.00 seconds"
   / "100 ms") instead of `NaN`.
4. Sanity-check `interpolateCoords`-driven renders (models with explicit coords) draw
   in the right place rather than collapsing to the origin.
