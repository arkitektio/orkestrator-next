import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MikroFolder } from "@/linkers";
import { useState } from "react";
import { useGetFolderQuery } from "../api/graphql";
import { FolderListExplorer, useFolderExplorer } from "../components/explorer/FolderListExplorer";
import { FolderTableExplorer } from "../components/explorer/FolderTableExplorer";

export type ViewType = "list" | "icons";
 const TPage = asDetailQueryRoute(useGetFolderQuery, ({ data }) => {
  const [viewType, setViewType] = useState<ViewType>("icons");

  if (viewType === "list") {
    return <FolderTableExplorer folder={data.folder} setView={setViewType} />;
  }

  const explorerState = useFolderExplorer(data.folder);

  return (
    <MikroFolder.ModelPage
      title={data.folder?.name}
      object={data.folder}
    >
      <FolderListExplorer
        folder={data.folder}
        setView={setViewType}
        explorerState={explorerState}
      />
    </MikroFolder.ModelPage>
  );
});


export default TPage;
