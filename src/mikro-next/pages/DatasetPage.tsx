import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useState } from "react";
import { useGetDatasetQuery } from "../api/graphql";
import { DatasetListExplorer } from "../components/explorer/DatasetListExplorer";
import { DatasetTableExplorer } from "../components/explorer/DatasetTableExplorer";

export type IRepresentationScreenProps = {};
export type ViewType = "list" | "icons";

export default asDetailQueryRoute(useGetDatasetQuery, ({ data }) => {
  const [viewType, setViewType] = useState<ViewType>("icons");

  return (
    <>
      {viewType === "list" ? (
        <DatasetTableExplorer dataset={data.dataset} setView={setViewType} />
      ) : (
        <DatasetListExplorer dataset={data.dataset} setView={setViewType} />
      )}
    </>
  );
});
