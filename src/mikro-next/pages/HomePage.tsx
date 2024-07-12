import { PageLayout } from "@/components/layout/PageLayout";
import { UploadZone } from "@/components/upload/zone";
import { useBigFileUpload } from "@/datalayer/hooks/useUpload";
import { useCreateFile } from "@/lib/mikro/hooks";
import React from "react";
import DatasetList from "../components/lists/DatasetList";
import FileList from "../components/lists/FileList";
import ImageList from "../components/lists/ImageList";
import RenderTreeList from "../components/lists/RenderTreeList";
import StageList from "../components/lists/StageList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const performDataLayerUpload = useBigFileUpload();
  const createFile = useCreateFile();

  return (
    <PageLayout actions={<></>} title="Data">
      <div className="flex flex-col w-full h-full">
        <ImageList pagination={{ limit: 30 }} />
        <DatasetList pagination={{ limit: 30 }} />
        <StageList pagination={{ limit: 30 }} />
        <FileList pagination={{ limit: 30 }} />
        <RenderTreeList pagination={{ limit: 30 }} />
        <UploadZone
          uploadFile={performDataLayerUpload}
          createFile={createFile}
        />
      </div>
    </PageLayout>
  );
};

export default Page;
