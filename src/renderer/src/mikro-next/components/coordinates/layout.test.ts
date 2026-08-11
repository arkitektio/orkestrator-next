import ELK from "elkjs/lib/elk.bundled.js";
import { describe, expect, it } from "vitest";
import { LAYOUT_OPTIONS } from "./layout";
import { NODE_DIAMETER, NODE_SIZE } from "./nodeSize";

/**
 * A stress layout does not consider node sizes. Nothing stops it placing two
 * nodes on top of each other except a rest length larger than a node — which is
 * a relationship between two constants in two different files, and exactly the
 * kind of thing that rots silently. So this runs the REAL ELK with the REAL
 * options and checks no two circles touch.
 */

// A dataset's grid with four residents, a calibration, a stage frame two tiles
// register into, a world above it, and an island connected to nothing.
const SYSTEMS = ["grid", "physical", "stage", "tileA", "tileB", "world"];
const RESIDENTS = [
  ["r1", "grid"],
  ["r2", "grid"],
  ["r3", "grid"],
  ["r4", "grid"],
  ["r5", "tileA"],
  ["r6", "tileB"],
];
const TRANSFORMATIONS = [
  ["t1", "grid", "physical"],
  ["t2", "physical", "stage"],
  ["t3", "tileA", "stage"],
  ["t4", "tileB", "stage"],
  ["t5", "stage", "world"],
];
const ISLAND = ["island-a", "island-b"];

const graph = () => ({
  id: "root",
  layoutOptions: LAYOUT_OPTIONS,
  children: [...SYSTEMS, ...RESIDENTS.map(([id]) => id), ...ISLAND].map(
    (id) => ({ id, ...NODE_SIZE }),
  ),
  edges: [
    ...RESIDENTS.map(([id, system]) => ({
      id: `lives-in-${id}`,
      sources: [system],
      targets: [id],
    })),
    ...TRANSFORMATIONS.map(([id, source, target]) => ({
      id,
      sources: [source],
      targets: [target],
    })),
    { id: "t6", sources: [ISLAND[0]], targets: [ISLAND[1]] },
  ],
});

const centres = (laid: { children?: { id: string; x?: number; y?: number }[] }) =>
  (laid.children ?? []).map((child) => ({
    id: child.id,
    x: (child.x ?? 0) + NODE_DIAMETER / 2,
    y: (child.y ?? 0) + NODE_DIAMETER / 2,
  }));

describe("the coordinate graph layout", () => {
  it("never lets two circles touch", async () => {
    const laid = await new ELK().layout(graph());
    const placed = centres(laid);

    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const gap = Math.hypot(
          placed[i].x - placed[j].x,
          placed[i].y - placed[j].y,
        );
        expect(
          gap,
          `${placed[i].id} and ${placed[j].id} overlap`,
        ).toBeGreaterThanOrEqual(NODE_DIAMETER);
      }
    }
  });

  it("places every node, including the island nothing connects to", async () => {
    const laid = await new ELK().layout(graph());
    expect(laid.children).toHaveLength(
      SYSTEMS.length + RESIDENTS.length + ISLAND.length,
    );
    for (const child of laid.children ?? []) {
      expect(Number.isFinite(child.x)).toBe(true);
      expect(Number.isFinite(child.y)).toBe(true);
    }
  });

  it("settles in the same place every time", async () => {
    // An unseeded force-family layout lands somewhere new on every render, and
    // a graph that rearranges itself when you blink is unreadable.
    const first = centres(await new ELK().layout(graph()));
    const second = centres(await new ELK().layout(graph()));
    expect(second).toEqual(first);
  });

  it("keeps a resident nearer its own space than the graph is wide", async () => {
    const laid = await new ELK().layout(graph());
    const at = new Map(centres(laid).map((c) => [c.id, c]));
    const grid = at.get("grid")!;
    for (const id of ["r1", "r2", "r3", "r4"]) {
      const resident = at.get(id)!;
      const gap = Math.hypot(resident.x - grid.x, resident.y - grid.y);
      // One rest length, give or take — the spring is doing its job.
      expect(gap).toBeLessThan(NODE_DIAMETER * 3);
    }
  });
});
