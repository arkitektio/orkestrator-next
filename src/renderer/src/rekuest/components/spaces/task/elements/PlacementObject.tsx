import { SpaceGroupPlacement } from "../types";
import { useSpaceViewStore } from "../store";
import * as React from "react";
import { useEffect, useCallback } from "react";
import { Group, Matrix4 } from "three";
import { MediaStoreFragment } from "@/rekuest/api/graphql";
import { WithMediaUrl } from "@/lib/datalayer/rekuestAccess";
import { Center, useGLTF } from "@react-three/drei";





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
      {placement.model?.file ? (
        <WithMediaUrl media={placement.model.file as unknown as MediaStoreFragment}>
          {(url: string) => <PlacementModel url={url} />}
        </WithMediaUrl>
      ) : (
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#6366f1" />
        </mesh>
      )}
    </group>
  );
};
