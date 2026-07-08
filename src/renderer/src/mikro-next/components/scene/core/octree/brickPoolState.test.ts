import { describe, expect, it } from "vitest";
import { BrickPoolState } from "./brickPoolState";

const NONE = { has: () => false };
const protecting = (...keys: string[]) => new Set(keys);

describe("BrickPoolState", () => {
  it("hands out distinct slots up to capacity", () => {
    const pool = new BrickPoolState([2, 2, 1]);
    expect(pool.capacity).toBe(4);
    const slots = ["a", "b", "c", "d"].map((k) => pool.acquire(k, NONE)!.slot.index);
    expect(new Set(slots).size).toBe(4);
    expect(pool.size).toBe(4);
  });

  it("maps slot indices to x-fastest atlas coords", () => {
    const pool = new BrickPoolState([2, 2, 2]);
    expect(pool.slotCoords(0)).toEqual([0, 0, 0]);
    expect(pool.slotCoords(1)).toEqual([1, 0, 0]);
    expect(pool.slotCoords(2)).toEqual([0, 1, 0]);
    expect(pool.slotCoords(4)).toEqual([0, 0, 1]);
  });

  it("evicts the least-recently-used unprotected key when full", () => {
    const pool = new BrickPoolState([2, 1, 1]);
    pool.acquire("old", NONE);
    pool.acquire("new", NONE);
    const result = pool.acquire("incoming", protecting("new"))!;
    expect(result.evictedKey).toBe("old");
    expect(pool.has("old")).toBe(false);
    expect(pool.slotOf("incoming")!.index).toBe(pool.slotOf("incoming")!.index);
  });

  it("touch refreshes recency so scanning starts elsewhere", () => {
    const pool = new BrickPoolState([2, 1, 1]);
    pool.acquire("a", NONE);
    pool.acquire("b", NONE);
    pool.touch(["a"]);
    expect(pool.acquire("c", NONE)!.evictedKey).toBe("b");
  });

  it("re-acquiring a resident key keeps its slot and refreshes recency", () => {
    const pool = new BrickPoolState([2, 1, 1]);
    const first = pool.acquire("a", NONE)!.slot.index;
    pool.acquire("b", NONE);
    const again = pool.acquire("a", NONE)!;
    expect(again.slot.index).toBe(first);
    expect(again.evictedKey).toBeNull();
    expect(pool.acquire("c", NONE)!.evictedKey).toBe("b");
  });

  it("returns null when every occupant is protected", () => {
    const pool = new BrickPoolState([1, 1, 1]);
    pool.acquire("pinned", NONE);
    expect(pool.acquire("x", protecting("pinned"))).toBeNull();
    expect(pool.has("pinned")).toBe(true);
  });

  it("release returns the slot to the free list", () => {
    const pool = new BrickPoolState([1, 1, 1]);
    const slot = pool.acquire("a", NONE)!.slot.index;
    pool.release("a");
    expect(pool.size).toBe(0);
    expect(pool.acquire("b", NONE)!.slot.index).toBe(slot);
  });

  it("clear resets occupancy and capacity", () => {
    const pool = new BrickPoolState([2, 1, 1]);
    pool.acquire("a", NONE);
    pool.acquire("b", NONE);
    pool.clear();
    expect(pool.size).toBe(0);
    expect(pool.acquire("c", NONE)).not.toBeNull();
    expect(pool.acquire("d", NONE)).not.toBeNull();
  });
});
