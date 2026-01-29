import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import StageList from "../components/lists/StageList";
import { MikroMesh, MikroStage } from "@/linkers";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <MikroStage.ListPage actions={<></>} title="Stages">
      <div className="p-3">
        <Explainer
          title="Stages"
          description="Stages are physical spaces where your samples are placed for imaging. They allow you to look at multiple images at once, given their physical positions
          in the stage."
        />
        <StageList pagination={{ limit: 30 }} />
      </div>
    </MikroStage.ListPage>
  );
};

export default ImagesPage;
