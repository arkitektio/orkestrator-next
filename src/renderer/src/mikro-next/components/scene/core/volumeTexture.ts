import * as THREE from "three";

/**
 * Dtype → typed-buffer + three.js texture format mapping for R-format
 * Data3DTextures. (Moved out of `layers/three_d/volume-math.ts`.)
 */
export type TextureBufferConfig = {
  data: Uint8Array | Uint16Array | Float32Array;
  dataScale: number;
  type: THREE.TextureDataType;
  internalFormat: "R8" | "R16" | "R32F" | null;
};

export function createVolumeTextureBuffer(dtype: string, elementCount: number): TextureBufferConfig {
  if (dtype.includes("u1") || dtype.includes("i1") || dtype.includes("8")) {
    return {
      data: new Uint8Array(elementCount),
      dataScale: 1.0,
      type: THREE.UnsignedByteType,
      internalFormat: "R8",
    };
  }

  if (dtype.includes("u2") || dtype.includes("i2") || dtype.includes("16")) {
    return {
      data: new Uint16Array(elementCount),
      dataScale: 1.0,
      type: THREE.UnsignedShortType,
      internalFormat: null, // Let WebGL default to native hardware normalization
    };
  }

  return {
    data: new Float32Array(elementCount),
    dataScale: 1.0,
    type: THREE.FloatType,
    internalFormat: "R32F",
  };
}

/**
 * Texture config for an already-loaded chunk buffer (unifies the two
 * `getTextureConfig` helpers formerly inline in ChunkPlane and the volume path).
 */
export function textureConfigFromArray(rawData: unknown): {
  data: Uint8Array | Float32Array;
  type: THREE.TextureDataType;
  internalFormat: "R8" | "R32F";
  dataScale: number;
} {
  if (rawData instanceof Uint8Array || rawData instanceof Uint8ClampedArray) {
    return {
      data: rawData instanceof Uint8ClampedArray ? new Uint8Array(rawData.buffer) : rawData,
      type: THREE.UnsignedByteType,
      internalFormat: "R8",
      dataScale: 255.0,
    };
  }
  if (rawData instanceof Float32Array) {
    return { data: rawData, type: THREE.FloatType, internalFormat: "R32F", dataScale: 1.0 };
  }
  throw new Error(
    `Unexpected chunk data type: ${(rawData as { constructor?: { name?: string } })?.constructor?.name ?? typeof rawData}`,
  );
}
