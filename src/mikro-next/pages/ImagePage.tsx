import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { ResponsiveContainerGrid } from "@/components/layout/ContainerGrid";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { useGetImageQuery, usePinImageMutation } from "../api/graphql";
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
import SnapshotPanel from "../components/panels/SnapshotPanel";
import VideoPanel from "../components/panels/VideoPanel";
import { TwoDViewController } from "../components/render/Controller";
import { TwoDRGBThreeRenderDetail } from "../components/render/TwoDThree";
import { VivRenderer } from "../components/render/VivRenderer";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";
import { PinToggle } from "../components/ui/PinToggle";
import { AddImageViewForm } from "../forms/AddImageViewForm";
import { UpdateImageForm } from "../forms/UpdateImageForm";

export type IRepresentationScreenProps = {};

export const dimensionOrder = ["c", "t", "z", "y", "x"];

export default asDetailQueryRoute(useGetImageQuery, ({ data, refetch }) => {
  const x = data?.image?.store?.shape?.at(3);
  const y = data?.image?.store?.shape?.at(4);
  const z = data?.image?.store?.shape?.at(2) || 1;
  const t = data?.image?.store?.shape?.at(1) || 1;
  const c = data?.image?.store?.shape?.at(0) || 1;

  const aspectRatio = x && y ? x / y : 1;

  const [pinImage] = usePinImageMutation();

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
    >
      <TwoDViewProvider initialC={0} initialT={0} initialZ={0}>
        <Tabs
          defaultValue={
            data?.image?.rgbContexts?.at(0)?.id
              ? "context" + data?.image?.rgbContexts?.at(0)?.id
              : "raw"
          }
          id={data?.image?.id}
          className="relative"
        >
          <div className="flex @2xl:flex-row-reverse flex-col rounded-md gap-4 mt-2">
            <div className="flex-1  overflow-hidden ">
              <AspectRatio
                ratio={aspectRatio}
                className=" group overflow-hidden rounded rounded-md shadow shadow-xl relative"
              >
                <div className="absolute top-0 right-0">
                  <TwoDViewController zSize={z} tSize={t} cSize={c} />
                </div>
                {data?.image?.rgbContexts?.map((context, index) => (
                  <TabsContent
                    key={index}
                    value={"context" + context.id}
                    className={"h-full w-full mt-0 rounded rounded-md relative"}
                  >
                    <Dialog>
                      <DialogTrigger className="w-full h-full">
                        {data?.image.renders.length == 0 && (
                          <Card className="w-full h-full items-center flex justify-center flex-col">
                            No render yet
                            <VivRenderer context={context} rois={[]} />
                            <p className="text-xs">How do i render an Image?</p>
                          </Card>
                        )}
                        {data?.image?.renders?.map((x) => {
                          if (x.__typename == "Snapshot") {
                            return <SnapshotPanel image={x} />;
                          }
                          if (x.__typename == "Video") {
                            return <VideoPanel video={x} />;
                          }
                        })}
                      </DialogTrigger>
                      <DialogContent className="p-3 min-w-[100vw] min-h-[100vh] max-w-[100vw] max-h-[100vh] border-0 bg-black text-white">
                        <TwoDRGBThreeRenderDetail
                          context={context}
                          rois={data.image.rois}
                        />
                      </DialogContent>
                    </Dialog>
                  </TabsContent>
                ))}
              </AspectRatio>
            </div>
            <DetailPane className="flex-1 @container ">
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

                <div className="font-light mt-2 ">Show</div>
                <TabsList className="flex-wrap items-start">
                  {data?.image?.rgbContexts?.map((context, i) => (
                    <TabsTrigger
                      key={i}
                      value={"context" + context.id}
                      className="max-w-[200px] truncate items-center"
                    >
                      {context.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
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

                <ListRender
                  title="File origins"
                  array={data?.image?.fileOrigins}
                >
                  {(file, index) => <FileCard file={file} key={index} />}
                </ListRender>
              </DetailPaneContent>
            </DetailPane>
          </div>
        </Tabs>
      </TwoDViewProvider>
    </MikroImage.ModelPage>
  );
});
