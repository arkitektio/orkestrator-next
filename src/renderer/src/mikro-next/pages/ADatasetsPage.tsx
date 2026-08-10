import { Explainer } from "@/components/explainer/Explainer";
import { MikroADataset } from "@/linkers";
import React from "react";
import { useADatasetFilterBar } from "../components/filter/ADatasetFilterBar";
import ADatasetList from "../components/lists/ADatasetList";

export type IADatasetsScreenProps = {};

const Page: React.FC<IADatasetsScreenProps> = () => {
  const { filters, ordering, actions } = useADatasetFilterBar();

  return (
    <MikroADataset.ListPage title="Spatial Datasets" pageActions={actions}>
      <div className="p-3 flex flex-col gap-3">
        <Explainer
          title="Spatial Datasets"
          description="N-dimensional arrays with named dimensions. trinsic coordinate system, their physical units on the calibrated spaces they also live in, and their pyramid levels are data arrays."
        />
        <ADatasetList filters={filters} ordering={ordering} />
      </div>
    </MikroADataset.ListPage>
  );
};

export default Page;
