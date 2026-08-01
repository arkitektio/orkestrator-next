import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Sidebars } from "@/components/layout/Sidebars";
import { MikroLightpathView } from "@/linkers";
import { useGetLightpathViewQuery } from "../api/graphql";
import LightPathGraph from "../components/lightpath/LightPathGraph";

export const LightpathViewPage = asDetailQueryRoute(
  useGetLightpathViewQuery,
  ({ data }) => {
    return (
      <MikroLightpathView.ModelPage
        title={data?.lightpathView?.__typename}
        object={data?.lightpathView}
        sidebars={
          <Sidebars>
            <Sidebars.Tab label="Comments">
              <MikroLightpathView.Komments object={data?.lightpathView} />
            </Sidebars.Tab>
          </Sidebars>
        }
      >
        <LightPathGraph graph={data?.lightpathView?.graph} showButtons={true} />
      </MikroLightpathView.ModelPage>
    );
  },
);


export default LightpathViewPage;
