import { WithMediaUrl } from "@/lib/datalayer/rekuestAccess";
import { Center, Html, TransformControls, useGLTF } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Group, Matrix4 } from "three";
import { MediaStore, SpacePlacementFragment, useUpdatePlacementMutation } from "../api/graphql";
import { useSpaceScene } from "./context";

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


  useEffect(() => {
  if (!meshRef.current) return;

  const flat = placement.affineMatrix.flat() as number[];

  // 1. Load the Row-Major matrix and transpose it for Three.js
  const m = new Matrix4().fromArray(flat).transpose();

  // 2. Apply this matrix to the object
  meshRef.current.matrix.copy(m);

  // 3. IMPORTANT: Decompose the matrix back into pos/rot/scale
  // This allows TransformControls to "see" the current state
  meshRef.current.matrix.decompose(
    meshRef.current.position,
    meshRef.current.quaternion,
    meshRef.current.scale
  );

  // 4. Re-enable autoUpdate so TransformControls can move it
  meshRef.current.matrixAutoUpdate = true;

  // 5. Force a world update
  meshRef.current.updateMatrixWorld(true);

}, [placement.affineMatrix, placement.id]);





  const handleTransformEnd = useCallback(() => {
    if (!meshRef.current) return;
    // Read the matrix that TransformControls wrote into the object
    const elems = meshRef.current.matrix.elements; // column-major
    // Convert back to row-major 4×4 for the backend
    const affineMatrix = [
      [elems[0], elems[4], elems[8],  elems[12]],
      [elems[1], elems[5], elems[9],  elems[13]],
      [elems[2], elems[6], elems[10], elems[14]],
      [elems[3], elems[7], elems[11], elems[15]],
    ];
    updateSpacePlacement({
      variables: {
        input: {
          id: placement.id,
          affineMatrix,
        },
      },
    });
  }, [placement.id, updateSpacePlacement]);

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
  const selectPlacement = useSpaceScene((s) => s.selectPlacement);
  const isSelected = selectedId === placement.id;

  const [updateSpacePlacement] = useUpdatePlacementMutation();


useEffect(() => {
  if (!meshRef.current) return;

  const flat = placement.affineMatrix.flat() as number[];

  // 1. Load the Row-Major matrix and transpose it for Three.js
  const m = new Matrix4().fromArray(flat).transpose();

  // 2. Apply this matrix to the object
  meshRef.current.matrix.copy(m);

  // 3. IMPORTANT: Decompose the matrix back into pos/rot/scale
  // This allows TransformControls to "see" the current state
  meshRef.current.matrix.decompose(
    meshRef.current.position,
    meshRef.current.quaternion,
    meshRef.current.scale
  );

  // 4. Re-enable autoUpdate so TransformControls can move it
  meshRef.current.matrixAutoUpdate = true;

  // 5. Force a world update
  meshRef.current.updateMatrixWorld(true);

}, [placement.affineMatrix, placement.id]);




  const handleTransformEnd = useCallback(() => {
    if (!meshRef.current) return;
    const elems = meshRef.current.matrix.elements; // column-major
    const affineMatrix = [
      [elems[0], elems[4], elems[8],  elems[12]],
      [elems[1], elems[5], elems[9],  elems[13]],
      [elems[2], elems[6], elems[10], elems[14]],
      [elems[3], elems[7], elems[11], elems[15]],
    ];
    updateSpacePlacement({
      variables: {
        input: {
          id: placement.id,
          affineMatrix,
        },
      },
    });
  }, [placement.id, updateSpacePlacement]);

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
