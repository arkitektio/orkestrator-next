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
      // R8 samples are hardware-normalized to [0,1]; scale back to data space
      // so the shader's minValue/maxValue (0..255) normalization holds.
      dataScale: 255.0,
      type: THREE.UnsignedByteType,
      internalFormat: "R8",
    };
  }

  if (dtype.includes("u2") || dtype.includes("i2") || dtype.includes("16")) {
    return {
      data: new Uint16Array(elementCount),
      // Normalized 16-bit sample -> raw 0..65535 data space.
      dataScale: 65535.0,
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
