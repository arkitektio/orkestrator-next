import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { KabinetBackend, MikroLightpathView } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useGetBackendQuery, useGetLightpathViewQuery } from "../api/graphql";
import PodCard from "../components/cards/PodCard";
import ResourceCard from "../components/cards/ResourceCard";
import { IconForBackendKind } from "../components/IconForBackendKind";
import LightPathGraph from "../components/lightpath/LightPathGraph";

export default asDetailQueryRoute(
  useGetLightpathViewQuery,
  ({ data, refetch }) => {
    return (
      <MikroLightpathView.ModelPage
        title={data?.lightpathView?.__typename}
        object={data?.lightpathView?.id}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <MikroLightpathView.Komments object={data?.lightpathView?.id} />
              ),
            }}
          />
        }
      >
        <LightPathGraph graph={data?.lightpathView?.graph} showButtons={true} />
      </MikroLightpathView.ModelPage>
    );
  },
);
