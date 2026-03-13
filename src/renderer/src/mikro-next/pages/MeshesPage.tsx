import { Button } from "@/components/ui/button";
import { MikroMesh } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import MeshList from "../components/lists/MeshList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <MikroMesh.ListPage
      title="Meshes"
      pageActions={
        <>
          <Button variant="outline" size="sm">
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </>
      }
    >
      <MeshList pagination={{ limit: 30 }} />
    </MikroMesh.ListPage>
  );
};

export default Page;
