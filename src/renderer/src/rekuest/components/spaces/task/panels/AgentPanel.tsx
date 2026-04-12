// ── Agent Panel (projected from 3D → 2D, rendered outside Canvas) ────

import { useMemo } from "react";
import { useSpaceViewStore } from "../store";
import { SpaceGroupPlacement } from "../types";
import * as THREE from "three";
import { Card } from "@/components/ui/card";
import { RekuestAgent } from "@/linkers";



export const AgentPanel = ({ placements }: { placements: SpaceGroupPlacement[] }) => {
  const selectedId = useSpaceViewStore((s) => s.selectedPlacementId);
  const vpMatrix = useSpaceViewStore((s) => s.viewProjectionMatrix);
  const vpSize = useSpaceViewStore((s) => s.viewportSize);
  const selectPlacement = useSpaceViewStore((s) => s.selectPlacement);

  const selected = placements.find((p) => p.id === selectedId);

  const screenPos = useMemo(() => {
    if (!selected || !vpMatrix || !vpSize) return null;

    const mat = new THREE.Matrix4();
    const affine = selected.affineMatrix as number[][];
    if (affine && affine.length >= 4) {
      mat.set(
        affine[0][0], affine[0][1], affine[0][2], affine[0][3],
        affine[1][0], affine[1][1], affine[1][2], affine[1][3],
        affine[2][0], affine[2][1], affine[2][2], affine[2][3],
        affine[3][0], affine[3][1], affine[3][2], affine[3][3],
      );
    }

    const worldVec = new THREE.Vector3();
    worldVec.setFromMatrixPosition(mat);
    worldVec.applyMatrix4(vpMatrix);

    if (worldVec.z < -1 || worldVec.z > 1) return null;

    return {
      x: (worldVec.x * 0.5 + 0.5) * vpSize.width,
      y: (worldVec.y * -0.5 + 0.5) * vpSize.height,
    };
  }, [selected, vpMatrix, vpSize]);

  if (!selected || !screenPos) return null;

  return (
    <Card
      className="absolute z-20 shadow-2xl backdrop-blur-md p-3 flex flex-col gap-2 min-w-[160px] pointer-events-auto"
      style={{
        left: screenPos.x,
        top: screenPos.y,
        transform: "translate(-50%, -110%)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-sm">{selected.agentName}</div>
          <div className="text-[11px] text-muted-foreground">{selected.name}</div>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground text-xs"
          onClick={() => selectPlacement(null)}
        >
          ✕
        </button>
      </div>
      <RekuestAgent.DetailLink
        object={{ id: selected.agentId }}
        className="text-xs text-primary hover:underline"
      >
        Open Agent →
      </RekuestAgent.DetailLink>
    </Card>
  );
};
