import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import React from "react";
import MeshList from "../components/lists/MeshList";
import { MikroMesh } from "@/linkers";

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
