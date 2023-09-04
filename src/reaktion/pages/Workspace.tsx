import { EditFlow } from "@/reaktion/edit/EditFlow";
import {
  useFlowQuery,
  useUpdateWorkspaceMutation,
  useWorkspaceQuery,
} from "@/rekuest/api/graphql";
import { RekuestGuard, withRekuest } from "@jhnnsrs/rekuest-next";
import { useParams } from "react-router-dom";

export const WorkspaceDetail = (props: { id: string }) => {
  const { data, error } = withRekuest(useWorkspaceQuery)({
    variables: {
      id: props.id,
    },
  });

  const [saveFlow] = withRekuest(useUpdateWorkspaceMutation)();

  console.log(error?.message, data);

  return (
    <>
      {data?.workspace.latestFlow && (
        <EditFlow
          flow={data?.workspace.latestFlow}
          onSave={(e) => {
            console.log("saving flow", e);
            saveFlow({
              variables: {
                id: props.id,
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
    </>
  );
};

function Page() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>Missing id</div>;
  }

  return (
    <>
      <WorkspaceDetail id={id} />
    </>
  );
}

export default Page;
