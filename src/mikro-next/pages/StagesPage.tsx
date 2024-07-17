import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import StageList from "../components/lists/StageList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>} title="Stages">
      haahah
      <StageList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default ImagesPage;
