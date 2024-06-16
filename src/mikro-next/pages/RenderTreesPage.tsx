import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import RenderTreeList from "../components/lists/RenderTreeList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>} title="RenderTrees">
      <RenderTreeList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
