import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSelectionStore } from "../store/layerStore";
import { useViewStore } from "../store/viewStore";
import { useSceneStore } from "../store/sceneStore";
import { useMemo } from "react";
import * as THREE from "three";
import { SceneFragment, SceneLayerFragment } from "@/mikro-next/api/graphql";

const DimBadge = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex items-center gap-1">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-mono font-semibold">{value ?? "—"}</span>
  </div>
);

const LayerDimForm = ({
  layer,
  onUpdate,
}: {
  layer: SceneLayerFragment;
  onUpdate: (updatedLayer: SceneLayerFragment) => void;
}) => {
  const rollDimensions = () => {
    const keys = ["xDim", "yDim", "zDim", "intensityDim"] as const;
    const values = keys.map((k) => layer[k]);
    const rolled = [...values.slice(1), values[0]];
    onUpdate({
      ...layer,
      xDim: rolled[0] ?? layer.xDim,
      yDim: rolled[1] ?? layer.yDim,
      zDim: rolled[2] ?? null,
      intensityDim: rolled[3] ?? layer.intensityDim,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        <DimBadge label="X" value={layer.xDim} />
        <DimBadge label="Y" value={layer.yDim} />
        <DimBadge label="Z" value={layer.zDim} />
        <DimBadge label="I" value={layer.intensityDim} />
      </div>
      <Button
        variant="outline"
        size="xs"
        onClick={rollDimensions}
      >
        Roll Dims
      </Button>
    </div>
  );
};

const ContrastLimitForm = ({
  layer,
  onUpdate,
}: {
  layer: SceneLayerFragment;
  onUpdate: (updatedLayer: SceneLayerFragment) => void;
}) => {

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Contrast Limits</span>
      </div>
      <Button variant="outline" size="xs" onClick={() => onUpdate({ ...layer, climMin: 0.0, climMax: 0.2 })}>
        Reset
      </Button>


    </div>
  );
};

export const ScenePanel = (props) => {
  const selectedFrameId = useSelectionStore((s) => s.selectedLayerId);
  const updateLayer = useSceneStore((s) => s.updateLayer);
  const layers = useSceneStore((s) => s.layers);

  const viewProjectionMatrix = useViewStore((s) => s.viewProjectionMatrix);
  const viewportSize = useViewStore((s) => s.viewportSize);

  const selectedLayer = layers?.find((l) => l.id === selectedFrameId);
  const affineMatrix = selectedLayer?.affineMatrix;
  const hasAffineMatrix = !!affineMatrix;

  const screenPos = useMemo(() => {
    if (!selectedFrameId || !viewProjectionMatrix || !viewportSize)
      return null;

    const mat = new THREE.Matrix4();

    const affine = affineMatrix as number[][];
    if (affine) {
      mat.set(
        affine[0][0], affine[0][1], affine[0][2], affine[0][3],
        affine[1][0], affine[1][1], affine[1][2], affine[1][3],
        affine[2][0], affine[2][1], affine[2][2], affine[2][3],
        affine[3][0], affine[3][1], affine[3][2], affine[3][3],
      );
    }

    const worldVector = new THREE.Vector3();
    worldVector.setFromMatrixPosition(mat);
    worldVector.applyMatrix4(viewProjectionMatrix);

    if (worldVector.z < -1 || worldVector.z > 1) return null;

    return {
      x: (worldVector.x * 0.5 + 0.5) * viewportSize.width,
      y: (worldVector.y * -0.5 + 0.5) * viewportSize.height,
    };
  }, [affineMatrix, viewProjectionMatrix, viewportSize, hasAffineMatrix, selectedFrameId]);

  if (!screenPos) {
    return null;
  }

  return (
    <Card
      className="absolute text-xs scale-90 z-20 shadow-2xl backdrop-blur-md p-4 flex flex-col gap-2"
      style={{ left: screenPos.x, top: screenPos.y }}
    >
      <LayerDimForm layer={selectedLayer} onUpdate={updateLayer} />
      <ContrastLimitForm layer={selectedLayer} onUpdate={updateLayer} />
    </Card>
  );
};
