import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useState } from "react";
import { useGetDatasetQuery } from "../api/graphql";
import { DatasetListExplorer, DatasetExplorerToolbar, useDatasetExplorer } from "../components/explorer/DatasetListExplorer";
import { DatasetTableExplorer } from "../components/explorer/DatasetTableExplorer";
import { MikroDataset } from "@/linkers";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Komments } from "@/lok-next/components/komments/Komments";
import { useSelection } from "@/providers/selection/SelectionContext";

export type IRepresentationScreenProps = {};
export type ViewType = "list" | "icons";

export default asDetailQueryRoute(useGetDatasetQuery, ({ data }) => {
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
      object={data.dataset.id}
      pageActions={
        <div className="flex items-center space-x-4">
          <MikroDataset.Actions object={data.dataset.id} />
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
              <Komments identifier="@mikro/dataset" object={data.dataset.id} />
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
