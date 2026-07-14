import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { decodeMorton3, encodeMorton3, meshCellKey } from "./mortonCell";
import { cellVoxelBox, parseMeshEncoding, parseMeshGrid } from "./meshSpec";
import {
  buildMeshCellIndex,
  desiredMeshLevel,
  mortonChildren,
  mortonParent,
  planMeshCells,
  type MeshCellRecord,
} from "./meshPlanner";
import { decodeGeometryRow } from "./meshDecode";
import { LruByteCache } from "./lruByteCache";

const GRID = parseMeshGrid({ cellSize: [64, 64, 64], levels: 5, sortKey: "MORTON" })!;

describe("morton cells", () => {
  it("round-trips coordinates", () => {
    for (const coords of [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [5, 3, 7],
      [123, 456, 789],
      [70000, 1, 99999],
    ] as const) {
      expect(decodeMorton3(encodeMorton3(...coords))).toEqual([...coords]);
    }
  });

  it("interleaves with x least significant", () => {
    expect(encodeMorton3(1, 0, 0)).toBe(1);
    expect(encodeMorton3(0, 1, 0)).toBe(2);
    expect(encodeMorton3(0, 0, 1)).toBe(4);
    expect(encodeMorton3(1, 1, 1)).toBe(7);
  });

  it("keys are level-qualified", () => {
    expect(meshCellKey(2, 5)).toBe("2:5");
  });
});

describe("meshSpec", () => {
  it("parses the reference grid and rejects garbage", () => {
    expect(GRID).toEqual({ cellSize: [64, 64, 64], levels: 5, sortKey: "MORTON" });
    expect(parseMeshGrid(null)).toBeNull();
    expect(parseMeshGrid({ cellSize: [64, 64] })).toBeNull();
    expect(parseMeshGrid({ cellSize: [64, 64, 64], sortKey: "HILBERT" })).toBeNull();
  });

  it("defaults encoding tolerantly", () => {
    expect(parseMeshEncoding(null).positions).toBe("UINT16_QUANTIZED_PER_CELL");
    expect(parseMeshEncoding({ codec: "MESHOPT" }).codec).toBe("MESHOPT");
  });

  it("cell boxes scale by level (level-L cell spans cellSize·2^L)", () => {
    expect(cellVoxelBox(GRID, 0, encodeMorton3(1, 2, 3))).toEqual({
      min: [64, 128, 192],
      max: [128, 192, 256],
    });
    expect(cellVoxelBox(GRID, 2, encodeMorton3(1, 0, 0))).toEqual({
      min: [256, 0, 0],
      max: [512, 256, 256],
    });
  });
});

describe("meshPlanner", () => {
  const cell = (level: number, x: number, y: number, z: number): MeshCellRecord => ({
    level,
    cell: encodeMorton3(x, y, z),
    vertexCount: 100,
    indexCount: 300,
  });

  const planWith = (
    cells: MeshCellRecord[],
    overrides: Partial<Parameters<typeof planMeshCells>[0]> = {},
  ) =>
    planMeshCells({
      index: buildMeshCellIndex(cells, GRID),
      grid: GRID,
      voxelFrustum: null,
      cameraVoxelPos: [0, 0, 0],
      pxPerVoxelAtUnitDistance: 10_000, // effectively zoomed in → level 0
      lodBias: 1,
      maxIndices: 1e9,
      maxCells: 1000,
      ...overrides,
    });

  it("chooses finer levels as voxels grow on screen", () => {
    expect(desiredMeshLevel(2, 1, 5)).toBe(0); // voxels > 1 px → finest
    expect(desiredMeshLevel(1 / 5, 1, 5)).toBe(2); // level-2 voxels ≈ visible
    expect(desiredMeshLevel(1 / 1000, 1, 5)).toBe(4); // clamped to coarsest
  });

  it("morton parent/child arithmetic round-trips", () => {
    const code = encodeMorton3(3, 5, 7);
    for (const child of mortonChildren(code)) {
      expect(mortonParent(child)).toBe(code);
    }
    expect(mortonChildren(code)).toContain(encodeMorton3(6, 10, 14));
    expect(mortonChildren(code)).toContain(encodeMorton3(7, 11, 15));
  });

  it("descends near roots to fine cells while keeping far roots coarse (mixed levels)", () => {
    // Two level-1 roots: one at the camera, one ~2000 voxels away. The near
    // root has level-0 children; the far one too. pxPerVoxelAtUnitDistance
    // chosen so at distance ~1 the desire is level 0 and at ~2000 it is
    // coarser than level 1.
    const nearRoot = cell(1, 0, 0, 0);
    const nearChildren = [cell(0, 0, 0, 0), cell(0, 1, 0, 0)];
    const farRoot = cell(1, 16, 0, 0); // level-1 cell x∈[2048, 2176)
    const farChildren = [cell(0, 32, 0, 0)];
    const plan = planWith([nearRoot, ...nearChildren, farRoot, ...farChildren], {
      pxPerVoxelAtUnitDistance: 40, // dist 1 → px 40 (level 0); dist 2048 → px 0.02 (coarse)
    });
    const levelsByCell = new Map(plan.cells.map((c) => [c.key, c.level]));
    expect(levelsByCell.get("0:" + encodeMorton3(0, 0, 0))).toBe(0);
    expect(levelsByCell.get("0:" + encodeMorton3(1, 0, 0))).toBe(0);
    expect(levelsByCell.get("1:" + encodeMorton3(16, 0, 0))).toBe(1); // far stays coarse
    // The near ROOT is replaced by its children, not double-rendered.
    expect(levelsByCell.has("1:" + encodeMorton3(0, 0, 0))).toBe(false);
  });

  it("keeps a coarse cell where no finer geometry exists (sparse pyramid)", () => {
    // Root with NO level-0 rows under it: stays covered by itself even when
    // the footprint asks for level 0.
    const plan = planWith([cell(1, 0, 0, 0)]);
    expect(plan.cells.map((c) => c.key)).toEqual(["1:" + encodeMorton3(0, 0, 0)]);
  });

  it("orders near-first and degrades distant cells under the budget", () => {
    const cells = [cell(0, 0, 0, 0), cell(0, 4, 0, 0), cell(0, 8, 0, 0)];
    const plan = planWith(cells, { maxIndices: 600 }); // room for two cells
    expect(plan.cells.map((c) => c.cell)).toEqual([
      encodeMorton3(0, 0, 0),
      encodeMorton3(4, 0, 0),
    ]);
    expect(plan.droppedCells).toBe(1);
  });

  it("holds the previous level inside the hysteresis band", () => {
    const root = cell(1, 0, 0, 0);
    const children = [cell(0, 0, 0, 0)];
    // Footprint right at the level-0/1 boundary: desiredMeshLevel flips at
    // pxPerVoxel·2^1 = 1... place px so the raw desire is level 0 but only
    // by less than the 15% margin.
    const atBoundary = 0.52; // raw: floor(log2(1/0.52)) = 0 (fine, barely)
    const held = planMeshCells({
      index: buildMeshCellIndex([root, ...children], GRID),
      grid: GRID,
      voxelFrustum: null,
      cameraVoxelPos: [0, 0, 0],
      pxPerVoxelAtUnitDistance: atBoundary,
      lodBias: 1,
      maxIndices: 1e9,
      maxCells: 1000,
      previousRootLevels: new Map([["1:" + root.cell, 1]]),
    });
    // With margin (bias/1.15 → effective px 0.452) the desire falls back to
    // level 1 → sticks to the previous level.
    expect(held.cells.map((c) => c.level)).toEqual([1]);
    // Without a previous level, the same footprint goes fine.
    const fresh = planWith([root, ...children], {
      pxPerVoxelAtUnitDistance: atBoundary,
    });
    expect(fresh.cells.map((c) => c.level)).toEqual([0]);
    // Well past the margin, the switch happens despite the previous level.
    const decisive = planMeshCells({
      index: buildMeshCellIndex([root, ...children], GRID),
      grid: GRID,
      voxelFrustum: null,
      cameraVoxelPos: [0, 0, 0],
      pxPerVoxelAtUnitDistance: 2,
      lodBias: 1,
      maxIndices: 1e9,
      maxCells: 1000,
      previousRootLevels: new Map([["1:" + root.cell, 1]]),
    });
    expect(decisive.cells.map((c) => c.level)).toEqual([0]);
  });

  it("frustum-culls roots and descended cells in voxel space", () => {
    // Camera at z=-10 looking down +z with a narrow frustum around origin.
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10_000);
    camera.position.set(32, 32, -10);
    camera.lookAt(32, 32, 0);
    camera.updateMatrixWorld();
    const frustum = new THREE.Frustum().setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse,
      ),
    );
    const plan = planWith([cell(0, 0, 0, 0), cell(0, 200, 200, 0)], {
      voxelFrustum: frustum,
      cameraVoxelPos: [32, 32, -10],
    });
    expect(plan.cells.map((c) => c.cell)).toEqual([encodeMorton3(0, 0, 0)]);
  });
});

describe("meshDecode (raw codec)", () => {
  const ENCODING = parseMeshEncoding({
    positions: "UINT16_QUANTIZED_PER_CELL",
    normals: "OCT16",
    indices: "UINT16",
    codec: "NONE",
  });
  const BOX = { min: [64, 0, 0] as [number, number, number], max: [128, 64, 64] as [number, number, number] };

  it("dequantizes uint16 positions over the cell box", () => {
    // Two vertices: cell-min corner and cell-max corner (stride 8: x,y,z,pad).
    const positions = new Uint8Array(new Uint16Array([0, 0, 0, 0, 65535, 65535, 65535, 0]).buffer);
    const indices = new Uint8Array(new Uint16Array([0, 1, 0]).buffer);
    const decoded = decodeGeometryRow(
      { positions, normals: null, indices, vertexCount: 2, indexCount: 3 },
      ENCODING,
      BOX,
      null,
    );
    expect([...decoded.positions.slice(0, 3)]).toEqual([64, 0, 0]);
    expect([...decoded.positions.slice(3, 6)]).toEqual([128, 64, 64]);
    expect(decoded.normals).toBeNull();
    expect(decoded.indices).toBeInstanceOf(Uint16Array);
    expect([...decoded.indices]).toEqual([0, 1, 0]);
  });

  it("decodes octahedral normals to unit vectors", () => {
    const positions = new Uint8Array(new Uint16Array([0, 0, 0, 0]).buffer);
    // oct (0, 0) = +z; oct (32767, 0) = +x.
    const normals = new Uint8Array(new Int16Array([0, 0]).buffer);
    const indices = new Uint8Array(new Uint16Array([0, 0, 0]).buffer);
    const decoded = decodeGeometryRow(
      { positions, normals, indices, vertexCount: 1, indexCount: 3 },
      ENCODING,
      BOX,
      null,
    );
    expect(decoded.normals).not.toBeNull();
    expect([...decoded.normals!]).toEqual([0, 0, 1]);
  });

  it("rejects malformed rows instead of rendering garbage", () => {
    const positions = new Uint8Array(4); // too short for one stride-8 vertex
    const indices = new Uint8Array(new Uint16Array([0, 1]).buffer);
    expect(() =>
      decodeGeometryRow(
        { positions, normals: null, indices, vertexCount: 1, indexCount: 2 },
        ENCODING,
        BOX,
        null,
      ),
    ).toThrow(/triangle list/);
    expect(() =>
      decodeGeometryRow(
        { positions, normals: null, indices, vertexCount: 1, indexCount: 3 },
        ENCODING,
        BOX,
        null,
      ),
    ).toThrow(/too short/);
  });

  it("requires a decoder for MESHOPT streams", () => {
    const encoding = parseMeshEncoding({ codec: "MESHOPT" });
    expect(() =>
      decodeGeometryRow(
        {
          positions: new Uint8Array(8),
          normals: null,
          indices: new Uint8Array(6),
          vertexCount: 1,
          indexCount: 3,
        },
        encoding,
        BOX,
        null,
      ),
    ).toThrow(/MeshoptDecoder/);
  });
});

describe("LruByteCache", () => {
  it("evicts least-recently-used unprotected entries over budget", () => {
    const evicted: string[] = [];
    const cache = new LruByteCache<string>(10, (key) => evicted.push(key));
    cache.set("a", "A", 4);
    cache.set("b", "B", 4);
    cache.get("a"); // a is now more recent than b
    cache.set("c", "C", 4); // over budget → evict b
    expect(evicted).toEqual(["b"]);
    expect(cache.has("a")).toBe(true);
    expect(cache.has("c")).toBe(true);
  });

  it("never evicts protected keys", () => {
    const evicted: string[] = [];
    const cache = new LruByteCache<string>(8, (key) => evicted.push(key));
    cache.set("a", "A", 4);
    cache.protect(["a"]);
    cache.set("b", "B", 4);
    cache.set("c", "C", 4); // over budget; a is protected → evict b
    expect(evicted).toEqual(["b"]);
    expect(cache.has("a")).toBe(true);
  });

  it("clear disposes everything", () => {
    const evicted: string[] = [];
    const cache = new LruByteCache<string>(100, (key) => evicted.push(key));
    cache.set("a", "A", 1);
    cache.set("b", "B", 1);
    cache.clear();
    expect(evicted.sort()).toEqual(["a", "b"]);
    expect(cache.size).toBe(0);
    expect(cache.bytes).toBe(0);
  });
});
