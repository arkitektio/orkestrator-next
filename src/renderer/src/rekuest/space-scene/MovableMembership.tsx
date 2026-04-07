import { useRef, useCallback } from "react";
import { TransformControls, Center, Html, useGLTF } from "@react-three/drei";
import { Group } from "three";
import { useSpaceScene } from "./context";
import { buildAffineMatrix, MembershipEntry } from "./store";
import { MediaStore, useUpdateSpaceMembershipMutation } from "../api/graphql";
import { WithMediaUrl } from "@/lib/datalayer/rekuestAccess";

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

export const MovableMembership = ({
  membership,
}: {
  membership: MembershipEntry;
}) => {
  const meshRef = useRef<Group>(null!);
  const selectedId = useSpaceScene((s) => s.selectedMembershipId);
  const updateTransform = useSpaceScene((s) => s.updateMembershipTransform);
  const selectMembership = useSpaceScene((s) => s.selectMembership);
  const isSelected = selectedId === membership.id;

  const [updateSpaceMembership] = useUpdateSpaceMembershipMutation();

  const handleTransformEnd = useCallback(() => {
    if (!meshRef.current) return;
    const { x, y, z } = meshRef.current.position;
    const pos: [number, number, number] = [x, y, z];

    // Update local store immediately
    updateTransform(membership.id, pos);

    // Persist to backend
    updateSpaceMembership({
      variables: {
        input: {
          id: membership.id,
          affineMatrix: buildAffineMatrix(
            pos,
            membership.rotation,
            membership.scale,
          ),
        },
      },
    });
  }, [membership.id, membership.rotation, membership.scale, updateTransform, updateSpaceMembership]);

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
        position={membership.position}
        onClick={(e) => {
          e.stopPropagation();
          selectMembership(membership.id);
        }}
      >
        <WithMediaUrl media={membership.media as unknown as MediaStore}>
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
            <div className="font-medium">{membership.name}</div>
            <div className="text-white/60">{membership.agentName}</div>
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

export const MembershipFallback = ({
  membership,
}: {
  membership: MembershipEntry;
}) => {
  const meshRef = useRef<Group>(null!);
  const selectedId = useSpaceScene((s) => s.selectedMembershipId);
  const updateTransform = useSpaceScene((s) => s.updateMembershipTransform);
  const selectMembership = useSpaceScene((s) => s.selectMembership);
  const isSelected = selectedId === membership.id;

  const [updateSpaceMembership] = useUpdateSpaceMembershipMutation();

  const handleTransformEnd = useCallback(() => {
    if (!meshRef.current) return;
    const { x, y, z } = meshRef.current.position;
    const pos: [number, number, number] = [x, y, z];
    updateTransform(membership.id, pos);
    updateSpaceMembership({
      variables: {
        input: {
          id: membership.id,
          affineMatrix: buildAffineMatrix(
            pos,
            membership.rotation,
            membership.scale,
          ),
        },
      },
    });
  }, [membership.id, membership.rotation, membership.scale, updateTransform, updateSpaceMembership]);

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
        position={membership.position}
        onClick={(e) => {
          e.stopPropagation();
          selectMembership(membership.id);
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
            <div className="font-medium">{membership.name}</div>
            <div className="text-white/60">{membership.agentName}</div>
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
