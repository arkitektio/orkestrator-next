import { Explainer } from "@/components/explainer/Explainer";
import { MikroADataset } from "@/linkers";
import React from "react";
import ADatasetList from "../components/lists/ADatasetList";

export type IADatasetsScreenProps = {};

const Page: React.FC<IADatasetsScreenProps> = () => {
  return (
    <MikroADataset.ListPage title="Array Datasets">
      <div className="p-3">
        <Explainer
          title="Array Datasets"
          description="N-dimensional arrays with named dimensions. Their structure lives on the axes of their intrinsic coordinate system, their physical units on their calibrations, and their pyramid levels are data arrays."
        />
        <ADatasetList pagination={{ limit: 30 }} />
      </div>
    </MikroADataset.ListPage>
  );
};

export default Page;
