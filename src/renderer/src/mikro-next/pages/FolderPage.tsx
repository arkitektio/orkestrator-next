import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Sidebars } from "@/components/layout/Sidebars";
import { MikroFolder } from "@/linkers";
import { useState } from "react";
import { useGetFolderQuery } from "../api/graphql";
import { FolderListExplorer, useFolderExplorer } from "../components/explorer/FolderListExplorer";
import { FolderTableExplorer } from "../components/explorer/FolderTableExplorer";
import { FolderInfoSidebar } from "../components/sidebars/FolderInfoSidebar";

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
      // The contents fill the middle, everything *about* the folder lives in the
      // rail — the same split as the dataset pages. Only the icons view gets it:
      // the `list` branch above returns `FolderTableExplorer` without a
      // `ModelPage` at all, so it has no rail to hang a tab on.
      additionalSidebars={
        <Sidebars.Tab label="Info">
          <FolderInfoSidebar folder={data.folder} />
        </Sidebars.Tab>
      }
      defaultSidebar="Info"
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
