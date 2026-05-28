import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { MikroDataset } from "@/linkers";
import { Komments } from "@/lok-next/components/komments/Komments";
import { useState } from "react";
import { useGetDatasetQuery } from "../api/graphql";
import { DatasetListExplorer, useDatasetExplorer } from "../components/explorer/DatasetListExplorer";
import { DatasetTableExplorer } from "../components/explorer/DatasetTableExplorer";

export type ViewType = "list" | "icons";
 const TPage = asDetailQueryRoute(useGetDatasetQuery, ({ data }) => {
  const [viewType, setViewType] = useState<ViewType>("icons");

  if (viewType === "list") {
    return <DatasetTableExplorer dataset={data.dataset} setView={setViewType} />;
  }

  const explorerState = useDatasetExplorer(data.dataset);

  return (
    <MikroDataset.ModelPage
      title={data.dataset?.name}
      object={data.dataset}
    >
      <DatasetListExplorer
        dataset={data.dataset}
        setView={setViewType}
        explorerState={explorerState}
      />
    </MikroDataset.ModelPage>
  );
});


export default TPage;
