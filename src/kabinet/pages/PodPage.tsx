import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { withKabinet } from "@/arkitekt";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { DetailPane } from "@/components/ui/pane";
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
        <DetailPane>
          <div className="p-3">
            {data?.pod?.deployment.flavour.release.app.identifier}
            {data?.pod?.deployment.flavour.release.version}
            {data?.pod?.status}
          </div>

          <pre className="w-[500px] text-xs">
            {data?.pod.latestLogDump?.logs}
          </pre>

          {data.pod.clientId}
        </DetailPane>
      </KabinetPod.ModelPage>
    );
  },
);
