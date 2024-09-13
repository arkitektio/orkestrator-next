import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { withKabinet } from "@/arkitekt";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { DetailPane } from "@/components/ui/pane";
import { KabinetPod } from "@/linkers";
import { useGetPodQuery } from "../api/graphql";
import { useTemplatesQuery } from "@/rekuest/api/graphql";
import { KABINET_REFRESH_POD_HASH } from "@/constants";
import { useTemplateAction } from "@/rekuest/hooks/useTemplateAction";
import { Button } from "@/components/ui/button";

export const AssignButton = (props: {
  id: string;
  pod: string;
  refetch: () => void;
}) => {
  const { assign } = useTemplateAction({
    id: props.id,
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
      Refresh
    </Button>
  );
};

const RefreshLogsButton = (props: { item: string; refetch: () => void }) => {
  const { data } = useTemplatesQuery({
    variables: {
      filters: {
        nodeHash: KABINET_REFRESH_POD_HASH,
      },
    },
  });

  return (
    <div className="flex flex-row gap-2">
      {data?.templates.map((t) => (
        <AssignButton id={t.id} pod={props.item} refetch={props.refetch} />
      ))}
    </div>
  );
};

export default asDetailQueryRoute(
  withKabinet(useGetPodQuery),
  ({ data, refetch }) => {
    return (
      <KabinetPod.ModelPage
        title={data?.pod?.id}
        object={data?.pod?.id}
        sidebars={
          <MultiSidebar
            map={{
              Comments: <KabinetPod.Komments object={data?.pod?.id} />,
            }}
          />
        }
        pageActions={
          <RefreshLogsButton item={data?.pod.id} refetch={refetch} />
        }
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
        </DetailPane>
      </KabinetPod.ModelPage>
    );
  },
);
