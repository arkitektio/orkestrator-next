import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroFile, MikroImage, MikroMesh } from "@/linkers";
import {
  useDetailMeshQuery,
  useGetFileQuery,
  usePinStageMutation,
} from "../api/graphql";

import { Canvas, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

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
          <OrbitControls enablePan enableRotate enableZoom />
          <ThreeMeshRenderer url={url} />
        </>
      </Suspense>
    </Canvas>
  );
}

export default asDetailQueryRoute(useDetailMeshQuery, ({ data, refetch }) => {
  const [pinStage] = usePinStageMutation();

  const downloadFile = () => {
    if (data?.mesh?.store.presignedUrl) {
      const url = resolve(data.mesh.store.presignedUrl);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.mesh.name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resolve = useResolve();
  return (
    <MikroMesh.ModelPage
      actions={<MikroMesh.Actions object={data.mesh.id} />}
      object={data.mesh.id}
      title={data.mesh.name}
      sidebars={
        <MultiSidebar
          map={{ Comments: <MikroMesh.Komments object={data.mesh.id} /> }}
        />
      }
      pageActions={
        <>
          <Button onClick={downloadFile} variant="outline">
            Download
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-1 mb-3 h-full">
        <MikroMesh.DetailLink object={data.mesh.id} className={"text-3xl"}>
          {data?.mesh?.name}
        </MikroMesh.DetailLink>
        <div className="flex-grow">
          <MeshRenderer url={resolve(data?.mesh?.store.presignedUrl)} />
        </div>
      </div>
    </MikroMesh.ModelPage>
  );
});
