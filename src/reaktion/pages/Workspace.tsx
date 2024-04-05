import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { FlussWorkspace } from "@/linkers";
import {
  useUpdateWorkspaceMutation,
  useWorkspaceQuery,
} from "@/reaktion/api/graphql";
import { EditFlow } from "@/reaktion/edit/EditFlow";
import { withFluss } from "@jhnnsrs/fluss-next";

export default asDetailQueryRoute(withFluss(useWorkspaceQuery), ({ data }) => {
  const [saveFlow] = withFluss(useUpdateWorkspaceMutation)();
  return (
    <ModelPageLayout
      title={data?.workspace.latestFlow?.title || "No title"}
      object={data.workspace.id}
      identifier={FlussWorkspace.identifier}
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
    </ModelPageLayout>
  );
});
