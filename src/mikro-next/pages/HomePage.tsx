import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import DatasetList from "../components/lists/DatasetList";
import ImageList from "../components/lists/ImageList";
import RenderTreeList from "../components/lists/RenderTreeList";
import StageList from "../components/lists/StageList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>} title="Data">
      <ImageList pagination={{ limit: 30 }} />
      <DatasetList pagination={{ limit: 30 }} />
      <StageList pagination={{ limit: 30 }} />
      <RenderTreeList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
