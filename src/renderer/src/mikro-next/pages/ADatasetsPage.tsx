import { Explainer } from "@/components/explainer/Explainer";
import { MikroADataset } from "@/linkers";
import React from "react";
import { useADatasetFilterBar } from "../components/filter/ADatasetFilterBar";
import ADatasetList from "../components/lists/ADatasetList";

export type IADatasetsScreenProps = {};

const Page: React.FC<IADatasetsScreenProps> = () => {
  const { filters, ordering, actions } = useADatasetFilterBar();

  return (
    <MikroADataset.ListPage title="Array Datasets" pageActions={actions}>
      <div className="p-3 flex flex-col gap-3">
        <Explainer
          title="Array Datasets"
          description="N-dimensional arrays with named dimensions. Their structure lives on the axes of their intrinsic coordinate system, their physical units on their calibrations, and their pyramid levels are data arrays."
        />
        <ADatasetList filters={filters} ordering={ordering} />
      </div>
    </MikroADataset.ListPage>
  );
};

export default Page;
