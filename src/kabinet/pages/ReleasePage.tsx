import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { withKabinet } from "@/arkitekt";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { DetailPane } from "@/components/ui/pane";
import { KabinetPod, KabinetRelease } from "@/linkers";
import { useGetPodQuery, useGetReleaseQuery } from "../api/graphql";
import { useTemplatesQuery } from "@/rekuest/api/graphql";
import { KABINET_REFRESH_POD_HASH } from "@/constants";
import { useTemplateAction } from "@/rekuest/hooks/useTemplateAction";
import { Button } from "@/components/ui/button";

export default asDetailQueryRoute(
  withKabinet(useGetReleaseQuery),
  ({ data, refetch }) => {
    return (
      <KabinetRelease.ModelPage
        title={data?.release?.id}
        object={data?.release?.id}
        sidebars={
          <MultiSidebar
            map={{
              Comments: <KabinetRelease.Komments object={data?.release?.id} />,
            }}
          />
        }
      >
        <DetailPane>
          <div className="p-3">{data?.release?.description}</div>

          <pre className="w-[500px] text-xs">
            {data?.release?.scopes.map((scope) => <div>{scope}</div>)}
          </pre>
        </DetailPane>
      </KabinetRelease.ModelPage>
    );
  },
);
