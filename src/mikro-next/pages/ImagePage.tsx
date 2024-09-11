import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { ResponsiveContainerGrid } from "@/components/layout/ContainerGrid";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import {
  DetailPane,
  DetailPaneContent,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MikroDataset, MikroImage } from "@/linkers";
import { UserInfo } from "@/lok-next/components/protected/UserInfo";
import { TwoDViewProvider } from "@/providers/view/ViewProvider";
import { HobbyKnifeIcon, PlusIcon } from "@radix-ui/react-icons";
import Timestamp from "react-timestamp";
import {
  AffineTransformationViewFragment,
  useGetImageQuery,
  usePinImageMutation,
} from "../api/graphql";
import AcquisitionViewCard from "../components/cards/AcquisitionViewCard";
import ChannelViewCard from "../components/cards/ChannelViewCard";
import FileCard from "../components/cards/FileCard";
import ImageMetricCard from "../components/cards/ImageMetricCard";
import LabelViewCard from "../components/cards/LabelViewCard";
import OpticsViewCard from "../components/cards/OpticsViewCard";
import RGBViewCard from "../components/cards/RGBViewCard";
import RoiCard from "../components/cards/RoiCard";
import SpecimenViewCard from "../components/cards/SpecimenViewCard";
import TransformationViewCard from "../components/cards/TransformationViewCard";
import WellPositionViewCard from "../components/cards/WellPositionViewCard";
import { TwoDViewController } from "../components/render/Controller";
import { VivRenderer } from "../components/render/VivRenderer";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";
import { PinToggle } from "../components/ui/PinToggle";
import { AddImageViewForm } from "../forms/AddImageViewForm";
import { UpdateImageForm } from "../forms/UpdateImageForm";
import { Matrix4 } from "@math.gl/core";
import { useMemo } from "react";
import { TwoDRGBRender } from "../components/render/TwoDRGBRender";
import { RGBD, TwoDRGBThreeRenderDetail } from "../components/render/TwoDThree";

export type IRepresentationScreenProps = {};

export const dimensionOrder = ["c", "t", "z", "y", "x"];

export default asDetailQueryRoute(useGetImageQuery, ({ data, refetch }) => {
  const x = data?.image?.store?.shape?.at(4);
  const y = data?.image?.store?.shape?.at(4);
  const z = data?.image?.store?.shape?.at(2) || 1;
  const t = data?.image?.store?.shape?.at(1) || 1;
  const c = data?.image?.store?.shape?.at(0) || 1;

  const aspectRatio = x && y ? x / y : 1;

  const [pinImage] = usePinImageMutation();

  const modelMatrix = useMemo(() => {
    const affineView = data?.image?.views.find(
      (x) => x.__typename == "AffineTransformationView",
    ) as AffineTransformationViewFragment;
    if (!affineView) {
      return new Matrix4().identity();
    }

    console.log(affineView.affineMatrix);

    const scaleX = affineView.affineMatrix[0][0];
    const scaleY = affineView.affineMatrix[1][1];
    const scaleZ = affineView.affineMatrix[2][2];
    const min = Math.min(scaleX, scaleY, scaleZ);

    const scale = [scaleX / min, scaleY / min, scaleZ / min];

    console.log("scale", scale);

    return new Matrix4().scale(scale);
  }, [data?.image?.views]);

  return (
    <MikroImage.ModelPage
      title={data?.image?.name}
      object={data?.image?.id}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <MikroImage.Komments object={data?.image?.id} />,
            Provenance: <ProvenanceSidebar items={data?.image.history} />,
          }}
        />
      }
      variant="black"
    >
      <TwoDViewProvider initialC={0} initialT={0} initialZ={0}>
        <div className="grid grid-cols-12 grid-reverse flex-col rounded-md gap-4 mt-2 h-full">
          <div className="absolute w-full h-full overflow-hidden border-0">
            {data?.image?.rgbContexts?.map((context, index) => (
              <div className={"h-full w-full mt-0 rounded rounded-md relative"}>
                <div className="w-full h-full items-center flex justify-center flex-col">
                  <RGBD context={context} rois={[]} modelMatrix={modelMatrix} />
                </div>
              </div>
            ))}
          </div>
          <DetailPane className="col-span-2 @container bg-black max-h-[80%] bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 z-100 overflow-hidden">
            <DetailPaneHeader>
              <DetailPaneTitle
                actions={
                  <>
                    <PinToggle
                      onPin={(e) => {
                        data?.image.id &&
                          pinImage({
                            variables: {
                              id: data?.image?.id,
                              pin: e,
                            },
                          });
                      }}
                      pinned={data?.image?.pinned || false}
                    />
                    <FormSheet trigger={<HobbyKnifeIcon />}>
                      {data?.image && <UpdateImageForm image={data?.image} />}
                    </FormSheet>
                  </>
                }
              >
                {data?.image?.name}
              </DetailPaneTitle>
            </DetailPaneHeader>

            <DetailPaneContent>
              {data?.image?.dataset && (
                <>
                  <div className="font-light">In Dataset</div>
                  <div className="flex flex-row mb-2">
                    <MikroDataset.DetailLink
                      className="text-xl cursor-pointer p-1 border rounded mr-2 border-gray-300"
                      object={data?.image?.dataset?.id}
                    >
                      {data?.image?.dataset.name}
                    </MikroDataset.DetailLink>
                  </div>
                </>
              )}

              <div className="font-light mt-2 ">Created At</div>
              <div className="text-md mt-2 ">
                <Timestamp date={data?.image?.createdAt} />
              </div>
              <div className="font-light mt-2 ">Created by</div>
              <div className="text-md mt-2 ">
                {data?.image?.creator?.sub && (
                  <UserInfo sub={data?.image?.creator?.sub} />
                )}
              </div>
              <div className="font-light">Shape</div>
              <div className="text-xl flex mb-2">
                {data?.image?.store?.shape?.map((val, index) => (
                  <div key={index}>
                    <span className="font-semibold">{val}</span>{" "}
                    <span className="text-xs font-light mr-1 ml-1 my-auto">
                      {" "}
                      {dimensionOrder[index]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="font-light">Tags</div>
              <div className="text-xl flex mb-2">
                {data?.image?.tags?.map((tag, index) => (
                  <>
                    <span className="font-semibold mr-2">#{tag} </span>
                  </>
                ))}
              </div>
              <div className="font-light">Views</div>
              <ScrollArea className="mt-2">
                <ResponsiveContainerGrid className="gap-3">
                  {data?.image.views?.map((view, index) => (
                    <>
                      {view.__typename == "AffineTransformationView" && (
                        <TransformationViewCard view={view} key={index} />
                      )}
                      {view.__typename == "LabelView" && (
                        <LabelViewCard view={view} key={index} />
                      )}
                      {view.__typename == "OpticsView" && (
                        <OpticsViewCard view={view} key={index} />
                      )}
                      {view.__typename == "ChannelView" && (
                        <ChannelViewCard view={view} key={index} />
                      )}
                      {view.__typename == "RGBView" && (
                        <RGBViewCard view={view} key={index} />
                      )}
                      {view.__typename == "AcquisitionView" && (
                        <AcquisitionViewCard view={view} key={index} />
                      )}
                      {view.__typename == "WellPositionView" && (
                        <WellPositionViewCard view={view} key={index} />
                      )}
                      {view.__typename == "SpecimenView" && (
                        <SpecimenViewCard view={view} key={index} />
                      )}
                    </>
                  ))}
                  {data?.image && (
                    <Card className="opacity-0 hover:opacity-100 relative">
                      <CardContent className="grid place-items-center w-full h-full">
                        <FormDialog
                          trigger={<PlusIcon className="text-xl" />}
                          onSubmit={async (data) => {
                            await refetch();
                          }}
                        >
                          <AddImageViewForm image={data?.image.id} />
                        </FormDialog>
                      </CardContent>
                    </Card>
                  )}
                </ResponsiveContainerGrid>
              </ScrollArea>
              <ListRender title="Metrics" array={data?.image?.metrics}>
                {(metric, index) => (
                  <ImageMetricCard metric={metric} key={index} />
                )}
              </ListRender>

              <ListRender title="Rois" array={data?.image?.rois}>
                {(roi, index) => <RoiCard item={roi} key={index} />}
              </ListRender>

              <ListRender title="File origins" array={data?.image?.fileOrigins}>
                {(file, index) => <FileCard file={file} key={index} />}
              </ListRender>
            </DetailPaneContent>
          </DetailPane>
        </div>
      </TwoDViewProvider>
    </MikroImage.ModelPage>
  );
});
