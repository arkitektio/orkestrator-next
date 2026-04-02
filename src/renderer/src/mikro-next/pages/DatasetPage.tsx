import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { MikroDataset } from "@/linkers";
import { Komments } from "@/lok-next/components/komments/Komments";
import { useSelection } from "@/providers/selection/SelectionContext";
import { useState } from "react";
import { useGetDatasetQuery } from "../api/graphql";
import { DatasetExplorerToolbar, DatasetListExplorer, useDatasetExplorer } from "../components/explorer/DatasetListExplorer";
import { DatasetTableExplorer } from "../components/explorer/DatasetTableExplorer";

export type ViewType = "list" | "icons";
 const TPage = asDetailQueryRoute(useGetDatasetQuery, ({ data }) => {
  const [viewType, setViewType] = useState<ViewType>("icons");
  const { selection, bselection } = useSelection();

  if (viewType === "list") {
    return <DatasetTableExplorer dataset={data.dataset} setView={setViewType} />;
  }

  // Use the explorer hook to get state for the toolbar
  const explorerState = useDatasetExplorer(data.dataset);

  return (
    <MikroDataset.ModelPage
      title={data.dataset?.name}
      object={data.dataset}
      pageActions={
        <div className="flex items-center space-x-4">
          <MikroDataset.Actions object={data.dataset} />
          <DatasetExplorerToolbar
            {...explorerState}
            dataset={data.dataset}
            selection={selection}
            bselection={bselection}
          />
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: (
              <Komments identifier="@mikro/dataset" object={data.dataset} />
            ),
          }}
        />
      }
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
