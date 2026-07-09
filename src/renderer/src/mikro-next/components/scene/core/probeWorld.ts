import * as THREE from "three";

import { buildAffineMatrix } from "./worldTransform";
import { hasValidSpatialAxes, resolveAxisIndices } from "./dims";
import { resolveSpatialSelection } from "./selection";
import type { LayerState } from "../store/sceneStore";
import type { ProbedCoordinate } from "../store/viewerStore";

/**
 * Geometry for the marker drawn at a probed point: the layer's affine matrix and
 * the marker offset (`markerPosition`) expressed in the layer's local, physical
 * (scaled) units. The marker's world position is `affineMatrix · markerPosition`.
 *
 * Extracted from `SceneProbedPoint` so both the rendered marker and the
 * probe-orbit camera pivot derive the exact same point (no drift between what you
 * see and what you pivot around).
 */
export interface ProbeMarkerGeometry {
  affineMatrix: THREE.Matrix4;
  markerPosition: [number, number, number];
  markerRadius: number;
}

/** Resolve the volume LOD used for probe geometry (fixed → default → highest). */
export function getResolvedVolumeLod(layer: LayerState): number {
  const highestAvailableLod = Math.max(0, layer.lens.dataset.dataArrays.length - 1);
  if (typeof layer.fixedLOD === "number" && layer.fixedLOD >= 0 && layer.fixedLOD <= highestAvailableLod) {
    return layer.fixedLOD;
  }
  if (
    typeof layer.defaultVolumeLOD === "number" &&
    layer.defaultVolumeLOD >= 0 &&
    layer.defaultVolumeLOD <= highestAvailableLod
  ) {
    return layer.defaultVolumeLOD;
  }
  return highestAvailableLod;
}

/**
 * Compute the marker geometry (affine matrix + local marker offset + radius) for a
 * probe on a layer, or `null` when the layer has no resolvable spatial axes / LOD.
 */
export function resolveProbeMarkerGeometry(
  layer: LayerState,
  probe: ProbedCoordinate,
  getArrayForStoreId: (storeId: string) => { shape: readonly number[] },
  worldUnitsPerPixel: number,
): ProbeMarkerGeometry | null {
  const resolvedVolumeLod = getResolvedVolumeLod(layer);
  const dataArray = layer.lens.dataset.dataArrays[resolvedVolumeLod];
  if (!dataArray) {
    return null;
  }

  try {
    const arr = getArrayForStoreId(dataArray.store.id);
    const dims = layer.lens.dataset.dims;
    const sliceMap = layer.lens.slices.reduce<Record<string, LayerState["lens"]["slices"][number]>>((acc, slice) => {
      acc[slice.dim] = slice;
      return acc;
    }, {});

    const { xPos, yPos, zPos } = resolveAxisIndices(dims, layer);

    if (!hasValidSpatialAxes({ xPos, yPos, zPos })) {
      return null;
    }

    const xSelection = resolveSpatialSelection(sliceMap[layer.xDim ?? ""], arr.shape[xPos]);
    const ySelection = resolveSpatialSelection(sliceMap[layer.yDim ?? ""], arr.shape[yPos]);
    const zSelection = resolveSpatialSelection(sliceMap[layer.zDim as string], arr.shape[zPos]);
    const scaleX = dataArray.scaleFactors?.[xPos] ?? 1;
    const scaleY = dataArray.scaleFactors?.[yPos] ?? 1;
    const scaleZ = dataArray.scaleFactors?.[zPos] ?? 1;

    const totalX = arr.shape[xPos] * scaleX;
    const totalY = arr.shape[yPos] * scaleY;
    const totalZ = arr.shape[zPos] * scaleZ;

    const width = xSelection.length * xSelection.step * scaleX;
    const height = ySelection.length * ySelection.step * scaleY;
    const depth = zSelection.length * zSelection.step * scaleZ;

    const volumePosition: [number, number, number] = [
      xSelection.start * scaleX + width / 2 - totalX / 2,
      -(ySelection.start * scaleY + height / 2 - totalY / 2),
      zSelection.start * scaleZ + depth / 2 - totalZ / 2,
    ];
    const volumeSize: [number, number, number] = [width, height, depth];
    const markerPosition: [number, number, number] = [
      volumePosition[0] + probe.localPos[0] * volumeSize[0],
      volumePosition[1] + probe.localPos[1] * volumeSize[1],
      volumePosition[2] + probe.localPos[2] * volumeSize[2],
    ];
    const nonZeroAxes = volumeSize.map((axis) => Math.abs(axis)).filter((axis) => axis > 0);
    const minAxis = nonZeroAxes.length > 0 ? Math.min(...nonZeroAxes) : 1;

    return {
      affineMatrix: buildAffineMatrix(layer),
      markerPosition,
      markerRadius: THREE.MathUtils.clamp(worldUnitsPerPixel * 6, minAxis * 0.004, minAxis * 0.03),
    };
  } catch {
    return null;
  }
}

/**
 * World-space position of a probed point, or `null` when its geometry can't be
 * resolved. This is the same point the marker is drawn at, so it is the correct
 * pivot for the probe-orbit camera.
 */
export function computeProbeWorldPosition(
  layer: LayerState,
  probe: ProbedCoordinate,
  getArrayForStoreId: (storeId: string) => { shape: readonly number[] },
  worldUnitsPerPixel: number,
): THREE.Vector3 | null {
  const geometry = resolveProbeMarkerGeometry(layer, probe, getArrayForStoreId, worldUnitsPerPixel);
  if (!geometry) {
    return null;
  }
  return new THREE.Vector3(...geometry.markerPosition).applyMatrix4(geometry.affineMatrix);
}
