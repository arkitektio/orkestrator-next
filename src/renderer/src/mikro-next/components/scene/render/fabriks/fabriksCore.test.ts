import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as THREE from "three";
import { describe, expect, it, vi } from "vitest";

import {
  FabriksFormatError,
  levelParts,
  parseFabriksManifest,
  rootLevel,
} from "./fabriksManifest";
import { cellExtent, cellGridBox, maskedChildren, mortonChildren, mortonParent } from "./fabriksGrid";
import { encodeMorton3, decodeMorton3, meshCellKey } from "./mortonCell";
import { buildFabriksCellIndex, maxAxisScale, parseCellRow, type FabriksCellRow } from "./fabriksCatalogs";
import { groupByRowGroup, planFabriksCells, screenError } from "./fabriksPlanner";
import { objectRange, positionStride, indexStride } from "./fabriksDecode";
import { FabriksBatchRenderer } from "./fabriksBatch";
import { FabriksCollection, type FabriksTransport } from "./fabriksCollection";
import { FabriksCollectionManager } from "./fabriksManager";
import { createFabriksMaterial, setInstanceColoring } from "./fabriksMaterial";
import { INSTANCE_COLORMAPS } from "./instanceColormaps";
import { LruByteCache } from "./lruByteCache";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "__fixtures__");

/** A transport over a fixture directory — the same seam S3 plugs into. */
const fixtureTransport = (variant: string): FabriksTransport => {
  const root = join(FIXTURES, variant);
  return {
    async get(path) {
      return new Uint8Array(await readFile(join(root, path)));
    },
    async getRange(path, start, end) {
      const bytes = new Uint8Array(await readFile(join(root, path)));
      return bytes.subarray(start, end);
    },
  };
};

const RAW_MANIFEST = JSON.parse(
  await readFile(join(FIXTURES, "raw", "fabriks.json"), "utf8"),
) as Record<string, unknown>;

// --------------------------------------------------------------------------
describe("fabriksManifest", () => {
  it("parses the fixture the real writer produced", () => {
    const manifest = parseFabriksManifest(RAW_MANIFEST);
    expect(manifest.specVersion).toBeTruthy();
    expect(manifest.grid.cellSize).toEqual([64, 64, 32]);
    expect(manifest.grid.levels).toBe(3);
    expect(manifest.encoding.positions).toBe("UINT16_QUANTIZED_PER_CELL");
    expect(manifest.encoding.codec).toBe("NONE");
    expect(manifest.cells.path).toBe("catalog/cells.parquet");
    expect(manifest.cells.bytes).toBeGreaterThan(0);
    expect(levelParts(manifest, 0)[0].rowGroups).toBeGreaterThan(1);
    expect(rootLevel(manifest)).toBe(2);
  });

  it("records the spec version without gating on it", () => {
    // The writer and the deployment are both at 1 and every change so far
    // landed inside it, so the label carries no decision. `encoding` is the
    // check that actually protects decoding.
    for (const version of ["1", "2", "9"]) {
      expect(parseFabriksManifest({ ...RAW_MANIFEST, specVersion: version }).specVersion).toBe(version);
    }
  });

  it("refuses an encoding missing a key instead of defaulting it", () => {
    const { codec: _dropped, ...rest } = RAW_MANIFEST.encoding as Record<string, unknown>;
    expect(() => parseFabriksManifest({ ...RAW_MANIFEST, encoding: rest })).toThrow(/omits codec/);
  });

  it("refuses MESHOPT paired with ZSTD, which is undecodable", () => {
    const encoding = { ...(RAW_MANIFEST.encoding as object), codec: "MESHOPT", compression: "ZSTD" };
    expect(() => parseFabriksManifest({ ...RAW_MANIFEST, encoding })).toThrow(/cannot be decoded/);
  });

  it("refuses a manifest whose files name no levels, because we cannot list a prefix", () => {
    const files = { ...(RAW_MANIFEST.files as object), levels: undefined };
    expect(() => parseFabriksManifest({ ...RAW_MANIFEST, files })).toThrow(/cannot list/);
  });

  it("accepts a bare path string as a file entry", () => {
    const files = { ...(RAW_MANIFEST.files as Record<string, unknown>), cells: "catalog/cells.parquet" };
    const manifest = parseFabriksManifest({ ...RAW_MANIFEST, files });
    expect(manifest.cells).toEqual({ path: "catalog/cells.parquet", bytes: null, rowGroups: null });
  });
});

// --------------------------------------------------------------------------
describe("morton cells and the octree", () => {
  it("round-trips coordinates", () => {
    for (const triple of [[0, 0, 0], [1, 2, 3], [37, 12, 99]] as const) {
      expect(decodeMorton3(encodeMorton3(...triple))).toEqual([...triple]);
    }
  });

  it("interleaves with component 0 least significant", () => {
    expect(encodeMorton3(1, 0, 0)).toBe(1);
    expect(encodeMorton3(0, 1, 0)).toBe(2);
    expect(encodeMorton3(0, 0, 1)).toBe(4);
  });

  it("children of c are exactly 8c+octant, so descent needs no decode", () => {
    // The identity the whole child_mask descent rests on.
    const [i, j, k] = [5, 3, 9];
    const parent = encodeMorton3(i, j, k);
    for (let octant = 0; octant < 8; octant++) {
      const child = encodeMorton3(2 * i + (octant & 1), 2 * j + ((octant >> 1) & 1), 2 * k + ((octant >> 2) & 1));
      expect(child).toBe(parent * 8 + octant);
    }
    expect(mortonChildren(parent)).toEqual([0, 1, 2, 3, 4, 5, 6, 7].map((o) => parent * 8 + o));
    expect(mortonParent(parent * 8 + 5)).toBe(parent);
  });

  it("child_mask names only the children that carry geometry", () => {
    expect(maskedChildren(3, 0)).toEqual([]);
    expect(maskedChildren(3, 0b1000_0001)).toEqual([24, 31]);
    expect(maskedChildren(0, 0b1111_1111)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("a level-L cell spans cellSize·2^L voxels", () => {
    const grid = { cellSize: [64, 64, 32] as [number, number, number], levels: 3, sortKey: "MORTON" as const };
    expect(cellExtent(grid, 0)).toEqual([64, 64, 32]);
    expect(cellExtent(grid, 2)).toEqual([256, 256, 128]);
    // cell 1 is (1,0,0) on its level's grid
    expect(cellGridBox(grid, 0, 1)).toEqual({ min: [64, 0, 0], max: [128, 64, 32] });
  });
});

// --------------------------------------------------------------------------
describe("fabriksDecode arithmetic", () => {
  it("uses stride 6 for raw blobs and 8 for meshopt", () => {
    // The single most consequential number in the port: fabriks writes three
    // bare uint16 (6 B), and only pads to 8 under meshopt's stride rule.
    expect(positionStride("NONE")).toBe(6);
    expect(positionStride("MESHOPT")).toBe(8);
    expect(indexStride("UINT32")).toBe(4);
    expect(indexStride("UINT16")).toBe(2);
  });

  it("treats offsets as START offsets of length n, not n+1 fenceposts", () => {
    // fabriks writes [0, 17, 32] for three objects in a 48-vertex cell — the
    // last object's end is the total, not a further entry.
    const offsets = [0, 17, 32];
    expect(objectRange(offsets, 0, 48)).toEqual({ start: 0, end: 17 });
    expect(objectRange(offsets, 1, 48)).toEqual({ start: 17, end: 32 });
    expect(objectRange(offsets, 2, 48)).toEqual({ start: 32, end: 48 });
  });
});

// --------------------------------------------------------------------------
describe("world-space cell index", () => {
  const manifest = parseFabriksManifest(RAW_MANIFEST);
  const row = (over: Partial<FabriksCellRow>): FabriksCellRow => ({
    level: 2, cell: 0, vertexCount: 10, indexCount: 30,
    bboxMin: [0, 0, 0], bboxMax: [10, 10, 10],
    lodError: 2, objectCount: 1, childMask: 0,
    part: 0, rowGroup: 0, blobBytes: 100, ...over,
  });

  it("takes the max basis length, so anisotropy can only over-refine", () => {
    const matrix = new THREE.Matrix4().makeScale(1, 1, 5);
    expect(maxAxisScale(matrix)).toBe(5);
  });

  it("transforms boxes and scales lodError into world units", () => {
    const matrix = new THREE.Matrix4().makeScale(1, 1, 5);
    const index = buildFabriksCellIndex([row({})], manifest, matrix);
    expect(index.cells[0].worldMax).toEqual([10, 10, 50]);
    // A voxel error of 2 is worth 10 world units along the tall axis.
    expect(index.cells[0].worldLodError).toBe(10);
  });

  it("falls back to the coarsest level present when the declared root is empty", () => {
    const index = buildFabriksCellIndex([row({ level: 1, cell: 3 })], manifest, new THREE.Matrix4());
    expect(index.roots.map((entry) => entry.level)).toEqual([1]);
  });
});

// --------------------------------------------------------------------------
describe("fabriksPlanner", () => {
  const manifest = parseFabriksManifest(RAW_MANIFEST);
  const identity = new THREE.Matrix4();

  /** A two-level pyramid: one root with two children that carry geometry. */
  const rows: FabriksCellRow[] = [
    { level: 1, cell: 0, vertexCount: 40, indexCount: 120, bboxMin: [0, 0, 0], bboxMax: [128, 128, 64],
      lodError: 8, objectCount: 2, childMask: 0b0000_0011, part: 0, rowGroup: 0, blobBytes: 400 },
    { level: 0, cell: 0, vertexCount: 30, indexCount: 90, bboxMin: [0, 0, 0], bboxMax: [64, 64, 32],
      lodError: 0.1, objectCount: 1, childMask: 0, part: 0, rowGroup: 0, blobBytes: 300 },
    { level: 0, cell: 1, vertexCount: 30, indexCount: 90, bboxMin: [64, 0, 0], bboxMax: [128, 64, 32],
      lodError: 0.1, objectCount: 1, childMask: 0, part: 0, rowGroup: 1, blobBytes: 300 },
  ];
  const index = buildFabriksCellIndex(rows, manifest, identity);
  const base = {
    index, frustum: null, focalPixels: 540, pixelBudget: 1, maxCells: 64,
  } as const;

  it("keeps a far region coarse and refines a near one", () => {
    const far = planFabriksCells({ ...base, cameraPosition: [64, 64, 100_000] });
    expect(far.cells.map((c) => c.level)).toEqual([1]);

    const near = planFabriksCells({ ...base, cameraPosition: [64, 64, 100] });
    expect(near.cells.map((c) => c.level).sort()).toEqual([0, 0]);
  });

  it("returns Infinity for a camera inside the box, so it always refines", () => {
    const root = index.byKey.get("1:0")!;
    expect(screenError(root, [10, 10, 10], 540)).toBe(Number.POSITIVE_INFINITY);
  });

  it("degrades to a coarser cell rather than dropping geometry when out of budget", () => {
    const plan = planFabriksCells({ ...base, cameraPosition: [64, 64, 100], maxCells: 1 });
    // The region is still covered — just coarsely. A dropped cell would be a
    // hole in a surface, which reads as corruption rather than a lower setting.
    expect(plan.cells).toHaveLength(1);
    expect(plan.cells[0].level).toBe(1);
    expect(plan.coarsenedRegions).toBe(1);
  });

  it("keeps a coarse cell where the pyramid has no finer geometry", () => {
    const sparse = buildFabriksCellIndex([{ ...rows[0], childMask: 0 }], manifest, identity);
    const plan = planFabriksCells({ ...base, index: sparse, cameraPosition: [64, 64, 100] });
    expect(plan.cells.map((c) => c.key)).toEqual(["1:0"]);
  });

  it("culls against the exact geometry box, not the cell address box", () => {
    const away = new THREE.Frustum().setFromProjectionMatrix(
      new THREE.Matrix4().makeTranslation(1e6, 1e6, 1e6),
    );
    expect(planFabriksCells({ ...base, frustum: away, cameraPosition: [0, 0, 0] }).cells).toHaveLength(0);
  });

  it("holds a level inside the hysteresis band so a settled camera cannot flap", () => {
    // Camera placed so the root sits just inside the refine threshold.
    const root = index.byKey.get("1:0")!;
    const eye: [number, number, number] = [64, 64, 64 + root.worldLodError * 540];
    const wasDrawn = planFabriksCells({ ...base, cameraPosition: eye, previousKeys: new Set(["1:0"]) });
    expect(wasDrawn.cells.map((c) => c.key)).toEqual(["1:0"]);
  });

  it("coarsens rather than refines past the index budget", () => {
    // Refining the root swaps its 120 indices for the children's 180; a cap
    // between the two must keep the root — a complete covering, just coarse.
    const capped = planFabriksCells({ ...base, cameraPosition: [64, 64, 100], maxIndices: 150 });
    expect(capped.cells.map((c) => c.key)).toEqual(["1:0"]);
    expect(capped.coarsenedRegions).toBe(1);

    const roomy = planFabriksCells({ ...base, cameraPosition: [64, 64, 100], maxIndices: 180 });
    expect(roomy.cells.map((c) => c.level).sort()).toEqual([0, 0]);
    expect(roomy.coarsenedRegions).toBe(0);
  });

  it("groups planned cells by the row group that holds them", () => {
    const groups = groupByRowGroup([index.byKey.get("0:0")!, index.byKey.get("0:1")!]);
    expect(groups).toHaveLength(2);
    expect(groups.map((g) => g.rowGroup)).toEqual([0, 1]);

    const shared = groupByRowGroup([index.byKey.get("0:0")!, index.byKey.get("1:0")!]);
    expect(shared).toHaveLength(2); // different levels never share a row group
  });
});

// --------------------------------------------------------------------------
describe("FabriksCollection against fixtures written by fabriks itself", () => {
  for (const variant of ["raw", "zstd", "meshopt"] as const) {
    it(`opens, plans and decodes the ${variant} collection`, async () => {
      const collection = await FabriksCollection.open(fixtureTransport(variant));
      expect(collection.manifest.specVersion).toBeTruthy();

      const rows = await collection.loadCellCatalog();
      expect(rows.length).toBeGreaterThan(0);
      const index = buildFabriksCellIndex(rows, collection.manifest, new THREE.Matrix4());

      const plan = planFabriksCells({
        index, frustum: null, cameraPosition: [100, 100, 200],
        focalPixels: 540, pixelBudget: 1, maxCells: 512,
      });
      expect(plan.cells.length).toBeGreaterThan(0);

      // meshopt blobs need a decoder; the raw paths must not.
      const decoder =
        collection.manifest.encoding.codec === "MESHOPT"
          ? (await import("three/examples/jsm/libs/meshopt_decoder.module.js")).MeshoptDecoder
          : null;
      if (decoder) await (decoder as unknown as { ready: Promise<void> }).ready;

      // Decode the WHOLE plan, not one group: the locator only earns its
      // keep when several row groups are involved, and the fixtures are
      // written with a small row-group budget precisely to force that.
      const groups = groupByRowGroup(plan.cells);
      expect(groups.length).toBeGreaterThan(1);
      const decoded = new Map<string, Awaited<ReturnType<typeof collection.readFetchGroup>> extends Map<string, infer V> ? V : never>();
      for (const group of groups) {
        for (const [key, cell] of await collection.readFetchGroup(group, decoder)) decoded.set(key, cell);
      }
      // Every planned cell must come back — a missing one is a hole.
      expect(decoded.size).toBe(plan.cells.length);

      for (const [key, cell] of decoded) {
        const entry = index.byKey.get(key)!;
        expect(cell.positions).toHaveLength(entry.vertexCount * 3);
        expect(cell.indices).toHaveLength(entry.indexCount);
        expect(cell.objectOrdinals).toHaveLength(entry.vertexCount);
        // Every vertex must land inside the exact bounds the catalog declares,
        // give or take one quantization step of the cell's grid box.
        const step = cellGridBox(collection.manifest.grid, entry.level, entry.cell);
        const slack = (step.max[0] - step.min[0]) / 65535 + 1e-6;
        for (let v = 0; v < entry.vertexCount; v++) {
          for (const axis of [0, 1, 2] as const) {
            expect(cell.positions[v * 3 + axis]).toBeGreaterThanOrEqual(entry.bboxMin[axis] - slack);
            expect(cell.positions[v * 3 + axis]).toBeLessThanOrEqual(entry.bboxMax[axis] + slack);
          }
        }
        // Indices address the cell's concatenated vertex array.
        for (const i of cell.indices) expect(i).toBeLessThan(entry.vertexCount);
      }
    });
  }

  it("reads ONE ranged span per row group, not one per column chunk", async () => {
    let rangeReads = 0;
    const base = fixtureTransport("raw");
    const counting: FabriksTransport = {
      get: base.get,
      getRange: (path, start, end) => {
        rangeReads++;
        return base.getRange(path, start, end);
      },
    };
    const collection = await FabriksCollection.open(counting);
    const rows = await collection.loadCellCatalog();
    const index = buildFabriksCellIndex(rows, collection.manifest, new THREE.Matrix4());
    const plan = planFabriksCells({
      index, frustum: null, cameraPosition: [100, 100, 200],
      focalPixels: 540, pixelBudget: 1, maxCells: 512,
    });
    const groups = groupByRowGroup(plan.cells);

    // First read out of a part: the footer (one tail read for these small
    // fixtures) plus the group's span. Ten geometry columns would cost ten
    // reads if hyparquet's per-column slices hit the wire.
    rangeReads = 0;
    await collection.readFetchGroup(groups[0], null);
    expect(rangeReads).toBeLessThanOrEqual(3);

    // Second group of the SAME part: footer cached, so exactly the span.
    const sibling = groups.find(
      (g) => g.level === groups[0].level && g.part === groups[0].part && g.rowGroup !== groups[0].rowGroup,
    );
    expect(sibling).toBeDefined(); // the fixtures force multi-row-group parts
    rangeReads = 0;
    await collection.readFetchGroup(sibling!, null);
    expect(rangeReads).toBe(1);
  });

  it("reads the object catalog's list<struct<>> inverted index", async () => {
    const collection = await FabriksCollection.open(fixtureTransport("raw"));
    const objects = await collection.loadObjectCatalog();
    // The fixture's sparse instance ids, written through unchanged.
    expect([...objects.keys()].sort((a, b) => a - b)).toEqual([3, 7, 11, 42, 108, 4711]);

    const ordinals = [...objects.values()].map((o) => o.ordinal).sort((a, b) => a - b);
    expect(ordinals).toEqual([0, 1, 2, 3, 4, 5]); // dense, 0-based — the LUT index

    const one = objects.get(4711)!;
    expect(one.cells.length).toBeGreaterThan(0);
    for (const ref of one.cells) {
      expect(Number.isInteger(ref.level)).toBe(true);
      expect(Number.isInteger(ref.cell)).toBe(true);
    }
  });

  it("reports a prefix with no manifest as an interrupted write", async () => {
    const empty: FabriksTransport = {
      get: async () => { throw new Error("404"); },
      getRange: async () => new Uint8Array(),
    };
    await expect(FabriksCollection.open(empty)).rejects.toThrow(/interrupted write/);
  });
});

// --------------------------------------------------------------------------
describe("FabriksCollectionManager against the raw fixture", () => {
  const VIEW = {
    frustum: null,
    cameraPosition: [100, 100, 200] as [number, number, number],
    focalPixels: 540,
  };

  const openManager = async () => {
    const collection = await FabriksCollection.open(fixtureTransport("raw"));
    const manager = new FabriksCollectionManager({
      collection,
      loadDecoder: async () => null, // the raw fixture's codec is NONE
      onInvalidate: () => {},
    });
    await manager.ensureIndex();
    return manager;
  };

  /** The drain is fire-and-forget; poll until it reports itself complete. */
  const drained = async (manager: FabriksCollectionManager) => {
    for (let i = 0; i < 200; i++) {
      if (manager.buildDebugReport().stats.completeMs > 0) return;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error("drain did not complete");
  };

  it("plans, streams and mounts every planned cell, with the stats to prove it", async () => {
    const manager = await openManager();
    manager.updatePlan(VIEW);
    await drained(manager);

    const report = manager.buildDebugReport();
    expect(report.lastPlan).not.toBeNull();
    expect(report.mountedCells).toBe(report.lastPlan!.cellCount);
    expect(report.stats.plans).toBe(1);
    expect(report.stats.decodedCells).toBe(report.lastPlan!.cellCount);
    expect(report.stats.streamMs).toBeGreaterThan(0);
    expect(report.stats.buildMs).toBeGreaterThan(0);
    expect(report.cache.cells).toBe(report.lastPlan!.cellCount);
    expect(report.cache.bytes).toBeGreaterThan(0);
    expect(report.catalog!.cells).toBeGreaterThan(0);
    // Batched by default: the whole plan is ONE render object, and it is
    // visible only now that it holds geometry.
    expect(report.batch!.instances).toBe(report.lastPlan!.cellCount);
    const batches = manager.group.children.filter(
      (c): c is THREE.BatchedMesh => c instanceof THREE.BatchedMesh,
    );
    expect(batches).toHaveLength(1);
    expect(batches[0].visible).toBe(true);
    manager.dispose();
  });

  it("colors by instance by default; an explicit materialColor opts into uniform", async () => {
    const manager = await openManager();
    expect(manager.getAppliedColormap()).toBe("hues");

    manager.setMaterialConfig({ color: [255, 0, 0], wireframe: false, opacity: 1 });
    expect(manager.getAppliedColormap()).toBeNull();

    manager.setMaterialConfig({
      color: null,
      wireframe: true,
      opacity: 1,
      instanceColormap: "vivid",
    });
    expect(manager.getAppliedColormap()).toBe("vivid");
    manager.dispose();
  });

  it("the batching toggle remounts from cache in either direction, refetching nothing", async () => {
    const manager = await openManager();
    manager.updatePlan(VIEW);
    await drained(manager);
    const decoded = manager.buildDebugReport().stats.decodedCells;
    const cellCount = manager.buildDebugReport().lastPlan!.cellCount;

    manager.setBatching(false);
    const meshes = manager.group.children.filter(
      (c): c is THREE.Mesh => c instanceof THREE.Mesh && !(c instanceof THREE.BatchedMesh),
    );
    expect(meshes).toHaveLength(cellCount);
    expect(manager.buildDebugReport().mountedCells).toBe(cellCount);
    expect(manager.buildDebugReport().batch).toBeNull();

    manager.setBatching(true);
    const report = manager.buildDebugReport();
    expect(report.batch!.instances).toBe(cellCount);
    expect(report.stats.decodedCells).toBe(decoded); // nothing refetched
    manager.dispose();
  });

  it("freeze ignores settles and a thaw replays the newest one", async () => {
    const manager = await openManager();
    manager.updatePlan(VIEW);
    await drained(manager);
    expect(manager.buildDebugReport().stats.plans).toBe(1);

    manager.setPlanConfig({ frozen: true });
    manager.updatePlan({ ...VIEW, focalPixels: 5400 });
    expect(manager.buildDebugReport().stats.plans).toBe(1); // ignored

    manager.setPlanConfig({ frozen: false }); // replays the recorded settle
    expect(manager.buildDebugReport().stats.plans).toBe(2);
    manager.dispose();
  });

  it("a pixel-budget change replans immediately against the last settle", async () => {
    const manager = await openManager();
    manager.updatePlan(VIEW);
    await drained(manager);
    const fine = manager.buildDebugReport().lastPlan!;

    // A huge budget must coarsen the plan without waiting for a camera move.
    manager.setPlanConfig({ pixelBudget: 1000 });
    const coarse = manager.buildDebugReport().lastPlan!;
    expect(manager.buildDebugReport().stats.plans).toBe(2);
    expect(coarse.cellCount).toBeLessThan(fine.cellCount);
    manager.dispose();
  });

  it("retries a transiently-failed row group once, so a 403 blip leaves no hole", async () => {
    // Every geometry part's FIRST ranged read fails (the expired-grant 403
    // shape); the drain's retry round must still mount the full plan.
    const base = fixtureTransport("raw");
    const failedOnce = new Set<string>();
    const flaky: FabriksTransport = {
      get: base.get,
      getRange: (path, start, end) => {
        if (path.startsWith("level=") && !failedOnce.has(path)) {
          failedOnce.add(path);
          return Promise.reject(new Error("read failed: 403"));
        }
        return base.getRange(path, start, end);
      },
    };
    const collection = await FabriksCollection.open(flaky);
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const manager = new FabriksCollectionManager({
        collection,
        loadDecoder: async () => null,
        onInvalidate: () => {},
      });
      await manager.ensureIndex();
      manager.updatePlan(VIEW);
      await drained(manager);

      const report = manager.buildDebugReport();
      expect(report.stats.fetchErrors).toBeGreaterThan(0); // failures happened…
      expect(report.mountedCells).toBe(report.lastPlan!.cellCount); // …and healed
      manager.dispose();
    } finally {
      errors.mockRestore();
    }
  });

  it("a placement change rebuilds the index and replans but never drops the caches", async () => {
    const manager = await openManager();
    manager.updatePlan(VIEW);
    await drained(manager);
    const before = manager.buildDebugReport();
    expect(before.stats.indexRebuilds).toBe(0);

    // Value-equal placement: a complete no-op, however many times it arrives.
    manager.setVoxelToWorld(new THREE.Matrix4());
    expect(manager.buildDebugReport().stats.indexRebuilds).toBe(0);
    expect(manager.buildDebugReport().stats.plans).toBe(before.stats.plans);

    // A real placement change: index rebuilt, plan re-run — and every cached
    // cell survives, because geometry is in voxel space.
    manager.setVoxelToWorld(new THREE.Matrix4().makeScale(1, 1, 5));
    const after = manager.buildDebugReport();
    expect(after.stats.indexRebuilds).toBe(1);
    expect(after.stats.plans).toBe(before.stats.plans + 1);
    expect(after.cache.cells).toBeGreaterThanOrEqual(before.cache.cells);
    expect(manager.group.matrix.elements[10]).toBe(5);
    manager.dispose();
  });

  it("flat normals by default; the smooth toggle retrofits and rebuilds the batch layout", async () => {
    const manager = await openManager();
    manager.updatePlan(VIEW);
    await drained(manager);

    // No normals computed or uploaded — the material shades by derivatives,
    // and the batch's fixed attribute layout carries none.
    const batch = () =>
      manager.group.children.find((c): c is THREE.BatchedMesh => c instanceof THREE.BatchedMesh)!;
    expect(batch().geometry.getAttribute("normal")).toBeUndefined();
    expect(manager.buildDebugReport().stats.normalsMs).toBe(0);

    // Smooth: cached geometries gain normals and the batch rebuilds under the
    // widened layout (a fixed-layout batch cannot absorb a new attribute).
    manager.setFlatNormals(false);
    expect(batch().geometry.getAttribute("normal")).toBeDefined();
    expect(manager.buildDebugReport().stats.normalsMs).toBeGreaterThan(0);

    // Back to flat: normals are DELETED from the cache so future decodes
    // (which carry none) still match the batch layout.
    manager.setFlatNormals(true);
    expect(batch().geometry.getAttribute("normal")).toBeUndefined();
    manager.dispose();
  });

  it("the unbatched path shares cache-owned geometry with analytic bounds", async () => {
    const manager = await openManager();
    manager.setBatching(false);
    manager.updatePlan(VIEW);
    await drained(manager);

    const meshes = manager.group.children.filter(
      (c): c is THREE.Mesh => c instanceof THREE.Mesh && !(c instanceof THREE.BatchedMesh),
    );
    expect(meshes.length).toBeGreaterThan(0);
    for (const mesh of meshes) {
      expect(mesh.geometry.getAttribute("normal")).toBeUndefined();
      // Bounds come from the catalog, not a walk over the positions.
      expect(mesh.geometry.boundingBox).not.toBeNull();
      expect(mesh.geometry.boundingSphere!.radius).toBeGreaterThan(0);
    }
    manager.dispose();
  });

  it("the cell-box overlay is one LineSegments that survives reconciliation", async () => {
    const manager = await openManager();
    manager.updatePlan(VIEW);
    await drained(manager);

    manager.setShowCellBoxes(true);
    const overlays = () =>
      manager.group.children.filter((child) => child.name === "__fabriks-cell-boxes__");
    expect(overlays()).toHaveLength(1);
    expect(overlays()[0]).toBeInstanceOf(THREE.LineSegments);

    // A replan reconciles cells but must never sweep the overlay away, and
    // the report's mountedCells must not count it.
    manager.updatePlan({ ...VIEW, focalPixels: 100 });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(overlays()).toHaveLength(1);
    const report = manager.buildDebugReport();
    expect(report.mountedCells).toBe(report.batch!.instances);

    manager.setShowCellBoxes(false);
    expect(overlays()).toHaveLength(0);
    manager.dispose();
  });
});

// --------------------------------------------------------------------------
describe("fabriks material coloring", () => {
  it("colors by instance by default and builds every colormap", () => {
    const material = createFabriksMaterial();
    expect(material.colorNode).not.toBeNull(); // instance-colored by default
    expect(material.flatShading).toBe(true); // derivative normals
    for (const name of INSTANCE_COLORMAPS) {
      setInstanceColoring(material, name);
      expect(material.colorNode).not.toBeNull();
    }
    setInstanceColoring(material, null); // uniform: back to material.color
    expect(material.colorNode).toBeNull();
    material.dispose();
  });
});

// --------------------------------------------------------------------------
describe("FabriksBatchRenderer", () => {
  it("stays off the render list while empty", () => {
    // A BatchedMesh initializes its attributes on the first addGeometry, so
    // an empty one has no `position` — rendering it makes the WebGPU node
    // builder warn and compile a junk pipeline every frame.
    const material = new THREE.MeshStandardMaterial();
    let mesh: THREE.BatchedMesh | null = null;
    const batch = new FabriksBatchRenderer(material, (next) => {
      mesh = next;
    });
    batch.ensureCapacity(8, 1024, 1024); // plan-time sizing, nothing mounted
    expect(mesh!.visible).toBe(false);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(9), 3));
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array([0, 1, 2]), 1));
    geometry.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3(1, 1, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1);
    batch.mount("a", geometry);
    expect(mesh!.visible).toBe(true);

    batch.unmount("a");
    expect(mesh!.visible).toBe(false);
    batch.dispose();
    material.dispose();
  });
});

// --------------------------------------------------------------------------
describe("LruByteCache", () => {
  it("evicts least-recently-used unprotected entries over budget", () => {
    const evicted: string[] = [];
    const cache = new LruByteCache<string>(100, (key) => evicted.push(key));
    cache.set("a", "a", 60);
    cache.set("b", "b", 60);
    expect(evicted).toEqual(["a"]);
  });

  it("never evicts protected keys", () => {
    const evicted: string[] = [];
    const cache = new LruByteCache<string>(100, (key) => evicted.push(key));
    cache.set("a", "a", 60);
    cache.protect(["a"]);
    cache.set("b", "b", 60);
    expect(evicted).toEqual([]);
  });
});
