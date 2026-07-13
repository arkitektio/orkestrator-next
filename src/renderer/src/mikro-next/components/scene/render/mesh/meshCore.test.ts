import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { decodeMorton3, encodeMorton3, meshCellKey } from "./mortonCell";
import { cellVoxelBox, parseMeshEncoding, parseMeshGrid } from "./meshSpec";
import { desiredMeshLevel, planMeshCells, type MeshCellRecord } from "./meshPlanner";
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

  it("chooses finer levels as voxels grow on screen", () => {
    expect(desiredMeshLevel(2, 1, 5)).toBe(0); // voxels > 1 px → finest
    expect(desiredMeshLevel(1 / 5, 1, 5)).toBe(2); // level-2 voxels ≈ visible
    expect(desiredMeshLevel(1 / 1000, 1, 5)).toBe(4); // clamped to coarsest
  });

  it("plans only the chosen level, near-first, within budget", () => {
    const cells = [
      cell(0, 0, 0, 0),
      cell(0, 4, 0, 0),
      cell(0, 8, 0, 0),
      cell(2, 0, 0, 0),
    ];
    const plan = planMeshCells({
      cells,
      grid: GRID,
      voxelFrustum: null,
      cameraVoxelPos: [0, 0, 0],
      pxPerVoxelAtUnitDistance: 10_000, // effectively zoomed in → level 0
      lodBias: 1,
      maxIndices: 600, // room for two cells
      maxCells: 10,
    });
    expect(plan.level).toBe(0);
    expect(plan.cells.map((c) => c.cell)).toEqual([
      encodeMorton3(0, 0, 0),
      encodeMorton3(4, 0, 0),
    ]);
    expect(plan.droppedCells).toBe(1);
  });

  it("falls back to the nearest available level", () => {
    const cells = [cell(3, 0, 0, 0)];
    const plan = planMeshCells({
      cells,
      grid: GRID,
      voxelFrustum: null,
      cameraVoxelPos: [0, 0, 0],
      pxPerVoxelAtUnitDistance: 10_000,
      lodBias: 1,
      maxIndices: 1e9,
      maxCells: 10,
    });
    expect(plan.level).toBe(3);
    expect(plan.cells).toHaveLength(1);
  });

  it("frustum-culls in voxel space", () => {
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
    const cells = [cell(0, 0, 0, 0), cell(0, 200, 200, 0)];
    const plan = planMeshCells({
      cells,
      grid: GRID,
      voxelFrustum: frustum,
      cameraVoxelPos: [32, 32, -10],
      pxPerVoxelAtUnitDistance: 10_000,
      lodBias: 1,
      maxIndices: 1e9,
      maxCells: 10,
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
