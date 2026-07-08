import * as THREE from "three";
import type { DataType } from "zarrita";
import { mapDTypeToTextureBytes } from "../../stores/utils";
import { buildSliceSignature } from "../chunkPlanning";
import { PREFETCH_MARGIN, expandVoxelRange } from "../viewportPlanning";
import { affineToMatrix4 } from "../worldTransform";
import type { LayerState } from "../layerModel";
import type { LayerViewRange } from "../visibility";
import { brickSlotBytes, type BrickSpec } from "./brickSpec";
import type { LayerLevelGeometry, Vec3 } from "./levelGeometry";
import {
  brickGridForLevel,
  childrenOf,
  nodeBaseBox,
  nodeKey,
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
 *  - "keep":   protect only (the ancestor chain of every target, so a
 *              fallback is always resident)
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

export type NodeCamera = {
  /** Camera frustum transformed into the layer's base-voxel frame. */
  voxelFrustum: THREE.Frustum;
  /** Camera position in base voxels — null for orthographic cameras. */
  voxelPosition: Vec3 | null;
  /** viewportHeight / (2·tan(fovY/2)): px per base voxel at voxel-distance 1. */
  pxPerVoxelAtUnitDistance: number;
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
  maxPlanBytes?: number;
};

// Scratch objects (single-threaded, one plan at a time).
const scratchBox = new THREE.Box3();
const scratchPoint = new THREE.Vector3();

const boxDistance = (box: VoxelBox, point: Vec3): number => {
  scratchBox.min.set(box.min[0], box.min[1], box.min[2]);
  scratchBox.max.set(box.max[0], box.max[1], box.max[2]);
  scratchPoint.set(point[0], point[1], point[2]);
  return scratchBox.distanceToPoint(scratchPoint);
};

const boxCenterDistanceSq = (box: VoxelBox, point: Vec3): number => {
  const dx = (box.min[0] + box.max[0]) / 2 - point[0];
  const dy = (box.min[1] + box.max[1]) / 2 - point[1];
  const dz = (box.min[2] + box.max[2]) / 2 - point[2];
  return dx * dx + dy * dy + dz * dz;
};

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
  maxPlanBytes = Number.POSITIVE_INFINITY,
}: PlanLayerNodesInput): LayerNodePlan {
  const sliceSignature = buildSliceSignature(layer, currentZ);
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

  const slotBytesByLevel = levels.map((level) =>
    brickSlotBytes(spec, mapDTypeToTextureBytes(level.dtype as DataType)),
  );

  // --- 2D slab selection (uncentered z mapping, parity with chunkPlanning) --
  const layerAffineInverse = affineToMatrix4(layer.affineMatrix).invert();
  const localZ =
    zPos !== -1 && currentZ !== undefined
      ? new THREE.Vector3(0, 0, currentZ).applyMatrix4(layerAffineInverse).z
      : null;

  /** Level z voxel of the slab; "out-of-range" hides the layer at this level. */
  const resolveLevelZ = (levelIndex: number): number | "out-of-range" => {
    if (localZ === null) return 0;
    const scaleZ = levels[levelIndex].scale[2];
    const zIndex = Math.round(localZ / scaleZ);
    if (zIndex < 0 || zIndex > levels[levelIndex].spatialShape[2] - 1) return "out-of-range";
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

  if (mode === "2D" && slabBrickZ(coarsest) === null) {
    // Slider outside this layer's stack: render nothing (matches 2D planner).
    return empty(coarsest, null);
  }

  // --- Visible region in base voxels ---------------------------------------
  const baseShape = levels[0].spatialShape;
  let visibleBox: VoxelBox | null = null;
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
    const finerFactor = levels[level - 1].scale[0];
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

  // --- Closest-first refinement ---------------------------------------------
  const nodes: PlannedNode[] = [];
  let planBytes = 0;
  let targetLevel = coarsest;

  const emit = (level: number, coords: Vec3, role: PlannedNode["role"]) => {
    nodes.push({ key: nodeKey(level, coords), level, coords, role, priority: nodes.length });
    planBytes += slotBytesByLevel[level];
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
      children = childrenOf(geometry, spec, level, coords).filter((child) => {
        if (mode === "2D" && childSlab !== null && child[2] !== childSlab) return false;
        return nodeVisible(nodeBaseBox(geometry, spec, level - 1, child));
      });
      const childBytes = children.length * slotBytesByLevel[level - 1];
      if (
        children.length === 0 ||
        planBytes + slotBytesByLevel[level] + childBytes > maxPlanBytes
      ) {
        children = [];
      }
    }

    if (children.length === 0) {
      emit(level, coords, "target");
      return;
    }

    emit(level, coords, "keep");
    children
      .map((child) => ({
        child,
        dist: boxCenterDistanceSq(nodeBaseBox(geometry, spec, level - 1, child), focus),
      }))
      .sort((a, b) => a.dist - b.dist)
      .forEach(({ child }) => visit(level - 1, child));
  };

  // Roots: coarsest-level bricks overlapping the visible region (all of them
  // when no view range exists yet — parity with the 2D planner's "coarsest
  // backdrop before visibility" behavior; refinement needs a footprint, which
  // also needs the view range or a perspective camera).
  const rootGrid = brickGridForLevel(geometry, spec, coarsest);
  const rootScale = levels[coarsest].scale;
  const rootSlab = slabBrickZ(coarsest);

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
          dist: boxCenterDistanceSq(nodeBaseBox(geometry, spec, coarsest, coords), focus),
        });
      }
  roots.sort((a, b) => a.dist - b.dist);
  for (const root of roots) visit(coarsest, root.coords);

  return { mode, sliceSignature, targetLevel, slabZ: slabZOut, nodes, planBytes };
}

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
