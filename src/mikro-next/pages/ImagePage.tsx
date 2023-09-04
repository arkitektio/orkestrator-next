import React from "react";
import { BsPinAngle, BsPinFill } from "react-icons/bs";
import { useParams } from "react-router";
import Timestamp from "react-timestamp";
import { useGetImageQuery, usePinImageMutation } from "../api/graphql";
import ChannelViewCard from "../components/cards/ChannelViewCard";
import FileCard from "../components/cards/FileCard";
import HistoryCard from "../components/cards/HistoryCard";
import ImageMetricCard from "../components/cards/ImageMetricCard";
import LabelViewCard from "../components/cards/LabelViewCard";
import OpticsViewCard from "../components/cards/OpticsViewCard";
import TransformationViewCard from "../components/cards/TransformationViewCard";
import SnapshotPanel from "../components/panels/SnapshotPanel";
import VideoPanel from "../components/panels/VideoPanel";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { PageLayout } from "@/components/layout/PageLayout";
import { MikroDataset, MikroImage } from "@/linkers";
import { Refetcher } from "@/components/ui/refetcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { ListRender } from "@/components/layout/ListRender";
import {
  DetailPane,
  DetailPaneContent,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { Button } from "@/components/ui/button";
import { PinToggle } from "../components/ui/PinToggle";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export type IRepresentationScreenProps = {};

const ImagePage: React.FC<IRepresentationScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <></>;

  const { data, refetch } = withMikroNext(useGetImageQuery)({
    variables: {
      id: id,
    },
  });

  const x = data?.image?.store?.shape?.at(4);
  const y = data?.image?.store?.shape?.at(5);

  const aspectRatio = x && y ? x / y : 1;

  const [pinImage] = withMikroNext(usePinImageMutation)();

  return (
    <PageLayout actions={<MikroImage.Actions id={id} />}>
      <div className="flex @2xl:flex-row-reverse flex-col rounded-md gap-4 mt-2">
        <div className="flex-1">
          <AspectRatio ratio={aspectRatio}>
            <Tabs defaultValue="raw" className="relative">
              <TabsContent value="raw" className={"border border-slate-200"}>
                <div className="flex flex-row gap-2  h-full w-full">
                  nosidnfosidnf
                </div>
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
              <TabsList>
                <TabsTrigger value="raw">Raw</TabsTrigger>
                {data?.image?.renders?.map((render, i) => (
                  <TabsTrigger key={i} value={render.id}>
                    {render.__typename}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </AspectRatio>
        </div>
        <DetailPane className="flex-1">
          <DetailPaneHeader>
            <DetailPaneTitle
              actions={
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
            <div className="font-light mt-2 ">Provenance</div>
            <div className="text-md mt-2 ">
              {data?.image?.history?.map((history, index) => (
                <HistoryCard key={index} history={history} />
              ))}
            </div>
            <div className="font-light mt-2 ">Created by</div>
            <div className="text-md mt-2 ">{data?.image?.creator?.sub}</div>
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
            <ContainerGrid>
              {data?.image.views?.map((view, index) => (
                <>
                  {view.__typename == "TransformationView" && (
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
                </>
              ))}
            </ContainerGrid>

            <ListRender title="Metrics" array={data?.image?.metrics}>
              {(metric, index) => (
                <ImageMetricCard metric={metric} key={index} />
              )}
            </ListRender>

            <ListRender title="File origins" array={data?.image?.fileOrigins}>
              {(file, index) => <FileCard file={file} key={index} />}
            </ListRender>
          </DetailPaneContent>
        </DetailPane>
      </div>
    </PageLayout>
  );
};

export default ImagePage;
