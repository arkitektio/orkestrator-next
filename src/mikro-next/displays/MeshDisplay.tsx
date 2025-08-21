import { MikroMesh } from "@/linkers";
import { useDetailMeshQuery } from "@/mikro-next/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";

import { useResolve } from "@/datalayer/hooks/useResolve";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { DisplayWidgetProps } from "@/lib/display/registry";

const ThreeMeshRenderer = ({ url }: { url: string }) => {
  const obj = useLoader(OBJLoader, url);
  return <primitive object={obj} dispose={null} />;
};

export function MeshRenderer({ url }: { url: string }) {
  return (
    <Canvas style={{ height: "100%", width: "100%" }}>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1} position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <>
          <OrbitControls />
          <ThreeMeshRenderer url={url} />
        </>
      </Suspense>
    </Canvas>
  );
}

export const MeshWidget = (props: DisplayWidgetProps) => {
  const { data } = useDetailMeshQuery({
    variables: {
      id: props.object,
    },
  });

  const resolve = useResolve();

  return (
    <MikroMesh.DetailLink className="w-full h-full" object={props.object}>
      {data?.mesh.name}
      {data?.mesh.store.presignedUrl && (
        <MeshRenderer url={resolve(data?.mesh.store.presignedUrl)} />
      )}
    </MikroMesh.DetailLink>
  );
};
