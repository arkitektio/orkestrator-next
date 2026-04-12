import { SpaceGroupPlacement } from "../types";
import { useSpaceViewStore } from "../store";
import * as React from "react";
import { useEffect, useCallback, useMemo } from "react";
import { Group, Matrix4 } from "three";
import { MediaStoreFragment } from "@/rekuest/api/graphql";
import { WithMediaUrl } from "@/lib/datalayer/rekuestAccess";
import { Center, useGLTF } from "@react-three/drei";
import { InvertedHullOutline } from "./InvertedHullOutline";

const HULL_COLOR_ROOT = "#f59e0b"; // amber
const HULL_COLOR_ACTIVE = "#10b981"; // emerald
const HULL_COLOR_SELECTED = "#6366f1"; // indigo





const PlacementModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene.clone()} />
    </Center>
  );
};





export const PlacementObject = ({
  placement,
}: {
  placement: SpaceGroupPlacement;
}) => {
  const groupRef = React.useRef<Group>(null!);
  const selectPlacement = useSpaceViewStore((s) => s.selectPlacement);
  const isSelected = useSpaceViewStore((s) => s.selectedPlacementId === placement.id);
  const isActive = useSpaceViewStore((s) => s.activeAgentIds.has(placement.agentId));
  const isRoot = useSpaceViewStore(
    (s) => placement.isRoot === true || placement.agentId === s.rootAgentId,
  );

  const hullConfig = useMemo(() => {
    if (isRoot) return { enabled: true, color: HULL_COLOR_ROOT, thickness: 1.10, opacity: 0.8 };
    if (isSelected) return { enabled: true, color: HULL_COLOR_SELECTED, thickness: 1.10, opacity: 0.8 };
    if (isActive) return { enabled: true, color: HULL_COLOR_ACTIVE,  thickness: 1.10, opacity: 0.8 };
    return { enabled: false, color: HULL_COLOR_ACTIVE, thickness: 1.10, opacity: 0.8 };
  }, [isRoot, isSelected, isActive]);

  useEffect(() => {
    if (!groupRef.current || !placement.affineMatrix) return;
    const flat = placement.affineMatrix.flat() as number[];
    const m = new Matrix4().fromArray(flat).transpose();
    groupRef.current.matrix.copy(m);
    groupRef.current.matrix.decompose(
      groupRef.current.position,
      groupRef.current.quaternion,
      groupRef.current.scale,
    );
    groupRef.current.matrixAutoUpdate = true;
    groupRef.current.updateMatrixWorld(true);
  }, [placement.affineMatrix]);

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      selectPlacement(placement.id);
    },
    [placement.id, selectPlacement],
  );

  return (
    <group ref={groupRef} onClick={handleClick}>
      <InvertedHullOutline
        enabled={hullConfig.enabled}
        color={hullConfig.color}
        thickness={hullConfig.thickness}
        opacity={hullConfig.opacity}
      >
        {placement.model?.file ? (
          <WithMediaUrl media={placement.model.file as unknown as MediaStoreFragment}>
            {(url: string) => <PlacementModel url={url} />}
          </WithMediaUrl>
        ) : (
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color={isRoot ? "#f59e0b" : "#6366f1"} />
          </mesh>
        )}
      </InvertedHullOutline>
    </group>
  );
};
