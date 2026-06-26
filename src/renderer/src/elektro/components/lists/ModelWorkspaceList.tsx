import { createList } from "@/components/layout/createList";
import { useListModelWorkspacesQuery } from "@/elektro/api/graphql";
import { ElektroModelWorkspace } from "@/linkers";
import ModelWorkspaceCard from "../cards/ModelWorkspaceCard";

const TList = createList({
  useHook: useListModelWorkspacesQuery,
  dataKey: "modelWorkspaces",
  ItemComponent: ModelWorkspaceCard,
  title: "Model Workspaces",
  smart: ElektroModelWorkspace,
});
export default TList;
