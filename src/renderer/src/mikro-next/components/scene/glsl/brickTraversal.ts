import * as THREE from "three";
import type { LayerBrickPool } from "../managers/brickResidency";

/**
 * Shared GLSL for sampling the brick pool through the page table — the core
 * of the pyramidal octree renderer, used by both the 2D plane compositor and
 * the 3D raymarcher.
 *
 * Per sample: try the desired level's page entry; EMPTY returns the encoded
 * uniform value, RESIDENT samples the atlas slot (border-offset, channel slab
 * stacked along z), otherwise fall through to the next-coarser level. All
 * spatial inputs are in the layer's BASE voxel space ([0, baseShape) per
 * axis); per-level coordinates are derived via the level scale factors, so
 * anisotropic (z-preserving) pyramids and rounding-truncated level shapes
 * stay exact.
 */

export const MAX_BRICK_LEVELS = 10;

/** Uniform + function declarations; append to a fragment shader. */
export const BRICK_TRAVERSAL_GLSL = /* glsl */ `
#define MAX_BRICK_LEVELS ${MAX_BRICK_LEVELS}

uniform highp usampler3D pageTable;
uniform highp sampler3D brickAtlas;
uniform int uNumLevels;
uniform ivec3 uPageOffset[MAX_BRICK_LEVELS];
uniform ivec3 uLevelShape[MAX_BRICK_LEVELS];
uniform vec3 uLevelScale[MAX_BRICK_LEVELS];
uniform ivec3 uBrickPayload;
uniform ivec3 uSlotSize;
uniform int uChannelSlabDepth; // stored.z: one channel slab's texel depth
uniform int uBrickBorder;
uniform vec3 uAtlasTexels;
uniform float uAtlasScale;     // hardware-normalization factor (R8: 255)
// EMPTY page entries carry their uniform value 8-bit-quantized over the
// layer's data range in R; decode back into raw data space with these.
uniform float uEmptyDecodeMin;
uniform float uEmptyDecodeRange;

/**
 * Sample the finest resident brick at or coarser than desiredLevel.
 * baseVoxel: continuous base-voxel position.
 * Returns 0 = nothing resident along the fallback chain (render transparent),
 * 1 = sampled a resident brick, 2 = hit a known-uniform (EMPTY) brick — the
 * raymarcher uses the distinction for empty-space skipping.
 */
int sampleBrickEx(vec3 baseVoxel, int desiredLevel, int channel, out float rawValue) {
  rawValue = 0.0;
  for (int lvl = 0; lvl < MAX_BRICK_LEVELS; lvl++) {
    if (lvl >= uNumLevels) break;
    if (lvl < desiredLevel) continue;

    vec3 levelVoxel = clamp(
      baseVoxel / uLevelScale[lvl],
      vec3(0.0),
      vec3(uLevelShape[lvl]) - 0.5001
    );
    ivec3 brick = ivec3(floor(levelVoxel / vec3(uBrickPayload)));
    uvec4 entry = texelFetch(pageTable, uPageOffset[lvl] + brick, 0);

    if (entry.a == 2u) { // EMPTY: uniform-fill brick, no slot
      rawValue = uEmptyDecodeMin + (float(entry.r) / 255.0) * uEmptyDecodeRange;
      return 2;
    }
    if (entry.a == 1u) { // RESIDENT
      vec3 inBrick = levelVoxel - vec3(brick * uBrickPayload);
      vec3 texel = vec3(ivec3(entry.xyz) * uSlotSize) + vec3(float(uBrickBorder)) + inBrick;
      texel.z += float(channel * uChannelSlabDepth);
      rawValue = texture(brickAtlas, texel / uAtlasTexels).r * uAtlasScale;
      return 1;
    }
  }
  return 0;
}

bool sampleBrick(vec3 baseVoxel, int desiredLevel, int channel, out float rawValue) {
  return sampleBrickEx(baseVoxel, desiredLevel, channel, rawValue) != 0;
}
`;

export type BrickTraversalUniforms = Record<string, THREE.IUniform>;

/**
 * Uniform values for `BRICK_TRAVERSAL_GLSL`, bound to one layer pool. Flat
 * Int32/Float32 arrays back the ivec3[]/vec3[] uniforms (uniform3iv layout).
 */
export function makeBrickTraversalUniforms(
  pool: LayerBrickPool,
  dataRange: { minValue: number; maxValue: number },
): BrickTraversalUniforms {
  const pageOffsets = new Int32Array(3 * MAX_BRICK_LEVELS);
  const levelShapes = new Int32Array(3 * MAX_BRICK_LEVELS);
  const levelScales = new Float32Array(3 * MAX_BRICK_LEVELS).fill(1);

  pool.geometry.levels.slice(0, MAX_BRICK_LEVELS).forEach((level, i) => {
    const offset = pool.pageTable.layout.levelOffset[i];
    pageOffsets.set(offset, i * 3);
    levelShapes.set(level.spatialShape, i * 3);
    levelScales.set(level.scale, i * 3);
  });

  return {
    pageTable: { value: pool.pageTable.texture },
    brickAtlas: { value: pool.atlas.texture },
    uNumLevels: { value: Math.min(pool.geometry.levels.length, MAX_BRICK_LEVELS) },
    uPageOffset: { value: pageOffsets },
    uLevelShape: { value: levelShapes },
    uLevelScale: { value: levelScales },
    uBrickPayload: { value: new THREE.Vector3(...pool.spec.payload) },
    uSlotSize: { value: new THREE.Vector3(...pool.atlas.slotSize) },
    uChannelSlabDepth: { value: pool.spec.stored[2] },
    uBrickBorder: { value: pool.spec.border },
    uAtlasTexels: { value: new THREE.Vector3(...pool.atlas.size) },
    uAtlasScale: { value: pool.atlas.dataScale },
    uEmptyDecodeMin: { value: dataRange.minValue },
    uEmptyDecodeRange: { value: dataRange.maxValue - dataRange.minValue },
  };
}

/** 8-bit encoding of a uniform brick's raw value for EMPTY page entries. */
export function encodeEmptyValue(
  value: number,
  dataRange: { minValue: number; maxValue: number },
): number {
  const range = dataRange.maxValue - dataRange.minValue;
  if (range <= 0) return 0;
  return Math.round(THREE.MathUtils.clamp((value - dataRange.minValue) / range, 0, 1) * 255);
}
