import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import { UploadZone } from "@/components/upload/zone";
import { useBigFileUpload } from "@/datalayer/hooks/useUpload";
import { useCreateFile } from "@/lib/mikro/hooks";
import React from "react";
import DatasetList from "../components/lists/DatasetList";
import FileList from "../components/lists/FileList";
import ImageList from "../components/lists/ImageList";
import RenderedPlotList from "../components/lists/RenderedPlotList";
import RenderTreeList from "../components/lists/RenderTreeList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const performDataLayerUpload = useBigFileUpload();
  const createFile = useCreateFile();

  return (
    <PageLayout actions={<></>} title="Data">
      <div className="flex flex-col w-full h-full">
        <ImageList pagination={{ limit: 30 }} filters={{ notDerived: true }} />
        <Separator className="my-4" />
        <DatasetList pagination={{ limit: 30 }} />
        <Separator className="my-4" />
        <FileList pagination={{ limit: 30 }} />
        <RenderTreeList pagination={{ limit: 30 }} />
        <UploadZone
          uploadFile={performDataLayerUpload}
          createFile={createFile}
        />
        <RenderedPlotList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default Page;
