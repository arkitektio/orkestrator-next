import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { withKabinet } from "@/arkitekt";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { DetailPane, DetailPaneContent } from "@/components/ui/pane";
import { KabinetBackend } from "@/linkers";
import { useGetBackendQuery } from "../api/graphql";
import PodsList from "../components/lists/PodsList";

export default asDetailQueryRoute(
    withKabinet(useGetBackendQuery),
    ({ data, refetch }) => {
  
      return (
        <KabinetBackend.ModelPage
          title={data?.backend?.name}
          object={data?.backend?.id}
          sidebars={
            <MultiSidebar
              map={{
                Comments: <KabinetBackend.Komments object={data?.backend?.id} />,
              }}
            />
          }
        >

            <DetailPane>
              <DetailPaneContent>
                <div
                    className="p-3"
                >

                    {data?.backend?.name}
                </div>

               <PodsList/>

               </DetailPaneContent>

            </DetailPane>
        </KabinetBackend.ModelPage>
        );
    }
    );
    