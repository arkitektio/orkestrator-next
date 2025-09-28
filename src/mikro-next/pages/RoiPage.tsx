import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card } from "@/components/ui/card";
import { DetailPane, DetailPaneContent } from "@/components/ui/pane";
import { MikroImage, MikroROI } from "@/linkers";
import { UserInfo } from "@/lok-next/components/protected/UserInfo";
import { TwoDViewProvider } from "@/providers/view/ViewProvider";
import Timestamp from "react-timestamp";
import { useGetRoiQuery, usePinRoiMutation } from "../api/graphql";
import { FinalRender } from "../components/render/FInalRender";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";

export type IRepresentationScreenProps = {};

export const dimensionOrder = ["c", "t", "z", "y", "x"];

export default asDetailQueryRoute(useGetRoiQuery, ({ data, refetch }) => {
  const [pinRoi] = usePinRoiMutation();

  const context = data.roi.image.rgbContexts.at(0);
  return (
    <MikroROI.ModelPage
      title={data?.roi?.id}
      object={data?.roi?.id}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <MikroROI.Komments object={data?.roi?.id} />,
            Provenance: <ProvenanceSidebar items={data?.roi.history} />,
          }}
        />
      }
      pageActions={
        <>
          <MikroROI.ObjectButton object={data?.roi?.id} />
        </>
      }
      variant="black"
    >
      <TwoDViewProvider initialC={0} initialT={0} initialZ={0}>
        <div className="grid grid-cols-12 grid-reverse flex-col rounded-md gap-4 mt-2 h-full">
          <div className="absolute w-full h-full overflow-hidden border-0">
            {context && (
              <FinalRender
                context={context}
                rois={[data.roi]}
                z={data.roi.vectors.at(0)?.at(2)}
                t={data.roi.vectors.at(0)?.at(0)}
                xStart={data.roi.vectors.at(0)?.at(3)}
                xEnd={data.roi.vectors.at(3)?.at(3)}
                yStart={data.roi.vectors.at(0)?.at(4)}
                yEnd={data.roi.vectors.at(3)?.at(4)}
                className="object-contain"
              />
            )}
          </div>
          <DetailPane className="col-span-3 p-3 @container bg-black max-h-[40%] bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 z-100 overflow-hidden">
            <DetailPaneContent>
              {data?.roi?.image && (
                <>
                  <div className="font-light">Marked in</div>
                  <Card className="truncate ellipsis p-3">
                    <MikroImage.DetailLink
                      className="text-xl cursor-pointer p-1 "
                      object={data?.roi?.image?.id}
                    >
                      {data?.roi?.image?.name}
                    </MikroImage.DetailLink>
                  </Card>
                </>
              )}

              <div className="font-light mt-2 ">Created At</div>
              <div className="text-md mt-2 ">
                <Timestamp date={data?.roi?.createdAt} />
              </div>
              <div className="font-light my-2 ">Knowledge </div>
              <MikroROI.TinyKnowledge object={data?.roi?.id} />
              <div className="font-light mt-2 ">Created by</div>
              <div className="text-md mt-2 ">
                {data?.roi?.creator?.sub && (
                  <UserInfo sub={data?.roi?.creator?.sub} />
                )}
              </div>
            </DetailPaneContent>
          </DetailPane>
        </div>
      </TwoDViewProvider>
    </MikroROI.ModelPage>
  );
});
