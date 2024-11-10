import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { FlussWorkspace } from "@/linkers";
import {
  useUpdateWorkspaceMutation,
  useWorkspaceQuery,
  WorkspaceCarouselDocument,
  WorkspacesDocument,
} from "@/reaktion/api/graphql";
import { EditFlow } from "@/reaktion/edit/EditFlow";
import { DeployPane } from "../edit/components/deploy/DeployPane";

export default asDetailQueryRoute(useWorkspaceQuery, ({ data }) => {
  const [saveFlow] = useUpdateWorkspaceMutation({
    refetchQueries: [WorkspacesDocument, WorkspaceCarouselDocument],
  });

  return (
    <FlussWorkspace.ModelPage
      title={data?.workspace.latestFlow?.title || "No title"}
      object={data.workspace.id}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <FlussWorkspace.Komments object={data.workspace.id} />,
            Deployments: (
              <>
                {data?.workspace.latestFlow && (
                  <DeployPane flow={data?.workspace.latestFlow} />
                )}
              </>
            ),
            Versions: <div className="p-4">Versions</div>,
          }}
        />
      }
    >
      {data?.workspace.latestFlow && (
        <EditFlow
          flow={data?.workspace.latestFlow}
          onSave={(e) => {
            console.log("saving flow", e);
            saveFlow({
              variables: {
                id: data.workspace.id,
                graph: e,
              },
            })
              .then((e) => {
                console.log(e);
              })
              .catch((e) => {
                console.log(e);
              });
          }}
        />
      )}
    </FlussWorkspace.ModelPage>
  );
});
