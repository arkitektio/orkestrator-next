import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { KabinetPod } from "@/linkers";
import {
  ListImplementationFragment,
  useImplementationsQuery,
} from "@/rekuest/api/graphql";
import { useImplementationAction } from "@/rekuest/hooks/useImplementationAction";
import {
  DemandKind,
  PodFragment,
  PortKind,
  useGetPodQuery,
} from "../api/graphql";
import ResourceCard from "../components/cards/ResourceCard";
import React from "react";
export const AssignButton = (props: {
  template: ListImplementationFragment;
  pod: string;
  refetch: () => void;
}) => {
  const { assign } = useImplementationAction({
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
      {props.template.action.name}
    </Button>
  );
};

const RefreshLogsButton = (props: {
  pod: PodFragment;
  refetch: () => void;
}) => {
  const { data } = useImplementationsQuery({
    variables: {
      filters: {
        action: {
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
      },
    },
  });

  return (
    <div className="flex flex-row gap-2">
      {data?.implementations.map((t) => (
        <Tooltip key={t.id}>
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

export default asDetailQueryRoute(useGetPodQuery, ({ data, refetch }) => {
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
});
