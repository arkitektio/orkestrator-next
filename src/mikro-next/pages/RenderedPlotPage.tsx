import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Image } from "@/components/ui/image";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroRenderedPlot } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useGetRenderedPlotQuery, usePinStageMutation } from "../api/graphql";

export default asDetailQueryRoute(
  useGetRenderedPlotQuery,
  ({ data, refetch }) => {
    const [pinStage] = usePinStageMutation();
    const resolve = useResolve();
    return (
      <MikroRenderedPlot.ModelPage
        actions={<MikroRenderedPlot.Actions object={data.renderedPlot.id} />}
        object={data.renderedPlot.id}
        title={data.renderedPlot.name}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <MikroRenderedPlot.Komments object={data.renderedPlot.id} />
              ),
            }}
          />
        }
      >
        <DetailPane className="p-3 @container">
          <DetailPaneHeader>
            <DetailPaneTitle
              actions={
                <>
                  <FormSheet trigger={<HobbyKnifeIcon />}>
                    Not implememted yet
                  </FormSheet>
                </>
              }
            >
              {data?.renderedPlot?.name}
            </DetailPaneTitle>
          </DetailPaneHeader>
        </DetailPane>
        <Image
          src={resolve(data?.renderedPlot.store.presignedUrl)}
          className="object-cover w-full absolute top-0 left-0 rounded rounded-lg"
        />
      </MikroRenderedPlot.ModelPage>
    );
  },
);
