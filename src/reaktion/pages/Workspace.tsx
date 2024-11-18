import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card } from "@/components/ui/card";
import { FlussFlow, FlussWorkspace } from "@/linkers";
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
      title={
        <div className="flex flex-row gap-2">
          {data?.workspace?.title}
          <p className="text-md font-light text-muted-foreground">
            {data?.workspace.latestFlow?.title}
          </p>
        </div>
      }
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
            Versions: (
              <div className="p-4 flex flex-col gap-2">
                {data?.workspace.flows.map((fl) => (
                  <FlussFlow.Smart object={fl.id}>
                    <Card className="p-4">
                      <FlussFlow.DetailLink object={fl.id}>
                        {fl.title}
                      </FlussFlow.DetailLink>
                    </Card>
                  </FlussFlow.Smart>
                ))}
              </div>
            ),
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
