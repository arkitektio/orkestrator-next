import { describe, expect, it, vi } from "vitest";
import type { PageTableLayout } from "../../core/octree/pageTableLayout";
import {
  PAGE_FLAG_RESIDENT,
} from "../../core/octree/pageTableLayout";
import type { SceneRenderer } from "../gpu/sceneRenderer";
import {
  clearPageTable,
  createPageTableTexture,
  flushPageTable,
  setPageEntry,
} from "./pageTableTexture";

/** One level: 4×4×2 brick grid stacked at texel offset [16, 0, 0]. */
const LAYOUT: PageTableLayout = {
  size: [20, 4, 2],
  stackAxis: 0,
  levelOffset: [[16, 0, 0]],
  levelGrid: [[4, 4, 2]],
};

/** Fake renderer whose backend captures every queue.writeTexture call. */
const makeRenderer = () => {
  const writeTexture = vi.fn();
  const renderer = {
    backend: {
      isWebGPUBackend: true,
      device: { queue: { writeTexture } },
      // Pretend the GPUTexture exists so the incremental path is taken.
      get: () => ({ texture: {} }),
    },
  } as unknown as SceneRenderer;
  return { renderer, writeTexture };
};

describe("flushPageTable dirty-box uploads", () => {
  it("uploads only the bounding box of the touched entries, strided from the mirror", () => {
    const { renderer, writeTexture } = makeRenderer();
    const pageTable = createPageTableTexture(LAYOUT);

    setPageEntry(pageTable, 0, [1, 1, 0], [0, 0, 0], PAGE_FLAG_RESIDENT);
    setPageEntry(pageTable, 0, [2, 3, 1], [1, 0, 0], PAGE_FLAG_RESIDENT);

    expect(flushPageTable(renderer, pageTable)).toBe(true);
    expect(writeTexture).toHaveBeenCalledTimes(1);

    const [destination, data, layout, extent] = writeTexture.mock.calls[0];
    // Box spans bricks [1..2, 1..3, 0..1]; texture origin adds the level offset.
    expect(destination.origin).toEqual([16 + 1, 1, 0]);
    expect(extent).toEqual([2, 3, 2]);
    // Source reads strided out of the 4×4×2 level mirror at box.min.
    expect(data).toBe(pageTable.mirrors[0]);
    expect(layout).toEqual({
      offset: ((0 * 4 + 1) * 4 + 1) * 4,
      bytesPerRow: 4 * 4,
      rowsPerImage: 4,
    });
  });

  it("is a no-op when nothing is dirty, and re-flushes only new writes", () => {
    const { renderer, writeTexture } = makeRenderer();
    const pageTable = createPageTableTexture(LAYOUT);

    setPageEntry(pageTable, 0, [0, 0, 0], [0, 0, 0], PAGE_FLAG_RESIDENT);
    expect(flushPageTable(renderer, pageTable)).toBe(true);
    expect(flushPageTable(renderer, pageTable)).toBe(false);
    expect(writeTexture).toHaveBeenCalledTimes(1);

    // A single new entry dirties only its own 1×1×1 box.
    setPageEntry(pageTable, 0, [3, 2, 1], [0, 1, 0], PAGE_FLAG_RESIDENT);
    expect(flushPageTable(renderer, pageTable)).toBe(true);
    const [destination, , , extent] = writeTexture.mock.calls[1];
    expect(destination.origin).toEqual([16 + 3, 2, 1]);
    expect(extent).toEqual([1, 1, 1]);
  });

  it("clearPageTable dirties the full level grid", () => {
    const { renderer, writeTexture } = makeRenderer();
    const pageTable = createPageTableTexture(LAYOUT);

    clearPageTable(pageTable);
    expect(flushPageTable(renderer, pageTable)).toBe(true);
    const [destination, , layout, extent] = writeTexture.mock.calls[0];
    expect(destination.origin).toEqual([16, 0, 0]);
    expect(extent).toEqual([4, 4, 2]);
    expect(layout.offset).toBe(0);
  });
});
