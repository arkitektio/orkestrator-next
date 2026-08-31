import { useEffect, useLayoutEffect, useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { LineSegments2 } from "three/examples/jsm/lines/webgpu/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { Line2NodeMaterial } from "three/webgpu";

import { perfMonitor } from "../../../platform/perf/perfMonitor";
import { batchColors, roiForSegment, type OutlineBatch } from "../annotationBatch";
import type { SelectedRoi } from "../roiSelectionStore";

/**
 * One merged fat-line draw for a batch of shape outlines. Picking maps the
 * raycast's `faceIndex` (the segment's instance index) back to the owning ROI
 * through the batch's sorted ranges — same handler-attachment gating as the
 * per-shape path (P20).
 *
 * GEOMETRY uploads only when the batch itself changes (data, plane-independent
 * by construction — sectioned ellipsoids are excluded); a SELECTION change is
 * genuinely a color-only pass (`batchColors` → `setColors`), which is the
 * perf property the batching was built for.
 */
export const AnnotationOutlineBatch = ({
  batch,
  selectedIds,
  selectable,
  onSelectRoi,
}: {
  batch: OutlineBatch<SelectedRoi>;
  selectedIds: ReadonlySet<string>;
  selectable: boolean;
  onSelectRoi: (roi: SelectedRoi, appendSelection: boolean) => void;
}) => {
  perfMonitor.countRender("AnnotationOutlineBatch"); // no-op unless a recording is armed
  const geometry = useMemo(() => new LineSegmentsGeometry(), []);
  const material = useMemo(() => {
    const created = new Line2NodeMaterial();
    created.vertexColors = true;
    return created;
  }, []);
  const line = useMemo(() => new LineSegments2(geometry, material), [geometry, material]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  // Layout effect for the same reason as `Line`: the WGSL vertex layout is
  // derived from the geometry's attributes, so positions must exist before
  // the first frame draws.
  useLayoutEffect(() => {
    geometry.setPositions(batch.positions);
    line.computeLineDistances();
  }, [batch, geometry, line]);

  useLayoutEffect(() => {
    geometry.setColors(batchColors(batch, (id) => selectedIds.has(id)));
  }, [batch, selectedIds, geometry]);

  useEffect(() => {
    material.linewidth = batch.lineWidth;
    material.needsUpdate = true;
  }, [material, batch.lineWidth]);

  const handleClick = selectable
    ? (event: ThreeEvent<MouseEvent>) => {
        const roi = roiForSegment(batch.ranges, event.faceIndex);
        if (!roi) return;
        event.stopPropagation();
        onSelectRoi(roi, event.nativeEvent.shiftKey);
      }
    : undefined;

  return <primitive object={line} onClick={handleClick} />;
};
