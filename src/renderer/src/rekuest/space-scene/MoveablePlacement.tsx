import { WithMediaUrl } from "@/lib/datalayer/rekuestAccess";
import { Center, Html, TransformControls, useGLTF } from "@react-three/drei";
import { useCallback, useMemo, useRef } from "react";
import { Group, Matrix4 } from "three";
import { MediaStore, SpacePlacementFragment, useUpdatePlacementMutation } from "../api/graphql";
import { useSpaceScene } from "./context";
import { e } from "node_modules/@platejs/basic-nodes/dist/BaseHeadingPlugin-nWtdPomn";

const MembershipModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene.clone()} />
    </Center>
  );
};

const FallbackBox = () => (
  <>
    <boxGeometry args={[0.6, 0.6, 0.6]} />
    <meshStandardMaterial color="#6366f1" />
  </>
);

export const MoveablePlacement = ({
  placement,
}: {
  placement: SpacePlacementFragment;
}) => {
  const meshRef = useRef<Group>(null!);
  const selectedId = useSpaceScene((s) => s.selectedPlacementId);
  const updateTransform = useSpaceScene((s) => s.updatePlacementTransform);
  const selectPlacement = useSpaceScene((s) => s.selectPlacement);
  const isSelected = selectedId === placement.id;

  const [updateSpacePlacement] = useUpdatePlacementMutation();


  const matrix = useMemo(() =>
    new Matrix4().fromArray(placement.affineMatrix.flat() as unknown as number[])
    , [placement.affineMatrix]);


  console.log(matrix)




  const handleTransformEnd = useCallback((e) => {
    console.log(e)

    // Persist to backend
    updateSpacePlacement({
      variables: {
        input: {
          id: placement.id,
          affineMatrix: placement.affineMatrix
        },
      },
    });
  }, [placement.id, placement.affineMatrix, updateSpacePlacement]);

  return (
    <>
      {isSelected && (
        <TransformControls
          object={meshRef}
          mode="translate"
          onMouseUp={handleTransformEnd}
        />
      )}
      <group
        ref={meshRef}
        matrix={matrix}
        matrixAutoUpdate={true}
        onClick={(e) => {
          e.stopPropagation();
          selectPlacement(placement.id);
        }}
      >
        <WithMediaUrl media={placement.model?.file as unknown as MediaStore}>
          {(url: string) => <MembershipModel url={url} />}
        </WithMediaUrl>

        {/* Label floating above */}
        <Html
          position={[0, 1.2, 0]}
          center
          distanceFactor={6}
          style={{ pointerEvents: "none" }}
        >
          <div className="whitespace-nowrap rounded bg-black/70 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
            <div className="font-medium">{placement.name}</div>
            <div className="text-white/60">{placement.agent.id}</div>
          </div>
        </Html>

        {/* Selection ring */}
        {isSelected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <ringGeometry args={[0.8, 1, 32]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
          </mesh>
        )}
      </group>
    </>
  );
};

export const PlacementFallback = ({
  placement,
}: {
  placement: SpacePlacementFragment;
}) => {
  const meshRef = useRef<Group>(null!);
  const selectedId = useSpaceScene((s) => s.selectedPlacementId);
  const updateTransform = useSpaceScene((s) => s.updatePlacementTransform);
  const selectPlacement = useSpaceScene((s) => s.selectPlacement);
  const isSelected = selectedId === placement.id;

  const [updateSpacePlacement] = useUpdatePlacementMutation();

  const handleTransformEnd = useCallback((e) => {
    console.log(e)
    updateSpacePlacement({
      variables: {
        input: {
          id: placement.id,
          affineMatrix: placement.affineMatrix
        },
      },
    });
  }, [placement.id, placement.affineMatrix, updateSpacePlacement  ]);

  return (
    <>
      {isSelected && (
        <TransformControls
          object={meshRef}
          mode="translate"
          onMouseUp={handleTransformEnd}
        />
      )}
      <group
        ref={meshRef}
        matrix={placement.affineMatrix}
        onClick={(e) => {
          e.stopPropagation();
          selectPlacement(placement.id);
        }}
      >
        <mesh castShadow>
          <FallbackBox />
        </mesh>
        <Html
          position={[0, 0.8, 0]}
          center
          distanceFactor={6}
          style={{ pointerEvents: "none" }}
        >
          <div className="whitespace-nowrap rounded bg-black/70 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
            <div className="font-medium">{placement.name}</div>
            <div className="text-white/60">{placement.agent.id}</div>
          </div>
        </Html>
        {isSelected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <ringGeometry args={[0.8, 1, 32]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
          </mesh>
        )}
      </group>
    </>
  );
};
