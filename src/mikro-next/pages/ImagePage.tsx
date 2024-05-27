import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import {
  ContainerGrid,
  ResponsiveContainerGrid,
} from "@/components/layout/ContainerGrid";
import { ListRender } from "@/components/layout/ListRender";
import { PageLayout } from "@/components/layout/PageLayout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import {
  DetailPane,
  DetailPaneContent,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MikroDataset, MikroImage } from "@/linkers";
import { UserInfo } from "@/lok-next/components/protected/UserInfo";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import React from "react";
import { useParams } from "react-router";
import Timestamp from "react-timestamp";
import { useGetImageQuery, usePinImageMutation } from "../api/graphql";
import ChannelViewCard from "../components/cards/ChannelViewCard";
import FileCard from "../components/cards/FileCard";
import ImageMetricCard from "../components/cards/ImageMetricCard";
import LabelViewCard from "../components/cards/LabelViewCard";
import OpticsViewCard from "../components/cards/OpticsViewCard";
import WellPositionViewCard from "../components/cards/WellPositionViewCard";
import TransformationViewCard from "../components/cards/TransformationViewCard";
import SnapshotPanel from "../components/panels/SnapshotPanel";
import VideoPanel from "../components/panels/VideoPanel";
import { TwoDOffcanvas, TwoDViewCanvas } from "../components/render/TwoDRender";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";
import { PinToggle } from "../components/ui/PinToggle";
import { AddImageViewForm } from "../forms/AddImageViewForm";
import RGBViewCard from "../components/cards/RGBViewCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HobbyKnifeIcon, PlusIcon } from "@radix-ui/react-icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UpdateImageForm } from "../forms/UpdateImageForm";
import { Komments } from "@/lok-next/components/komments/Komments";
import { TwoDViewProvider, ViewProvider } from "@/providers/view/ViewProvider";
import { TwoDViewController } from "../components/render/Controller";
import AcquisitionViewCard from "../components/cards/AcquisitionViewCard";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { TwoDRGBRender } from "../components/render/TwoDRGBRender";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  withMikroNext(useGetImageQuery),
  ({ data, refetch }) => {
    const x = data?.image?.store?.shape?.at(3);
    const y = data?.image?.store?.shape?.at(4);
    const z = data?.image?.store?.shape?.at(2) || 1;
    const t = data?.image?.store?.shape?.at(1) || 1;
    const c = data?.image?.store?.shape?.at(0) || 1;

    const aspectRatio = x && y ? x / y : 1;

    const [pinImage] = withMikroNext(usePinImageMutation)();

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
          <Tabs defaultValue="raw" className="relative">
            <div className="flex @2xl:flex-row-reverse flex-col rounded-md gap-4 mt-2">
              <div className="flex-1  overflow-hidden ">
                <AspectRatio
                  ratio={aspectRatio}
                  className=" group overflow-hidden rounded rounded-md shadow shadow-xl relative"
                >
                  <div className="absolute top-0 right-0">
                    <TwoDViewController zSize={z} tSize={t} cSize={c} />
                  </div>
                  <TabsContent
                    value="raw"
                    className={"h-full w-full mt-0 rounded rounded-md "}
                  >
                    {data?.image?.store && (
                      <TwoDViewCanvas
                        store={data?.image?.store}
                        colormap={"viridis"}
                      />
                    )}
                  </TabsContent>
                  {data?.image?.renders?.map((render, index) => (
                    <TabsContent key={index} value={render.id}>
                      {render.__typename == "Snapshot" && (
                        <SnapshotPanel image={render} />
                      )}
                      {render.__typename == "Video" && (
                        <VideoPanel video={render} />
                      )}
                    </TabsContent>
                  ))}
                  {data?.image?.rgbContexts?.map((context, index) => (
                    <TabsContent
                      key={index}
                      value={"context" + context.id}
                      className={"h-full w-full mt-0 rounded rounded-md "}
                    >
                      <TwoDRGBRender context={context} />
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
                          {data?.image && (
                            <UpdateImageForm image={data?.image} />
                          )}
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
                    <TabsTrigger value="raw">Raw</TabsTrigger>
                    {data?.image?.renders?.map((render, i) => (
                      <TabsTrigger key={i} value={render.id}>
                        {render.__typename}
                      </TabsTrigger>
                    ))}
                    {data?.image?.rgbContexts?.map((context, i) => (
                      <TabsTrigger key={i} value={"context" + context.id}>
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
                          x
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
                  <ScrollArea>
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
  },
);
