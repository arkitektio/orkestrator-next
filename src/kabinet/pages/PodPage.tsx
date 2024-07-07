import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { withKabinet } from "@/arkitekt";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { DetailPane } from "@/components/ui/pane";
import { KabinetPod } from "@/linkers";
import { useGetPodQuery } from "../api/graphql";

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
        >

            <DetailPane>
                <div
                    className="p-3"
                >

                    {data?.pod?.deployment.flavour.release.app.identifier}{data?.pod?.deployment.flavour.release.version}
                    {data?.pod?.status}
                </div>

                <pre className="w-[500px] text-xs">
                    {data?.pod.latestLogDump?.logs}
                </pre>

            </DetailPane>
        </KabinetPod.ModelPage>
        );
    }
    );
    