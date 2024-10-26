import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { withKabinet } from "@/arkitekt";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { KabinetPod } from "@/linkers";
import { ListTemplateFragment, useTemplatesQuery } from "@/rekuest/api/graphql";
import { useTemplateAction } from "@/rekuest/hooks/useTemplateAction";
import {
  DemandKind,
  PodFragment,
  PortKind,
  useGetPodQuery,
} from "../api/graphql";
import ResourceCard from "../components/cards/ResourceCard";

export const AssignButton = (props: {
  template: ListTemplateFragment;
  pod: string;
  refetch: () => void;
}) => {
  const { assign } = useTemplateAction({
    id: props.template.id,
  });

  const doassign = async () => {
    console.log(
      await assign({
        args: {
          pod: props.pod,
        },
      }),
      props.refetch(),
    );
  };

  return (
    <Button onClick={doassign} variant={"outline"} size="sm">
      {props.template.node.name}
    </Button>
  );
};

const RefreshLogsButton = (props: {
  pod: PodFragment;
  refetch: () => void;
}) => {
  const { data } = useTemplatesQuery({
    variables: {
      filters: {
        node: {
          demands: [
            {
              kind: DemandKind.Args,
              matches: [
                {
                  key: "pod",
                  kind: PortKind.Structure,
                  identifier: "@kabinet/pod",
                },
              ],
            },
          ],
        },
        agent: {
          clientId: props.pod.backend.clientId,
          instanceId: props.pod.backend.instanceId,
        },
      },
    },
  });

  return (
    <div className="flex flex-row gap-2">
      {data?.templates.map((t) => (
        <Tooltip>
          <TooltipTrigger>
            <AssignButton
              template={t}
              pod={props.pod.id}
              refetch={props.refetch}
            />
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2 text-sm">
              Refresh logs on {props.pod.backend.name}
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default asDetailQueryRoute(
  withKabinet(useGetPodQuery),
  ({ data, refetch }) => {
    return (
      <KabinetPod.ModelPage
        title={data.pod.backend.name}
        object={data?.pod?.id}
        sidebars={
          <MultiSidebar
            map={{
              Comments: <KabinetPod.Komments object={data?.pod?.id} />,
            }}
          />
        }
        pageActions={<RefreshLogsButton pod={data.pod} refetch={refetch} />}
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div className="mb-3">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer">
              {data?.pod?.deployment.flavour.release.app.identifier}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
              {data?.pod?.deployment.flavour.release.version} on{" "}
              {data?.pod?.deployment.flavour.release.id}
            </p>
            <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
              {data.pod.backend.name}
            </p>
          </div>
        </div>

        <div className="p-6">
          <p className="mb-2">Latest Logs</p>
          <Card className="p-2 w-full">
            <pre className="w-[500px] text-xs">
              {data?.pod.latestLogDump?.logs}
            </pre>
          </Card>
          {data?.pod?.resource && (
            <div className="p-2">
              Running on
              <ResourceCard item={data?.pod.resource} />
            </div>
          )}
        </div>
      </KabinetPod.ModelPage>
    );
  },
);
