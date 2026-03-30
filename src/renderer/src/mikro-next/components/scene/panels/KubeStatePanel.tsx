import { Card } from "@/components/ui/card";
import { useKubeStateStore } from "@/store/kubeStateStore";
import { useViewStore } from "@/store/viewStore";
import { useMemo } from "react";
import * as THREE from "three";
import { DetectorKubePanel } from "./kubes/DetectorKubePanel";
import { DichroicKubePanel } from "./kubes/DichroicKubePanel";
import { FilterBankKubePanel } from "./kubes/FilterBankKubePanel";
import { FilterKubePanel } from "./kubes/FilterKubePanel";
import { GenericKubePanel } from "./kubes/GenericKubePanel";
import { IlluminationKubePanel } from "./kubes/IlluminationKubePanel";
import { ObjectiveKubePanel } from "./kubes/ObjectiveKubePanel";
import { StageKubePanel } from "./kubes/StageKubePanel";
import { useModeStore } from "@/store/modeStore";

export const KubeStatePanel = () => {
  // 1. Get Domain Data
  const selectedKubeState = useKubeStateStore((s) => s.selectedKubeState);
  const displayMode = useModeStore((s) => s.displayMode);

  // 2. Get Camera Data
  const viewProjectionMatrix = useViewStore((s) => s.viewProjectionMatrix);
  const viewportSize = useViewStore((s) => s.viewportSize);

  const hasAffineMatrix =
    !!selectedKubeState && "affine_matrix" in selectedKubeState;

  // 3. Calculate 2D Screen Position
  const screenPos = useMemo(() => {
    if (!selectedKubeState || !viewProjectionMatrix || !viewportSize)
      return null;
    if (!hasAffineMatrix) {
      return {
        x: viewportSize.width / 2,
        y: viewportSize.height / 2,
      };
    }

    const affine = selectedKubeState.affine_matrix;
    if (!affine || affine.length !== 4 || affine[0].length !== 4) return null;

    // Reconstruct the 4x4 matrix from the Python nested array
    const mat = new THREE.Matrix4();
    mat.set(
      affine[0][0],
      affine[0][1],
      affine[0][2],
      affine[0][3],
      affine[1][0],
      affine[1][1],
      affine[1][2],
      affine[1][3],
      affine[2][0],
      affine[2][1],
      affine[2][2],
      affine[2][3],
      affine[3][0],
      affine[3][1],
      affine[3][2],
      affine[3][3],
    );

    // Extract the anchor point in 3D world space (the origin of the affine matrix)
    const worldVector = new THREE.Vector3();
    worldVector.setFromMatrixPosition(mat);

    // Apply the camera's matrix to get Normalized Device Coordinates (NDC) [-1 to 1]
    worldVector.applyMatrix4(viewProjectionMatrix);

    // If Z is outside [-1, 1], the point is behind the camera or clipped out of view
    if (worldVector.z < -1 || worldVector.z > 1) return null;

    // Map NDC to actual screen pixels
    return {
      x: (worldVector.x * 0.5 + 0.5) * viewportSize.width,
      y: (worldVector.y * -0.5 + 0.5) * viewportSize.height,
    };
  }, [selectedKubeState, viewProjectionMatrix, viewportSize, hasAffineMatrix]);

  // Early returns if data is missing or out of bounds
  if (displayMode !== "3D") return null;
  if (!selectedKubeState || !screenPos) return null;

  const panel = (() => {
    switch (selectedKubeState.__brand) {
      case "objective_kube_state":
        return <ObjectiveKubePanel data={selectedKubeState} />;
      case "detector_kube_state":
        return <DetectorKubePanel data={selectedKubeState} />;
      case "filter_kube_state":
        return <FilterKubePanel data={selectedKubeState} />;
      case "illumination_kube_state":
        return <IlluminationKubePanel data={selectedKubeState} />;
      case "stage_kube_state":
        return <StageKubePanel data={selectedKubeState} />;
      case "dichroic_kube_state":
        return <DichroicKubePanel data={selectedKubeState} />;
      case "filter_bank_kube_state":
        return <FilterBankKubePanel data={selectedKubeState} />;
      case "generic_kube_state":
        return <GenericKubePanel data={selectedKubeState} />;
      default:
        return null;
    }
  })();

  if (!panel) return null;

  return (
    <Card
      // Absolute positioning, centered on the calculated pixel coordinate
      className="absolute text-xs scale-90 z-20  shadow-2xl backdrop-blur-md p-4 flex flex-col"
      style={{ left: screenPos.x, top: screenPos.y }}
    >
      {panel}
    </Card>
  );
};
