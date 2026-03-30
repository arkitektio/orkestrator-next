import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelectionStore } from "../store/layerStore";
import { useViewStore } from "../store/viewStore";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { SceneFragment, SceneLayerFragment, UpdateLaterDocument, UpdateLaterMutation, UpdateLaterMutationVariables } from "@/mikro-next/api/graphql";
import { useMikro } from "@/app/Arkitekt";

const DimBadge = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex items-center gap-1">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-mono font-semibold">{value ?? "—"}</span>
  </div>
);

const LayerDimForm = ({ layer }: { layer: SceneLayerFragment }) => {
  const client = useMikro();
  const [rolling, setRolling] = useState(false);

  const rollDimensions = async () => {
    setRolling(true);
    try {
      // Collect assigned dims in order: [xDim, yDim, zDim, intensityDim]
      const keys = ["xDim", "yDim", "zDim", "intensityDim"] as const;
      const values = keys.map((k) => layer[k]);
      // Roll: shift values left by one position
      const rolled = [...values.slice(1), values[0]];

      await client.mutate<UpdateLaterMutation, UpdateLaterMutationVariables>({
        mutation: UpdateLaterDocument,
        variables: {
          input: {
            id: layer.id,
            xDim: rolled[0],
            yDim: rolled[1],
            zDim: rolled[2],
            intensityDim: rolled[3],
          },
        },
      });
    } finally {
      setRolling(false);
    }
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
        disabled={rolling}
      >
        {rolling ? "Rolling..." : "Roll Dims"}
      </Button>
    </div>
  );
};

export const ScenePanel = (props: { scene: SceneFragment }) => {
  const selectedFrameId = useSelectionStore((s) => s.selectedLayerId);

  const viewProjectionMatrix = useViewStore((s) => s.viewProjectionMatrix);
  const viewportSize = useViewStore((s) => s.viewportSize);

  const selectedLayer = props.scene.layers.find((l) => l.id === selectedFrameId);
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

  if (!screenPos || !selectedLayer) {
    return null;
  }

  return (
    <Card
      className="absolute text-xs scale-90 z-20 shadow-2xl backdrop-blur-md p-4 flex flex-col gap-2"
      style={{ left: screenPos.x, top: screenPos.y }}
    >
      <LayerDimForm layer={selectedLayer} />
    </Card>
  );
};
