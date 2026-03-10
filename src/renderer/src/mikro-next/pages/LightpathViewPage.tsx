import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { MikroLightpathView } from "@/linkers";
import { useGetLightpathViewQuery } from "../api/graphql";
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
