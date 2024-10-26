import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import StageList from "../components/lists/StageList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>} title="Stages">
      <div className="p-3">
        <Explainer
          title="Stages"
          description="Stages are physical spaces where your samples are placed for imaging. They allow you to look at multiple images at once, given their physical positions
          in the stage."
        />
        <StageList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default ImagesPage;
