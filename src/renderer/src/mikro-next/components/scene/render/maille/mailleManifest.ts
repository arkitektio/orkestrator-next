/**
 * `maille.json`: what a reader learns before opening a single Parquet file.
 *
 * A maille collection is a self-describing PREFIX, not a list of files handed
 * to us by the API — so everything spatial and every byte layout is declared
 * here, next to the geometry, and this module is the only place that reads it.
 *
 * Two properties of the format shape this file:
 *
 *  - **The manifest is the completion marker.** A prefix has no atomic "upload
 *    finished" flag, so maille writes `maille.json` AFTER every file it names.
 *    A prefix without one is an interrupted write, not a collection — which is
 *    why a 404 here is reported as such rather than as an empty render.
 *  - **`files[*].bytes` is load-bearing.** A Parquet footer sits at the END of
 *    a file, and the store contract is get/put/list — no HEAD, no stat. The
 *    recorded length is the only way a reader can seek to a footer at all.
 *
 * Nothing is defaulted on the writer's behalf. `codec` and `compression` in
 * particular are always stated: a wrong guess is not an error, it is geometry
 * that decodes to garbage.
 */

/**
 * The spec version this reader was written against, recorded rather than
 * enforced.
 *
 * **The version is deliberately not gated on.** It is in flux — the upstream
 * writer and the deployment disagree on the label while describing identical
 * trees — and refusing on it would reject data this reader demonstrably
 * decodes. What actually determines how bytes are read is the `encoding`
 * block, and THAT is validated strictly: every key required, every value
 * against the format's vocabulary, and the undecodable MESHOPT+ZSTD pair
 * refused outright. A wrong `codec` is garbage geometry; a surprising version
 * string, on its own, is not.
 *
 * `manifest.specVersion` is parsed and kept, so anything that wants to branch
 * on it still can.
 */
export const MAILLE_SPEC_VERSION = "1";

export const MANIFEST_NAME = "maille.json";

export type MailleGrid = {
  /**
   * Cell extents, one per component IN THE SAME ORDER AS THE VERTICES. These
   * are slots 0/1/2, never named axes: a collection cut from (z, y, x) data
   * states its cell size in (z, y, x) and is entirely consistent. The
   * `bbox_*_x/y/z` catalog columns use the same slot convention.
   */
  cellSize: [number, number, number];
  /** Number of octree levels; 0 is the finest. */
  levels: number;
  sortKey: "MORTON";
};

export type MailleEncoding = {
  positions: "UINT16_QUANTIZED_PER_CELL";
  indices: "UINT32" | "UINT16";
  codec: "NONE" | "MESHOPT";
  /** Per-BLOB compression — NOT the Parquet page compression, which is the file's. */
  compression: "NONE" | "ZSTD";
  boundary: "LOCKED" | "OPEN";
  decimation: "QUARTER" | "HALF" | "EIGHTH" | "CUSTOM";
};

export type MailleFileEntry = {
  path: string;
  /** Absent on a hand-written manifest; the reader must then fetch the file whole. */
  bytes: number | null;
  rowGroups: number | null;
};

export type MailleManifest = {
  specVersion: string;
  grid: MailleGrid;
  encoding: MailleEncoding;
  counts: Record<string, unknown>;
  cells: MailleFileEntry;
  objects: MailleFileEntry;
  /** Geometry parts per level, keyed by level number. */
  levels: ReadonlyMap<number, readonly MailleFileEntry[]>;
};

/** Thrown for every manifest this reader refuses; never for a transport failure. */
export class MailleFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MailleFormatError";
  }
}

const VOCABULARY = {
  positions: ["UINT16_QUANTIZED_PER_CELL"],
  indices: ["UINT32", "UINT16"],
  codec: ["NONE", "MESHOPT"],
  compression: ["NONE", "ZSTD"],
  boundary: ["LOCKED", "OPEN"],
  decimation: ["QUARTER", "HALF", "EIGHTH", "CUSTOM"],
} as const;

const ENCODING_KEYS = Object.keys(VOCABULARY) as (keyof typeof VOCABULARY)[];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** A file entry is a path, or an object carrying one (a bare string is legal). */
const parseFileEntry = (raw: unknown, where: string): MailleFileEntry => {
  if (typeof raw === "string") return { path: raw, bytes: null, rowGroups: null };
  if (!isRecord(raw) || typeof raw.path !== "string") {
    throw new MailleFormatError(
      `${where} is a path, or an object carrying one; got ${JSON.stringify(raw)}.`,
    );
  }
  return {
    path: raw.path,
    bytes: typeof raw.bytes === "number" ? raw.bytes : null,
    rowGroups: typeof raw.rowGroups === "number" ? raw.rowGroups : null,
  };
};

const parseGrid = (raw: unknown): MailleGrid => {
  if (!isRecord(raw)) {
    throw new MailleFormatError(
      "A manifest must carry a `grid` object: it is how a reader turns a Morton code into a " +
        "box, and nothing else in the prefix states it.",
    );
  }
  const cellSize = raw.cellSize;
  if (
    !Array.isArray(cellSize) ||
    cellSize.length !== 3 ||
    !cellSize.every((c) => typeof c === "number" && Number.isFinite(c) && c >= 1)
  ) {
    throw new MailleFormatError(
      `\`grid.cellSize\` is three whole numbers of at least 1 voxel, one per component; got ${JSON.stringify(cellSize)}.`,
    );
  }
  const levels = raw.levels;
  if (typeof levels !== "number" || levels < 1) {
    throw new MailleFormatError(`An octree has at least one level; got ${JSON.stringify(levels)}.`);
  }
  const sortKey = raw.sortKey ?? "MORTON";
  if (sortKey !== "MORTON") {
    throw new MailleFormatError(`\`grid.sortKey\` is ${JSON.stringify(sortKey)}; the format defines MORTON.`);
  }
  return { cellSize: cellSize as [number, number, number], levels: Math.floor(levels), sortKey: "MORTON" };
};

const parseEncoding = (raw: unknown): MailleEncoding => {
  if (!isRecord(raw)) {
    throw new MailleFormatError(
      "A manifest must carry an `encoding` object: it is how a reader turns blobs into geometry.",
    );
  }
  const missing = ENCODING_KEYS.filter((key) => !(key in raw));
  if (missing.length > 0) {
    // Deliberately fatal, matching the writer: a decoder cannot infer these,
    // and a wrong guess is not an error, it is geometry that decodes to garbage.
    throw new MailleFormatError(
      `This manifest's \`encoding\` omits ${missing.join(", ")}. A decoder cannot infer them, and a ` +
        `wrong guess produces garbage rather than an error, so the collection is refused.`,
    );
  }
  for (const key of ENCODING_KEYS) {
    const allowed: readonly string[] = VOCABULARY[key];
    if (typeof raw[key] !== "string" || !allowed.includes(raw[key] as string)) {
      throw new MailleFormatError(
        `\`encoding.${key}\` is ${JSON.stringify(raw[key])}; the format defines ${allowed.join(", ")}.`,
      );
    }
  }
  const encoding = Object.fromEntries(ENCODING_KEYS.map((key) => [key, raw[key]])) as MailleEncoding;
  if (encoding.codec === "MESHOPT" && encoding.compression === "ZSTD") {
    // The format derives a ZSTD blob's decompressed length from the row's
    // counts (6 B/vertex, 4 B/index); a meshopt blob has no such fixed size per
    // element, so the pair is undecodable rather than merely redundant.
    throw new MailleFormatError(
      "`codec: MESHOPT` with `compression: ZSTD` cannot be decoded: a compressed blob's length comes " +
        "from the row's vertex and index counts, and a meshopt blob has no fixed size per element.",
    );
  }
  return encoding;
};

const parseLevels = (raw: unknown): Map<number, MailleFileEntry[]> => {
  if (!isRecord(raw)) {
    throw new MailleFormatError(
      "This manifest's `files` carries no `levels`, which means its geometry can only be found by " +
        "listing the prefix — and this reader cannot list. Rewrite the collection with a writer that " +
        "records its parts.",
    );
  }
  const levels = new Map<number, MailleFileEntry[]>();
  for (const [key, value] of Object.entries(raw)) {
    const level = Number(key);
    if (!Number.isInteger(level) || level < 0) {
      throw new MailleFormatError(`\`files.levels\` is keyed by level number; got ${JSON.stringify(key)}.`);
    }
    if (!Array.isArray(value) || value.length === 0) {
      throw new MailleFormatError(`\`files.levels[${key}]\` is a non-empty list of parts.`);
    }
    levels.set(
      level,
      value.map((entry, index) => parseFileEntry(entry, `files.levels[${key}][${index}]`)),
    );
  }
  if (levels.size === 0) throw new MailleFormatError("`files.levels` names no levels at all.");
  return levels;
};

/** Parse `maille.json`. Throws `MailleFormatError` for anything unreadable. */
export function parseMailleManifest(raw: unknown): MailleManifest {
  if (!isRecord(raw)) throw new MailleFormatError("A manifest is a JSON object.");

  // Recorded, not gated — see MAILLE_SPEC_VERSION. `encoding` is the check
  // that matters, and it runs below.
  const specVersion = String(raw.specVersion ?? "").trim();

  const files = raw.files;
  if (!isRecord(files)) {
    throw new MailleFormatError("A manifest must carry a `files` object naming its catalogs and parts.");
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

/** The geometry parts of one level, or an empty list if the level carries none. */
export const levelParts = (manifest: MailleManifest, level: number): readonly MailleFileEntry[] =>
  manifest.levels.get(level) ?? [];

/** The levels that actually carry geometry, coarsest first. */
export const levelsCoarsestFirst = (manifest: MailleManifest): number[] =>
  [...manifest.levels.keys()].sort((a, b) => b - a);

/**
 * The level the planner descends FROM.
 *
 * maille's own reader takes roots at the declared `grid.levels - 1`, which
 * plans nothing at all when a collection declares more levels than its catalog
 * actually reached. We fall back to the coarsest level present and warn — a
 * deliberate divergence, because an empty render is the worst possible reading
 * of a collection that has geometry.
 */
export function rootLevel(manifest: MailleManifest): number {
  const declared = manifest.grid.levels - 1;
  if (manifest.levels.has(declared)) return declared;
  const present = levelsCoarsestFirst(manifest)[0];
  console.warn(
    `[maille] grid declares ${manifest.grid.levels} levels, so roots should sit at level ${declared}, ` +
      `but the coarsest level with geometry is ${present}. Descending from ${present}.`,
  );
  return present;
}
