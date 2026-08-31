/**
 * `konnektion.json`: what a reader learns before opening a single Parquet file.
 *
 * The sibling of `fabriksManifest.ts`, and deliberately shaped like it — the
 * two formats lay their prefixes out identically so that a reader who knows one
 * knows the other. What differs is the `encoding` vocabulary, because a graph
 * is packed differently from a surface.
 *
 * The two properties that shape the file are the same:
 *
 *  - **The manifest is the completion marker.** `konnektion.json` is written
 *    AFTER every file it names, so a prefix without one is an interrupted write
 *    rather than a collection — a 404 here is reported as such, not as an empty
 *    render.
 *  - **`files[*].bytes` is load-bearing.** A Parquet footer sits at the END of
 *    a file and the transport speaks get/get-range only — no HEAD. The recorded
 *    length is the only way to seek to a footer at all.
 *
 * And one that is sharper here than for meshes. konnektion's own NETWORKS.md §1
 * spells it out: a mesh has a single obvious primitive, a graph has two, and
 * **the edge blob is a flat integer array whose ARITY is the only thing
 * separating a segment list from a triangle list**. Read one as the other and
 * nothing errors at any layer — the lengths divide, the indices are in range,
 * and the picture is nonsense. So `encoding.edges` is required and checked
 * against the vocabulary, never defaulted.
 *
 * The GraphQL types hand `grid` and `encoding` over as `Any`/`JSON`, which
 * codegen lands as `any`. **This parser is therefore the only validation those
 * values ever get.**
 */

/**
 * The spec version this reader was written against, recorded rather than
 * enforced — the same call `fabriksManifest.ts` makes and for the same reason.
 * What decides how bytes are read is `encoding`, and that IS validated
 * strictly. `manifest.specVersion` is kept so anything wanting to branch can.
 */
export const KONNEKTION_SPEC_VERSION = "1";

export const MANIFEST_NAME = "konnektion.json";

export type KonnektionGrid = {
  /**
   * Cell extents in voxels, one per component IN THE SAME ORDER AS THE NODE
   * POSITIONS. Slots 0/1/2, never named axes — the store's `axes` declaration
   * is the only trustworthy slot↔axis map. The `bbox_*_x/y/z` catalog columns
   * use the same slot convention.
   */
  cellSize: [number, number, number];
  /** Number of octree levels; 0 is the finest. Commonly 1: konnektion picks its
   *  depth from the data, and a traced arbor rarely earns a ladder. */
  levels: number;
  sortKey: "MORTON";
};

export type KonnektionEncoding = {
  positions: "UINT16_QUANTIZED_PER_CELL";
  /** The ARITY declaration. See the module docblock: this is the key that
   *  cannot be guessed, because guessing it wrong produces no error. */
  edges: "UINT32_PAIRS";
  nodeIds: "UINT64" | "UINT32";
  /** NONE means the collection carries no radius at all — and the `radii` /
   *  `ghost_radii` columns are then absent rather than zero-filled, so that a
   *  reader cannot find zeros and believe them. */
  radii: "NONE" | "FLOAT32" | "UINT16_QUANTIZED_PER_CELL";
  /**
   * Ghosts are the TAIL of the node array, and the value names the thing that
   * matters about them: each is quantized against the box of the cell that
   * OWNS it, not the one that stores it. There is no ghost bitset — the two
   * counts already say which entries are copies.
   */
  ghosts: "TRAILING_PER_OWNER_CELL";
  codec: "NONE";
  /** Per-BLOB compression — NOT the Parquet page compression, which is the file's. */
  compression: "NONE" | "ZSTD";
  /** The two coarsening operations, declared SEPARATELY because a level can run
   *  one and not the other, and a schedule that runs neither must be able to
   *  say so. NONE/NONE is the expected single-level case, not a degenerate one. */
  pruning: "NONE" | "STRAHLER" | "CUSTOM";
  simplification: "NONE" | "DOUGLAS_PEUCKER" | "CUSTOM";
};

export type KonnektionFileEntry = {
  path: string;
  /** Absent on a hand-written manifest; the reader must then fetch the file whole. */
  bytes: number | null;
  rowGroups: number | null;
};

export type KonnektionManifest = {
  specVersion: string;
  grid: KonnektionGrid;
  encoding: KonnektionEncoding;
  counts: Record<string, unknown>;
  cells: KonnektionFileEntry;
  objects: KonnektionFileEntry;
  /** Geometry parts per level, keyed by level number. */
  levels: ReadonlyMap<number, readonly KonnektionFileEntry[]>;
};

/** Thrown for every manifest this reader refuses; never for a transport failure. */
export class KonnektionFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KonnektionFormatError";
  }
}

/**
 * The vocabulary, keyed by the manifest's OWN spelling.
 *
 * These are the wire keys, taken from `konnektion/manifest.py`'s
 * `_ENCODING_FIELDS`, and the one that catches people is `nodeIds`: the writer
 * camel-cases exactly that key and no other, so a parser that assumed either
 * convention throughout would reject every real manifest.
 */
const VOCABULARY = {
  positions: ["UINT16_QUANTIZED_PER_CELL"],
  edges: ["UINT32_PAIRS"],
  nodeIds: ["UINT64", "UINT32"],
  radii: ["NONE", "FLOAT32", "UINT16_QUANTIZED_PER_CELL"],
  ghosts: ["TRAILING_PER_OWNER_CELL"],
  codec: ["NONE"],
  compression: ["NONE", "ZSTD"],
  pruning: ["NONE", "STRAHLER", "CUSTOM"],
  simplification: ["NONE", "DOUGLAS_PEUCKER", "CUSTOM"],
} as const;

type WireKey = keyof typeof VOCABULARY;

const ENCODING_KEYS = Object.keys(VOCABULARY) as WireKey[];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** A file entry is a path, or an object carrying one (a bare string is legal). */
const parseFileEntry = (raw: unknown, where: string): KonnektionFileEntry => {
  if (typeof raw === "string") return { path: raw, bytes: null, rowGroups: null };
  if (!isRecord(raw) || typeof raw.path !== "string") {
    throw new KonnektionFormatError(
      `${where} is a path, or an object carrying one; got ${JSON.stringify(raw)}.`,
    );
  }
  return {
    path: raw.path,
    bytes: typeof raw.bytes === "number" ? raw.bytes : null,
    rowGroups: typeof raw.rowGroups === "number" ? raw.rowGroups : null,
  };
};

export const parseGrid = (raw: unknown): KonnektionGrid => {
  if (!isRecord(raw)) {
    throw new KonnektionFormatError(
      "A manifest must carry a `grid` object: it is how a reader turns a Morton code into a box, " +
        "and nothing else in the prefix states it.",
    );
  }
  const cellSize = raw.cellSize ?? raw.cell_size;
  if (
    !Array.isArray(cellSize) ||
    cellSize.length !== 3 ||
    !cellSize.every((c) => typeof c === "number" && Number.isFinite(c) && c >= 1)
  ) {
    throw new KonnektionFormatError(
      `\`grid.cellSize\` is three whole numbers of at least 1 voxel, one per component; got ${JSON.stringify(cellSize)}.`,
    );
  }
  const levels = raw.levels;
  if (typeof levels !== "number" || levels < 1) {
    throw new KonnektionFormatError(
      `An octree has at least one level; got ${JSON.stringify(levels)}.`,
    );
  }
  const sortKey = raw.sortKey ?? raw.sort_key ?? "MORTON";
  if (sortKey !== "MORTON") {
    throw new KonnektionFormatError(
      `\`grid.sortKey\` is ${JSON.stringify(sortKey)}; the format defines MORTON.`,
    );
  }
  return {
    cellSize: cellSize as [number, number, number],
    levels: Math.floor(levels),
    sortKey: "MORTON",
  };
};

export const parseEncoding = (raw: unknown): KonnektionEncoding => {
  if (!isRecord(raw)) {
    throw new KonnektionFormatError(
      "A manifest must carry an `encoding` object: it is how a reader turns blobs into a graph.",
    );
  }
  const missing = ENCODING_KEYS.filter((key) => !(key in raw));
  if (missing.length > 0) {
    // Fatal, matching the writer. `edges` above all: its arity is the only
    // thing separating a segment list from a triangle list, and reading one as
    // the other errors nowhere (NETWORKS.md §1).
    throw new KonnektionFormatError(
      `This manifest's \`encoding\` omits ${missing.join(", ")}. A decoder cannot infer them, and a ` +
        `wrong guess produces garbage rather than an error, so the collection is refused.`,
    );
  }
  for (const key of ENCODING_KEYS) {
    const allowed: readonly string[] = VOCABULARY[key];
    if (typeof raw[key] !== "string" || !allowed.includes(raw[key] as string)) {
      throw new KonnektionFormatError(
        `\`encoding.${key}\` is ${JSON.stringify(raw[key])}; the format defines ${allowed.join(", ")}.`,
      );
    }
  }
  // The wire keys and the field names coincide, `nodeIds` included, so this is
  // a projection rather than a rename.
  return Object.fromEntries(
    ENCODING_KEYS.map((key) => [key, raw[key]]),
  ) as unknown as KonnektionEncoding;
};

const parseLevels = (raw: unknown): Map<number, KonnektionFileEntry[]> => {
  if (!isRecord(raw)) {
    throw new KonnektionFormatError(
      "This manifest's `files` carries no `levels`, which means its geometry can only be found by " +
        "listing the prefix — and this reader cannot list. Rewrite the collection with a writer that " +
        "records its parts.",
    );
  }
  const levels = new Map<number, KonnektionFileEntry[]>();
  for (const [key, value] of Object.entries(raw)) {
    const level = Number(key);
    if (!Number.isInteger(level) || level < 0) {
      throw new KonnektionFormatError(
        `\`files.levels\` is keyed by level number; got ${JSON.stringify(key)}.`,
      );
    }
    if (!Array.isArray(value) || value.length === 0) {
      throw new KonnektionFormatError(`\`files.levels[${key}]\` is a non-empty list of parts.`);
    }
    levels.set(
      level,
      value.map((entry, index) => parseFileEntry(entry, `files.levels[${key}][${index}]`)),
    );
  }
  if (levels.size === 0) throw new KonnektionFormatError("`files.levels` names no levels at all.");
  return levels;
};

/** Parse `konnektion.json`. Throws `KonnektionFormatError` for anything unreadable. */
export function parseKonnektionManifest(raw: unknown): KonnektionManifest {
  if (!isRecord(raw)) throw new KonnektionFormatError("A manifest is a JSON object.");

  // Recorded, not gated — see KONNEKTION_SPEC_VERSION. `encoding` is the check
  // that matters, and it runs below.
  const specVersion = String(raw.specVersion ?? raw.spec_version ?? "").trim();

  const files = raw.files;
  if (!isRecord(files)) {
    throw new KonnektionFormatError(
      "A manifest must carry a `files` object naming its catalogs and parts.",
    );
  }

  return {
    specVersion,
    grid: parseGrid(raw.grid),
    encoding: parseEncoding(raw.encoding),
    counts: isRecord(raw.counts) ? raw.counts : {},
    cells: parseFileEntry(files.cells, "files.cells"),
    objects: parseFileEntry(files.objects, "files.objects"),
    levels: parseLevels(files.levels),
  };
}

/** Whether this collection stores a per-node radius at all. */
export const hasRadii = (encoding: KonnektionEncoding): boolean => encoding.radii !== "NONE";

/** The geometry parts of one level, or an empty list if the level carries none. */
export const levelParts = (
  manifest: KonnektionManifest,
  level: number,
): readonly KonnektionFileEntry[] => manifest.levels.get(level) ?? [];

/** The levels that actually carry geometry, coarsest first. */
export const levelsCoarsestFirst = (manifest: KonnektionManifest): number[] =>
  [...manifest.levels.keys()].sort((a, b) => b - a);

/** The levels that actually carry geometry, finest first. */
export const levelsFinestFirst = (manifest: KonnektionManifest): number[] =>
  [...manifest.levels.keys()].sort((a, b) => a - b);

/**
 * The coarsest level the planner may choose.
 *
 * Same divergence from the Python reader as fabriks makes, for the same reason:
 * taking the declared `grid.levels - 1` renders nothing at all when a
 * collection declares more levels than its catalog reached, and an empty render
 * is the worst possible reading of a collection that has geometry.
 */
export function rootLevel(manifest: KonnektionManifest): number {
  const declared = manifest.grid.levels - 1;
  if (manifest.levels.has(declared)) return declared;
  const present = levelsCoarsestFirst(manifest)[0];
  console.warn(
    `[konnektion] grid declares ${manifest.grid.levels} levels, so the coarsest should be ${declared}, ` +
      `but the coarsest level with geometry is ${present}. Using ${present}.`,
  );
  return present;
}
