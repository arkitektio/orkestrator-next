import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokClient, LokComputeNode } from "@/linkers";
import { useDetailClientQuery } from "../api/graphql";
import CompositionGraph from "../components/graphs/CompositionGraph";
import { AssignationEventKind, useListAssignationsDetailsQuery, PostmanAssignationFragment } from "@/rekuest/api/graphql";
import { ListRender } from "@/components/layout/ListRender";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/plate-ui/button";
import { useDialog } from "@/app/dialog";



const FailedTasks = ({ clientId }: { clientId: string }) => {
  const { openDialog } = useDialog();

  const { data } = useListAssignationsDetailsQuery(
    {
      variables: {
        filter: {
          clientId: clientId,
          state: [AssignationEventKind.Critical],
        },
      }
    }
  )

  const handleReportBug = (assignation: PostmanAssignationFragment) => {
    openDialog("reportbug", {
      assignationId: assignation.id
    });
  };

  return (
    <ListRender
      array={data?.tasks}
      title={
        <div className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Recently failed tasks
        </div>
      }
    >
      {(ex, index) => (
        <Card key={index} className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-semibold">{ex.action.name}</div>
              <div className="text-sm text-muted-foreground">
                Status: {ex.latestEventKind}
              </div>
              {ex.latestEventKind === AssignationEventKind.Critical && (
                <div className="text-sm text-red-500 mt-1">
                  Error occurred during execution
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReportBug(ex)}
              >
                Report Bug
              </Button>
            </div>
          </div>
        </Card>
      )}
    </ListRender>
  );
}



export default asDetailQueryRoute(useDetailClientQuery, ({ data }) => {
  const resolve = useResolve();
  const { openDialog } = useDialog();

  const handleReportClientBug = () => {
    openDialog("reportclientbug", {
      client: data.client,
      issueUrl: data.client.issueUrl || undefined,
    });
  };






  return (
    <LokClient.ModelPage
      object={data.client.id}
      pageActions={<><Button
        variant="outline"
        onClick={handleReportClientBug}
      >
        Report General Bug
      </Button> </>}
      title={data?.client?.release.app.identifier}
    >
      <div className="grid grid-cols-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.client.release.app.identifier}:{" "}
              {data.client.release.version} @ {data.client.user?.username}
            </div>
          </div>
          <div className="flex items-center justify-end">

          </div>
        </div>
        {data.client.node && (
          <LokComputeNode.DetailLink object={data.client.node.id}>{data.client.node.name || "Unnamed Node"}</LokComputeNode.DetailLink>
        )}
        <div className="col-span-2">
          <div className="p-1">
            <div>
              <div className="flex aspect-[3/2] items-center justify-center p-6 max-h-[200px]">
                {data.client.logo?.presignedUrl && (
                  <Image
                    src={resolve(data?.client?.logo.presignedUrl)}
                    className="my-auto"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FailedTasks
        clientId={data.client.oauth2Client.clientId}
      />


      <div className="p-6 h-full">
        <h3>This app is configured to use the following services</h3>
        <CompositionGraph client={data.client} />
      </div>











    </LokClient.ModelPage>
  );
});
