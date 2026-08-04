import * as THREE from "three";
import { buildSliceSignature } from "../sliceSignature";
import { PREFETCH_MARGIN, expandVoxelRange } from "../viewportPlanning";
import { affineToMatrix4 } from "../worldTransform";
import type { LayerState } from "../layerModel";
import type { LayerViewRange } from "../visibility";
import { atlasBytesPerVoxel, atlasKindForGeometry } from "./atlasFormat";
import { brickSlotBytes, type BrickSpec } from "./brickSpec";
import type { LayerLevelGeometry, Vec3 } from "./levelGeometry";
import {
  brickGridForLevel,
  childrenOf,
  nodeBaseBox,
  nodeKey,
  totalBrickCount,
  type VoxelBox,
} from "./nodeAddress";

/**
 * Unified hierarchical node planner for the brick-pool renderer — the 3D
 * generalization of `planLayerChunks`, shared by both display modes (2D is
 * the single-slab / quadtree degenerate case).
 *
 * Roles are reduced to two because the shader falls back to coarser resident
 * bricks per sample: there are no "cover" chunks and no render feedback.
 *  - "target": fetch + protect from pool eviction
 *  - "keep":   the ancestor chain of every target, so a fallback is always
 *              resident. Protected AND fetched when missing — but a far
 *              keep dispatches after near targets (see compareFetchOrder)
 *
 * Traversal refines closest-first, so when the byte budget runs out it is
 * the distant regions that degrade to coarser bricks.
 */

export type PlannedNode = {
  key: string;
  level: number;
  coords: Vec3;
  role: "target" | "keep";
  /** Emission order within the plan (deterministic, near-first). */
  priority: number;
  /**
   * Foveated squared distance (base voxels²) from the plan focus to the
   * NEAREST point of the node's base box; xy-only in 2D (focus z is
   * mid-stack while nodes sit at slabZ, so a raw dz² would be constant
   * within a level but incomparable across levels). 0 = contains the focus.
   * Box distance is monotone under ancestry: an ancestor's box contains its
   * descendants', so ancestor score ≤ descendant score.
   */
  fetchScore: number;
  /**
   * 0 = rootLevel backdrop (few bricks — the shader's no-hole guarantee for
   * the whole view, always fetched first), 1 = overlaps the strict viewport,
   * 2 = margin-only prefetch (fetched last).
   */
  fetchBand: 0 | 1 | 2;
};

export type LayerNodePlan = {
  mode: "2D" | "3D";
  sliceSignature: string;
  /** Finest level the plan requests anywhere (the shader's ortho LOD hint). */
  targetLevel: number;
  /** 2D only: base-voxel z of the displayed slab (null in 3D / no z axis). */
  slabZ: number | null;
  nodes: PlannedNode[];
  planBytes: number;
};

/**
 * The ONE 2D slab z-mapping convention: base slab z (an integer base-level
 * slice index) → level z voxel, by flooring the base-voxel position. Shared
 * verbatim by the planner (`resolveLevelZ`) and — reimplemented in TSL — the
 * plane shader (`brickNodeMaterials.ts` `makeSampleBrickEx` slab mode). The
 * two MUST agree per level or the shader looks up bricks the planner never
 * fetched (silent coarse fallback, zoom-dependent at non-integer z scales).
 */
export const slabLevelZ = (
  baseSlabZ: number,
  baseScaleZ: number,
  levelScaleZ: number,
): number => Math.floor((baseSlabZ * baseScaleZ) / levelScaleZ);

/**
 * Brick z of the slab `baseSlabZ + dz` at a level (the z±1 prefetch): null
 * when the neighbor slab is outside the base stack or the level does not
 * cover it (truncated pyramid, same drop-out rule as `resolveLevelZ`).
 * Composes `slabLevelZ` with the payload division so the prefetch targets
 * EXACTLY the brick the planner would fetch when the user scrubs there.
 */
export const adjacentSlabBrickZ = (
  baseSlabZ: number,
  dz: number,
  baseScaleZ: number,
  levelScaleZ: number,
  levelShapeZ: number,
  payloadZ: number,
  baseShapeZ: number,
): number | null => {
  const neighborBase = baseSlabZ + dz;
  if (neighborBase < 0 || neighborBase > baseShapeZ - 1) return null;
  const levelZ = slabLevelZ(neighborBase, baseScaleZ, levelScaleZ);
  if (levelZ < 0 || levelZ > levelShapeZ - 1) return null;
  return Math.floor(levelZ / payloadZ);
};

export type NodeCamera = {
  /** Camera frustum transformed into the layer's base-voxel frame. */
  voxelFrustum: THREE.Frustum;
  /** Camera position in base voxels — null for orthographic cameras. */
  voxelPosition: Vec3 | null;
  /** viewportHeight / (2·tan(fovY/2)): px per base voxel at voxel-distance 1. */
  pxPerVoxelAtUnitDistance: number;
  /** Normalized view direction in base voxels (foveated ordering) — null for
   * orthographic cameras or when it cannot be derived. Ordering-only input:
   * it biases WHICH admitted node refines/fetches first, never the set. */
  voxelViewDirection?: Vec3 | null;
};

export type PlanLayerNodesInput = {
  layer: LayerState;
  geometry: LayerLevelGeometry;
  spec: BrickSpec;
  mode: "2D" | "3D";
  viewRange: LayerViewRange | undefined;
  /** 3D only; null falls back to the orthographic footprint (viewRange.scale). */
  camera: NodeCamera | null;
  lodBias: number;
  currentZ: number | undefined;
  /** Scene-wide dim-slider selections (t, tau, …) — signature input only. */
  dimSelections?: Record<string, number>;
  maxPlanBytes?: number;
  /** The previous plan's targetLevel (budget-floor hysteresis input). */
  previousTargetLevel?: number;
};

/** Slack factor the budget floor tolerates to KEEP an already-unlocked finer
 * level (see budgetMinLevel hysteresis below). */
const BUDGET_FLOOR_HYSTERESIS = 1.15;

// Scratch objects (single-threaded, one plan at a time).
const scratchBox = new THREE.Box3();
const scratchPoint = new THREE.Vector3();

const boxDistance = (box: VoxelBox, point: Vec3): number => {
  scratchBox.min.set(box.min[0], box.min[1], box.min[2]);
  scratchBox.max.set(box.max[0], box.max[1], box.max[2]);
  scratchPoint.set(point[0], point[1], point[2]);
  return scratchBox.distanceToPoint(scratchPoint);
};

/** How much foveation penalizes off-axis nodes: at the view axis the score is
 * plain distance²; at 90° off-axis it is distance² × (1 + w)². */
export const FOVEA_WEIGHT = 1.5;

/**
 * Foveated ordering score (squared-distance space): distance to `origin`,
 * penalized by the angle off the view axis. Equidistant nodes in the screen
 * CENTER sort before nodes at the screen edge — pure camera distance loaded
 * near-but-peripheral bricks first, which is backwards for "sharpen what I'm
 * looking at". With a null `viewDirection` (orthographic / 2D) this is the
 * plain squared center distance. Ordering-only: callers must never use it to
 * admit or reject nodes.
 */
export function foveatedScore(
  center: Vec3,
  origin: Vec3,
  viewDirection: Vec3 | null | undefined,
  foveaWeight = FOVEA_WEIGHT,
): number {
  const dx = center[0] - origin[0];
  const dy = center[1] - origin[1];
  const dz = center[2] - origin[2];
  const distSq = dx * dx + dy * dy + dz * dz;
  if (!viewDirection || distSq === 0) return distSq;
  const dist = Math.sqrt(distSq);
  const cos =
    (dx * viewDirection[0] + dy * viewDirection[1] + dz * viewDirection[2]) / dist;
  const penalty = 1 + foveaWeight * (1 - cos);
  return distSq * penalty * penalty; // ≡ (dist · penalty)², same ordering
}

const boxCenter = (box: VoxelBox): Vec3 => [
  (box.min[0] + box.max[0]) / 2,
  (box.min[1] + box.max[1]) / 2,
  (box.min[2] + box.max[2]) / 2,
];

const boxesOverlap = (a: VoxelBox, b: VoxelBox): boolean =>
  a.min[0] < b.max[0] && b.min[0] < a.max[0] &&
  a.min[1] < b.max[1] && b.min[1] < a.max[1] &&
  a.min[2] < b.max[2] && b.min[2] < a.max[2];

export function planLayerNodes({
  layer,
  geometry,
  spec,
  mode,
  viewRange,
  camera,
  lodBias,
  currentZ,
  dimSelections,
  maxPlanBytes = Number.POSITIVE_INFINITY,
  previousTargetLevel,
}: PlanLayerNodesInput): LayerNodePlan {
  const sliceSignature = buildSliceSignature(layer, dimSelections);
  const levels = geometry.levels;
  const numLevels = levels.length;
  const coarsest = numLevels - 1;
  const { zPos } = geometry.axes;

  const empty = (targetLevel: number, slabZ: number | null): LayerNodePlan => ({
    mode,
    sliceSignature,
    targetLevel,
    slabZ,
    nodes: [],
    planBytes: 0,
  });
  if (numLevels === 0) return empty(0, null);

  const fixedLOD =
    typeof layer.fixedLOD === "number" && layer.fixedLOD >= 0 && layer.fixedLOD < numLevels
      ? layer.fixedLOD
      : null;

  // ONE uniform slot size for every level: the pool allocates all slots at
  // the atlas kind's width (r32f for phasor layers regardless of source
  // dtype — see atlasKindForGeometry). Sizing plan bytes per-level by source
  // dtype made the plan and the pool disagree on capacity.
  const slotBytes = brickSlotBytes(spec, atlasBytesPerVoxel(atlasKindForGeometry(geometry)));

  // --- 2D slab selection (uncentered z mapping, parity with chunkPlanning) --
  const layerAffineInverse = affineToMatrix4(layer.affineMatrix).invert();
  const localZ =
    zPos !== -1 && currentZ !== undefined
      ? new THREE.Vector3(0, 0, currentZ).applyMatrix4(layerAffineInverse).z
      : null;

  /** Nearest base-level slice for the slider position ("out-of-range" hides
   * the layer). Chosen ONCE at base resolution; every coarser level derives
   * its slab from this by floor-division below. */
  const baseSlabZ = ((): number | "out-of-range" | null => {
    if (localZ === null) return null;
    const zIndex = Math.round(localZ / levels[0].scale[2]);
    if (zIndex < 0 || zIndex > levels[0].spatialShape[2] - 1) return "out-of-range";
    return zIndex;
  })();

  /** Level z voxel of the slab. Floor-divided from the SAME base z at every
   * level (`slabLevelZ`) — rounding localZ per level instead can pick a
   * coarse brick whose children don't contain the finer level's slab (e.g.
   * z=150, scales 32/16: round(150/32)=5 but round(150/16)=9, a child of
   * brick 4), which stalls refinement at the coarsest level. Floor chains
   * are self-consistent, and the 2D plane shader mirrors EXACTLY this
   * mapping (`makeSampleBrickEx` slab mode: floor(baseZ / scale), + 0.5
   * only to recenter INSIDE the chosen level texel) — sampling
   * floor((baseZ + 0.5) / scale) instead lands one texel past the planned
   * brick at non-integer z scales (e.g. scale 4.22, baseZ 8: planner 1,
   * shader 2 → UNMAPPED → silent coarse fallback that flips with zoom).
   *
   * "out-of-range" means this LEVEL does not cover the slab. Truncated
   * pyramids genuinely lose tail slices at coarse levels (e.g. 81 base
   * slices → z shape 2 at scale 32 covers only base z < 64): such levels
   * must drop out of the slab chain, NOT clamp to their last slice —
   * a clamped brick shows the wrong z and its children never contain the
   * finer slab, stalling refinement. */
  const resolveLevelZ = (levelIndex: number): number | "out-of-range" => {
    if (baseSlabZ === null) return 0;
    if (baseSlabZ === "out-of-range") return "out-of-range";
    if (levelIndex === 0) return baseSlabZ;
    const zIndex = slabLevelZ(baseSlabZ, levels[0].scale[2], levels[levelIndex].scale[2]);
    if (zIndex > levels[levelIndex].spatialShape[2] - 1) return "out-of-range";
    return zIndex;
  };

  const slabBrickZ = (levelIndex: number): number | null => {
    if (mode !== "2D") return null;
    const levelZ = resolveLevelZ(levelIndex);
    if (levelZ === "out-of-range") return null;
    return Math.floor(levelZ / spec.payload[2]);
  };

  const slabZOut =
    mode === "2D" && zPos !== -1 && localZ !== null
      ? (() => {
          const levelZ = resolveLevelZ(0);
          return levelZ === "out-of-range" ? null : levelZ;
        })()
      : mode === "2D"
        ? 0
        : null;

  if (mode === "2D" && baseSlabZ === "out-of-range") {
    // Slider outside this layer's stack: render nothing.
    return empty(coarsest, null);
  }

  // Truncated pyramids can lose tail slices at coarse levels (81 base slices
  // → z shape 2 at scale 32 covers only base z < 64). For a slab beyond that
  // coverage, root the DFS at the coarsest level that still HAS the slab —
  // levels above it simply have no data for this z.
  let rootLevel = coarsest;
  if (mode === "2D") {
    while (rootLevel > 0 && slabBrickZ(rootLevel) === null) rootLevel--;
  }

  // --- Visible region in base voxels ---------------------------------------
  const baseShape = levels[0].spatialShape;
  let visibleBox: VoxelBox | null = null;
  /** The viewport WITHOUT the prefetch margin — band tagging only. */
  let strictBox: VoxelBox | null = null;
  if (viewRange) {
    const ex = expandVoxelRange(viewRange.xRange, PREFETCH_MARGIN);
    const ey = expandVoxelRange(viewRange.yRange, PREFETCH_MARGIN);
    const ez =
      mode === "3D" && viewRange.zRange
        ? expandVoxelRange(viewRange.zRange, PREFETCH_MARGIN)
        : ([0, baseShape[2]] as [number, number]);
    visibleBox = {
      min: [Math.max(0, ex[0]), Math.max(0, ey[0]), Math.max(0, ez[0])],
      max: [
        Math.min(baseShape[0], ex[1]),
        Math.min(baseShape[1], ey[1]),
        Math.min(baseShape[2], ez[1]),
      ],
    };
    const sz: [number, number] =
      mode === "3D" && viewRange.zRange ? viewRange.zRange : [0, baseShape[2]];
    strictBox = {
      min: [
        Math.max(0, viewRange.xRange[0]),
        Math.max(0, viewRange.yRange[0]),
        Math.max(0, sz[0]),
      ],
      max: [
        Math.min(baseShape[0], viewRange.xRange[1]),
        Math.min(baseShape[1], viewRange.yRange[1]),
        Math.min(baseShape[2], sz[1]),
      ],
    };
  }

  // --- Budget floor on refinement -------------------------------------------
  // The finest level a plan may request is bounded by the DECODED CHUNK BYTES
  // the visible region implies at that level, not just by GPU slot bytes:
  // fetch granularity is the zarr chunk, so with pathological chunkings
  // (e.g. plane-chunked SPIM stacks, [2,2048,2048]) any fine-level brick pull
  // decodes whole 2048² planes and an eager plan streams the entire
  // full-resolution volume. Counting chunk-aligned coverage at decode width
  // (the worker promotes everything except uint8 to float32) keeps first-view
  // loads at the coarse levels; zooming in shrinks the visible box and
  // unlocks finer levels naturally. An explicit fixedLOD overrides the floor.
  const visibleBytesAtLevel = (levelIndex: number): number => {
    const level = levels[levelIndex];
    const dtype = level.dtype;
    const decodedBytesPerVoxel =
      dtype.includes("u1") || dtype.includes("i1") || dtype.includes("8") ? 1 : 4;
    let voxels = 1;
    for (const axis of [0, 1, 2] as const) {
      const chunkExtent = Math.max(1, level.spatialChunks[axis]);
      const gridExtent = Math.ceil(level.spatialShape[axis] / chunkExtent);
      let chunkCount: number;
      if (mode === "2D" && axis === 2) {
        chunkCount = 1; // single slab → one chunk row along z
      } else if (visibleBox) {
        const lo = visibleBox.min[axis] / level.scale[axis];
        const hi = visibleBox.max[axis] / level.scale[axis];
        chunkCount = Math.max(1, Math.ceil(hi / chunkExtent) - Math.floor(lo / chunkExtent));
      } else {
        chunkCount = gridExtent;
      }
      voxels *= Math.min(gridExtent, chunkCount) * chunkExtent;
    }
    return voxels * decodedBytesPerVoxel;
  };
  let budgetMinLevel = coarsest;
  for (let levelIndex = 0; levelIndex <= coarsest; levelIndex++) {
    if (visibleBytesAtLevel(levelIndex) <= maxPlanBytes) {
      budgetMinLevel = levelIndex;
      break;
    }
  }
  // Hysteresis on the budget floor: a zoom hovering right at a level's byte
  // threshold otherwise flips budgetMinLevel back and forth every few
  // replans, and each flip replaces (fetches + evicts) the ENTIRE finest
  // level set. A finer level the previous plan already unlocked stays
  // unlocked while its visible bytes remain within the slack factor; real
  // zoom-outs blow past the slack and re-coarsen normally.
  if (
    previousTargetLevel !== undefined &&
    previousTargetLevel === budgetMinLevel - 1 &&
    visibleBytesAtLevel(previousTargetLevel) <= maxPlanBytes * BUDGET_FLOOR_HYSTERESIS
  ) {
    budgetMinLevel = previousTargetLevel;
  }
  const minLevel = fixedLOD ?? budgetMinLevel;

  // --- Per-node screen footprint --------------------------------------------
  const footprintPxPerBaseVoxel = (baseBox: VoxelBox): number => {
    if (camera?.voxelPosition) {
      const distance = Math.max(1, boxDistance(baseBox, camera.voxelPosition));
      return camera.pxPerVoxelAtUnitDistance / distance;
    }
    return viewRange?.scale ?? 0;
  };

  const wantFiner = (level: number, baseBox: VoxelBox): boolean => {
    if (level <= minLevel) return false;
    if (fixedLOD !== null) return true; // refine all the way to the pinned LOD
    // MAX spatial factor: refine while ANY axis of the finer level still
    // resolves ≥1 px. True-factor pyramids are anisotropic (z can diverge
    // from xy), so testing x alone under-refines z-dominant views. MIRRORED
    // by the shader's `desiredLevelAt` (brickNodeMaterials.ts) — keep in
    // lockstep.
    const finerScale = levels[level - 1].scale;
    const finerFactor = Math.max(finerScale[0], finerScale[1], finerScale[2]);
    return footprintPxPerBaseVoxel(baseBox) * finerFactor * lodBias >= 1;
  };

  const focus: Vec3 = camera?.voxelPosition ??
    (visibleBox
      ? [
          (visibleBox.min[0] + visibleBox.max[0]) / 2,
          (visibleBox.min[1] + visibleBox.max[1]) / 2,
          (visibleBox.min[2] + visibleBox.max[2]) / 2,
        ]
      : [baseShape[0] / 2, baseShape[1] / 2, baseShape[2] / 2]);
  /** Foveation axis — only meaningful with a real camera position. */
  const viewAxis = camera?.voxelPosition ? camera.voxelViewDirection ?? null : null;
  const orderScore = (box: VoxelBox): number =>
    foveatedScore(boxCenter(box), focus, viewAxis);

  const clampToRange = (v: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, v));
  /**
   * Foveated squared distance from the focus to the box's NEAREST point —
   * unlike center-based `orderScore` this is comparable across levels, which
   * a global fetch sort needs. 2D projects z out entirely (see PlannedNode).
   */
  const fetchScoreOf = (box: VoxelBox): number =>
    foveatedScore(
      [
        clampToRange(focus[0], box.min[0], box.max[0]),
        clampToRange(focus[1], box.min[1], box.max[1]),
        mode === "2D" ? focus[2] : clampToRange(focus[2], box.min[2], box.max[2]),
      ],
      focus,
      viewAxis,
    );

  // --- Coarsest-level reservation -------------------------------------------
  // The residency manager pins EVERY resident coarsest brick in addition to
  // the plan (the shader's fallback of last resort), so the slots a plan can
  // actually win = budget − the full coarsest grid. Without the reservation a
  // fully refined plan requests essentially the whole pool: repacked bricks
  // find every slot protected at acquire time, are dropped, and are refetched
  // every replan (the acquire-failure treadmill) — worst at deep zoom, when
  // the plan is largest. When the whole pyramid fits the budget there is no
  // slot scarcity at all; skip the reservation so small datasets refine
  // freely.
  const coarsestGrid = brickGridForLevel(geometry, spec, coarsest);
  const coarsestReserveBytes =
    coarsestGrid[0] * coarsestGrid[1] * coarsestGrid[2] * slotBytes;
  const refineBudgetBytes =
    totalBrickCount(geometry, spec) * slotBytes <= maxPlanBytes
      ? maxPlanBytes
      : Math.max(0, maxPlanBytes - coarsestReserveBytes);

  // --- Closest-first refinement ---------------------------------------------
  const nodes: PlannedNode[] = [];
  let planBytes = 0;
  /** Bytes of sub-coarsest nodes only — what competes for unreserved slots. */
  let refineBytes = 0;
  let targetLevel = coarsest;

  const emit = (
    level: number,
    coords: Vec3,
    role: PlannedNode["role"],
    baseBox: VoxelBox,
  ) => {
    const fetchBand: PlannedNode["fetchBand"] =
      level === rootLevel ? 0 : strictBox && !boxesOverlap(baseBox, strictBox) ? 2 : 1;
    nodes.push({
      key: nodeKey(level, coords),
      level,
      coords,
      role,
      priority: nodes.length,
      fetchScore: fetchScoreOf(baseBox),
      fetchBand,
    });
    planBytes += slotBytes;
    if (level < coarsest) refineBytes += slotBytes;
    if (role === "target" && level < targetLevel) targetLevel = level;
  };

  const nodeVisible = (baseBox: VoxelBox): boolean => {
    if (visibleBox && !boxesOverlap(baseBox, visibleBox)) return false;
    if (mode === "3D" && camera) {
      scratchBox.min.set(baseBox.min[0], baseBox.min[1], baseBox.min[2]);
      scratchBox.max.set(baseBox.max[0], baseBox.max[1], baseBox.max[2]);
      if (!camera.voxelFrustum.intersectsBox(scratchBox)) return false;
    }
    return true;
  };

  const visit = (level: number, coords: Vec3): void => {
    const baseBox = nodeBaseBox(geometry, spec, level, coords);
    if (!nodeVisible(baseBox)) return;

    let children: Vec3[] = [];
    if (level > minLevel && wantFiner(level, baseBox)) {
      const childSlab = slabBrickZ(level - 1);
      // 2D with a real z axis: a child level that doesn't cover the slab
      // (childSlab null) must not be refined into — its bricks would show a
      // different z. Cannot happen below rootLevel with monotone pyramid
      // coverage, but guard against irregular level shapes.
      const childCoversSlab = mode !== "2D" || zPos === -1 || childSlab !== null;
      children = !childCoversSlab
        ? []
        : childrenOf(geometry, spec, level, coords).filter((child) => {
            if (mode === "2D" && childSlab !== null && child[2] !== childSlab) return false;
            return nodeVisible(nodeBaseBox(geometry, spec, level - 1, child));
          });
      const childBytes = children.length * slotBytes;
      const pendingSelfBytes = level < coarsest ? slotBytes : 0;
      if (
        children.length === 0 ||
        refineBytes + pendingSelfBytes + childBytes > refineBudgetBytes
      ) {
        children = [];
      }
    }

    if (children.length === 0) {
      emit(level, coords, "target", baseBox);
      return;
    }

    emit(level, coords, "keep", baseBox);
    children
      .map((child) => ({
        child,
        dist: orderScore(nodeBaseBox(geometry, spec, level - 1, child)),
      }))
      .sort((a, b) => a.dist - b.dist)
      .forEach(({ child }) => visit(level - 1, child));
  };

  // Roots: bricks of the coarsest slab-covering level overlapping the
  // visible region (all of them when no view range exists yet — "coarsest
  // backdrop before visibility"; refinement needs a footprint, which also
  // needs the view range or a perspective camera).
  const rootGrid = brickGridForLevel(geometry, spec, rootLevel);
  const rootScale = levels[rootLevel].scale;
  const rootSlab = slabBrickZ(rootLevel);

  const rootRange = (axis: 0 | 1 | 2): [number, number] => {
    if (!visibleBox) return [0, rootGrid[axis]];
    const extent = spec.payload[axis] * rootScale[axis];
    return [
      Math.max(0, Math.floor(visibleBox.min[axis] / extent)),
      Math.min(rootGrid[axis], Math.ceil(visibleBox.max[axis] / extent)),
    ];
  };

  const [x0, x1] = rootRange(0);
  const [y0, y1] = rootRange(1);
  const [z0, z1] = rootSlab !== null ? [rootSlab, rootSlab + 1] : rootRange(2);

  const roots: { coords: Vec3; dist: number }[] = [];
  for (let z = z0; z < z1; z++)
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const coords: Vec3 = [x, y, z];
        roots.push({
          coords,
          dist: orderScore(nodeBaseBox(geometry, spec, rootLevel, coords)),
        });
      }
  roots.sort((a, b) => a.dist - b.dist);
  for (const root of roots) visit(rootLevel, root.coords);

  return { mode, sliceSignature, targetLevel, slabZ: slabZOut, nodes, planBytes };
}

/**
 * Fetch dispatch order for a plan's missing nodes:
 *  band 0 — rootLevel backdrop (few bricks, the shader's no-hole guarantee
 *           for the WHOLE view) — always first;
 *  band 1 — on-screen nodes by foveated box distance to the focus, ties
 *           coarse-first. Box distance is monotone under ancestry, so the
 *           near subtree's fallback chain (score 0 over the focus) lands
 *           root→leaf just before its target, while a FAR keep or target
 *           (large distance) no longer preempts near targets — the previous
 *           global keep-before-target rule stalled the area under the cursor
 *           behind the whole viewport's intermediate fallback chain on
 *           zoom-in;
 *  band 2 — margin-only prefetch, last.
 * Emission index is the final deterministic tiebreak.
 */
export const compareFetchOrder = (a: PlannedNode, b: PlannedNode): number => {
  if (a.fetchBand !== b.fetchBand) return a.fetchBand - b.fetchBand;
  if (a.fetchScore !== b.fetchScore) return a.fetchScore - b.fetchScore;
  if (a.level !== b.level) return b.level - a.level; // coarse-first at ties
  return a.priority - b.priority;
};

/** Value equality between two plans (skip store writes / preserve identity). */
export function sameNodePlan(a: LayerNodePlan, b: LayerNodePlan): boolean {
  return (
    a.mode === b.mode &&
    a.sliceSignature === b.sliceSignature &&
    a.targetLevel === b.targetLevel &&
    a.slabZ === b.slabZ &&
    a.nodes.length === b.nodes.length &&
    a.nodes.every((node, i) => node.key === b.nodes[i].key && node.role === b.nodes[i].role)
  );
}
