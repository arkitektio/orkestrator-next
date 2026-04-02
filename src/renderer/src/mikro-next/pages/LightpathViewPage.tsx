import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { MikroLightpathView } from "@/linkers";
import { useGetLightpathViewQuery } from "../api/graphql";
import LightPathGraph from "../components/lightpath/LightPathGraph";

export const LightpathViewPage = asDetailQueryRoute(
  useGetLightpathViewQuery,
  ({ data, refetch }) => {
    return (
      <MikroLightpathView.ModelPage
        title={data?.lightpathView?.__typename}
        object={data?.lightpathView}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <MikroLightpathView.Komments object={data?.lightpathView} />
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


export default LightpathViewPage;
