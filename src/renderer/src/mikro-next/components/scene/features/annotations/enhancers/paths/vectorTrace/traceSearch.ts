/**
 * A* over a 3D voxel lattice — the search behind the vector enhancer.
 *
 * The tool computes a path only when the user clicks (one hop between two known
 * waypoints), which is exactly the case A* is for: a single source and a single
 * goal, with a heuristic to prune. The livewire alternative — Dijkstra from a
 * seed, keeping the back-pointer field — only pays off when a moving cursor asks
 * for a new path every frame, and nothing here does.
 *
 * The grid is a plain cost field: `cost[node]` says how much this voxel RESISTS
 * being travelled through, in [0, 1], or `Infinity` for "cannot" (nothing
 * resident there). What makes a voxel cheap — bright, edge-like, near the chord
 * between the waypoints — is `traceCost.ts`'s business, not this module's.
 *
 * Steps are measured in WORLD length, not in voxels. Z spacing is routinely
 * several times the xy spacing, and a lattice that treats every step as 1 would
 * quietly prefer z-hops because they cover more ground for the same price.
 */

/** Node coordinates in the search grid (not level-0 voxels — see `traceBox`). */
export type TraceNode = [number, number, number];

export type TraceGrid = {
  /** Node counts along x, y, z. */
  size: readonly [number, number, number];
  /** World length of ONE node step along each axis. */
  spacing: readonly [number, number, number];
  /**
   * Per-node resistance in [0, 1]; `Infinity` is impassable. Indexed
   * x-fastest: `x + y * size[0] + z * size[0] * size[1]`.
   */
  cost: Float32Array;
};

export type TraceSearchOptions = {
  /**
   * Max nodes expanded before the search gives up. A cap, not a target: it
   * exists so one pathological hop cannot wedge the UI thread.
   */
  budget?: number;
};

export type TraceFailure = "blocked-endpoint" | "unreachable" | "budget";

export type TraceResult =
  | { ok: true; path: TraceNode[]; expanded: number }
  | { ok: false; reason: TraceFailure; expanded: number };

/**
 * The floor on per-step cost. Two jobs: it keeps the metric strictly positive
 * (a zero-cost region would let the path wander through it for free), and it is
 * the minimum per-unit cost the heuristic multiplies by, which is what makes
 * that heuristic admissible — and so the result optimal for these weights.
 */
export const TRACE_BASE_COST = 0.05;

/** Default expansion cap: ~a second of work in the worst case, far less in practice. */
export const DEFAULT_TRACE_BUDGET = 2_000_000;

const nodeIndex = (
  x: number,
  y: number,
  z: number,
  size: readonly [number, number, number],
): number => x + y * size[0] + z * size[0] * size[1];

const inBounds = (
  x: number,
  y: number,
  z: number,
  size: readonly [number, number, number],
): boolean =>
  x >= 0 && y >= 0 && z >= 0 && x < size[0] && y < size[1] && z < size[2];

/** The 26 neighbours of a voxel: every ±1 combination except staying put. */
const neighbourOffsets = (): [number, number, number][] => {
  const offsets: [number, number, number][] = [];
  for (let dz = -1; dz <= 1; dz += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        offsets.push([dx, dy, dz]);
      }
    }
  }
  return offsets;
};

const OFFSETS = neighbourOffsets();

/**
 * Binary min-heap over (priority, node). Hand-rolled against typed arrays
 * because the search pushes on the order of the node count and a sorted-array
 * queue turns the whole thing quadratic.
 */
class NodeHeap {
  private priorities: Float64Array;
  private nodes: Int32Array;
  private length = 0;

  constructor(capacity: number) {
    this.priorities = new Float64Array(Math.max(16, capacity));
    this.nodes = new Int32Array(Math.max(16, capacity));
  }

  get size(): number {
    return this.length;
  }

  private grow(): void {
    const priorities = new Float64Array(this.priorities.length * 2);
    priorities.set(this.priorities);
    this.priorities = priorities;
    const nodes = new Int32Array(this.nodes.length * 2);
    nodes.set(this.nodes);
    this.nodes = nodes;
  }

  push(priority: number, node: number): void {
    if (this.length === this.nodes.length) this.grow();
    let child = this.length;
    this.length += 1;
    this.priorities[child] = priority;
    this.nodes[child] = node;
    while (child > 0) {
      const parent = (child - 1) >> 1;
      if (this.priorities[parent] <= this.priorities[child]) break;
      this.swap(parent, child);
      child = parent;
    }
  }

  /** Lowest-priority node, or -1 when empty. */
  pop(): number {
    if (this.length === 0) return -1;
    const top = this.nodes[0];
    this.length -= 1;
    if (this.length > 0) {
      this.priorities[0] = this.priorities[this.length];
      this.nodes[0] = this.nodes[this.length];
      let parent = 0;
      for (;;) {
        const left = parent * 2 + 1;
        const right = left + 1;
        let smallest = parent;
        if (left < this.length && this.priorities[left] < this.priorities[smallest]) {
          smallest = left;
        }
        if (right < this.length && this.priorities[right] < this.priorities[smallest]) {
          smallest = right;
        }
        if (smallest === parent) break;
        this.swap(parent, smallest);
        parent = smallest;
      }
    }
    return top;
  }

  private swap(a: number, b: number): void {
    const priority = this.priorities[a];
    this.priorities[a] = this.priorities[b];
    this.priorities[b] = priority;
    const node = this.nodes[a];
    this.nodes[a] = this.nodes[b];
    this.nodes[b] = node;
  }
}

/**
 * Cost of stepping between two ADJACENT nodes: the step's world length times
 * the resistance it passes through, averaged over the two ends. Averaging is
 * what stops a path from hugging the boundary of an expensive region and paying
 * only for the cheap side of it.
 */
const stepCost = (
  length: number,
  costFrom: number,
  costTo: number,
): number => length * (TRACE_BASE_COST + (costFrom + costTo) / 2);

/**
 * The shortest path from `start` to `goal` through `grid`, as node coordinates
 * INCLUSIVE of both ends.
 *
 * Fails rather than approximates: an endpoint on an impassable voxel, a goal
 * walled off by impassable ones, and a budget exhaustion are three different
 * answers, and the caller says something different about each.
 */
export function findTracePath(
  grid: TraceGrid,
  start: TraceNode,
  goal: TraceNode,
  options: TraceSearchOptions = {},
): TraceResult {
  const { size, spacing, cost } = grid;
  const total = size[0] * size[1] * size[2];
  const budget = options.budget ?? DEFAULT_TRACE_BUDGET;

  if (!inBounds(...start, size) || !inBounds(...goal, size)) {
    return { ok: false, reason: "blocked-endpoint", expanded: 0 };
  }

  const startIndex = nodeIndex(start[0], start[1], start[2], size);
  const goalIndex = nodeIndex(goal[0], goal[1], goal[2], size);

  if (!Number.isFinite(cost[startIndex]) || !Number.isFinite(cost[goalIndex])) {
    return { ok: false, reason: "blocked-endpoint", expanded: 0 };
  }
  if (startIndex === goalIndex) {
    return { ok: true, path: [[...start] as TraceNode], expanded: 0 };
  }

  // Step lengths per offset, precomputed: 26 square roots instead of 26 per node.
  const stepLengths = OFFSETS.map(([dx, dy, dz]) =>
    Math.hypot(dx * spacing[0], dy * spacing[1], dz * spacing[2]),
  );

  const gScore = new Float64Array(total).fill(Infinity);
  const cameFrom = new Int32Array(total).fill(-1);
  const closed = new Uint8Array(total);

  /**
   * Straight-line world distance to the goal, priced at the cheapest possible
   * per-unit cost. Never overestimates — no route can beat the floor — so A*
   * stays optimal.
   */
  const heuristic = (x: number, y: number, z: number): number =>
    Math.hypot(
      (goal[0] - x) * spacing[0],
      (goal[1] - y) * spacing[1],
      (goal[2] - z) * spacing[2],
    ) * TRACE_BASE_COST;

  const open = new NodeHeap(Math.min(total, 1 << 16));
  gScore[startIndex] = 0;
  open.push(heuristic(start[0], start[1], start[2]), startIndex);

  let expanded = 0;

  while (open.size > 0) {
    const current = open.pop();
    if (closed[current]) continue; // a stale copy from a cheaper re-push
    closed[current] = 1;
    expanded += 1;

    if (current === goalIndex) {
      return { ok: true, path: reconstruct(cameFrom, current, size), expanded };
    }
    if (expanded >= budget) {
      return { ok: false, reason: "budget", expanded };
    }

    const x = current % size[0];
    const y = Math.floor(current / size[0]) % size[1];
    const z = Math.floor(current / (size[0] * size[1]));
    const currentCost = cost[current];
    const currentScore = gScore[current];

    for (let index = 0; index < OFFSETS.length; index += 1) {
      const [dx, dy, dz] = OFFSETS[index];
      const nx = x + dx;
      const ny = y + dy;
      const nz = z + dz;
      if (!inBounds(nx, ny, nz, size)) continue;

      const neighbour = nodeIndex(nx, ny, nz, size);
      if (closed[neighbour]) continue;

      const neighbourCost = cost[neighbour];
      if (!Number.isFinite(neighbourCost)) continue; // nothing resident there

      const tentative =
        currentScore + stepCost(stepLengths[index], currentCost, neighbourCost);
      if (tentative >= gScore[neighbour]) continue;

      gScore[neighbour] = tentative;
      cameFrom[neighbour] = current;
      open.push(tentative + heuristic(nx, ny, nz), neighbour);
    }
  }

  return { ok: false, reason: "unreachable", expanded };
}

function reconstruct(
  cameFrom: Int32Array,
  goalIndex: number,
  size: readonly [number, number, number],
): TraceNode[] {
  const path: TraceNode[] = [];
  let current = goalIndex;
  while (current !== -1) {
    const x = current % size[0];
    const y = Math.floor(current / size[0]) % size[1];
    const z = Math.floor(current / (size[0] * size[1]));
    path.push([x, y, z]);
    current = cameFrom[current];
  }
  return path.reverse();
}
