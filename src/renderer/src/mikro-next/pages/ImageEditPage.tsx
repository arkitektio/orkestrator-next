import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { ResponsiveContainerGrid } from "@/components/layout/ContainerGrid";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import {
  DetailPane,
  DetailPaneContent,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroImage } from "@/linkers";
import { UserInfo } from "@/lok-next/components/protected/UserInfo";
import { TwoDViewProvider } from "@/providers/view/ViewProvider";
import { HobbyKnifeIcon, PlusIcon } from "@radix-ui/react-icons";
import { Download } from "lucide-react";
import { useEffect } from "react";
import Timestamp from "react-timestamp";
import {
  AcquisitionViewFragment,
  AffineTransformationViewFragment,
  ChannelViewFragment,
  DerivedViewFragment,
  FileViewFragment,
  HistogramViewFragment,
  OpticsViewFragment,
  RgbViewFragment,
  RoiViewFragment,
  useGetImageQuery,
  usePinImageMutation,
  WatchRoisDocument,
  WatchRoisSubscription,
  WatchRoisSubscriptionVariables,
  WellPositionViewFragment,
} from "../api/graphql";
import AcquisitionViewCard from "../components/cards/AcquisitionViewCard";
import ChannelViewCard from "../components/cards/ChannelViewCard";
import DerivedViewCard from "../components/cards/DerivedViewCard";
import FileViewCard from "../components/cards/FileViewCard";
import HistogramViewCard from "../components/cards/HistogramViewCard";
import LabelViewCard from "../components/cards/LabelViewCard";
import OpticsViewCard from "../components/cards/OpticsViewCard";
import PixelViewCard from "../components/cards/PixelViewCard";
import RGBViewCard from "../components/cards/RGBViewCard";
import ROIViewCard from "../components/cards/ROIViewCard";
import TransformationViewCard from "../components/cards/TransformationViewCard";
import WellPositionViewCard from "../components/cards/WellPositionViewCard";
import { FinalRender } from "../components/render/FInalRender";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";
import { PinToggle } from "../components/ui/PinToggle";
import { AddImageViewForm } from "../forms/AddImageViewForm";
import { UpdateImageForm } from "../forms/UpdateImageForm";

export type IRepresentationScreenProps = {};

export const dimensionOrder = ["c", "t", "z", "y", "x"];

// `Image.views` no longer exists on the backend schema (see below), so the
// "Views" grid always renders an empty, correctly-discriminated array of the
// view kinds these cards know how to render.
type EditableView =
  | AffineTransformationViewFragment
  | { __typename?: "LabelView"; id?: string; label?: string }
  | OpticsViewFragment
  | ChannelViewFragment
  | RgbViewFragment
  | AcquisitionViewFragment
  | WellPositionViewFragment
  | RoiViewFragment
  | FileViewFragment
  | DerivedViewFragment
  | { __typename?: "PixelView"; id: string }
  | HistogramViewFragment;

export const ImageEditPage = asDetailQueryRoute(
  useGetImageQuery,
  ({ data, refetch, subscribeToMore }) => {
    const [pinImage] = usePinImageMutation();

    useEffect(() => {
      return subscribeToMore<
        WatchRoisSubscription,
        WatchRoisSubscriptionVariables
      >({
        document: WatchRoisDocument,
        variables: {
          image: data.image.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          console.log("sub", subscriptionData);
          if (!subscriptionData.data) return prev;
          const createdRoi = subscriptionData.data.rois.create;
          const deletedRoi = subscriptionData.data.rois.delete;
          const updatedRoi = subscriptionData.data.rois.update;

          if (createdRoi) {
            return {
              image: {
                ...prev.image,
                rois: [...prev.image.rois, createdRoi],
              },
            };
          }

          if (deletedRoi) {
            return {
              image: {
                ...prev.image,
                rois: prev.image.rois.filter((roi) => roi.id !== deletedRoi),
              },
            };
          }

          if (updatedRoi) {
            return {
              image: {
                ...prev.image,
                rois: prev.image.rois.map((roi) =>
                  roi.id === updatedRoi.id ? updatedRoi : roi,
                ),
              },
            };
          }
          return prev;
        },
      });
    }, [data?.image?.id]);

    const resolve = useResolve();
    return (
      <MikroImage.ModelPage
        title={data?.image?.name}
        object={data?.image}
        sidebars={
          <MultiSidebar
            map={{
              Comments: <MikroImage.Komments object={data?.image} />,
              Provenance: (
                <ProvenanceSidebar items={data?.image.provenanceEntries} />
              ),
              Renders: (
                <div className="p-3 flex flex-col gap-2">
                  {data.image.renders.map((render, index) => (
                    <Card className="p-2 truncate flex flex-row items-center gap-2" key={index}>
                      {render.__typename == "Snapshot" && (
                        <Image
                          src={resolve(render.store.key)}
                          className="w-full"
                        />
                      )}
                      <a href={resolve(render.store.key)} download>
                        <Download size={24} />
                        {render.__typename}
                      </a>
                    </Card>
                  ))}
                </div>
              ),
            }}
          />
        }
        pageActions={
          <>
            <MikroImage.ObjectButton object={data?.image} />
          </>
        }
        variant="black"
      >
        <TwoDViewProvider initialC={0} initialT={0} initialZ={0}>
          <div className="grid grid-cols-12 grid-reverse flex-col rounded-md gap-4 mt-2 h-full">
            <div className="absolute w-full h-full overflow-hidden border-0">
              {data?.image?.rgbContexts?.map((context, index) => (
                <div key={index}
                  className={"h-full w-full mt-0 rounded rounded-md relative"}
                >
                  <div className="w-full h-full items-center flex justify-center flex-col">
                    <FinalRender
                      context={context}
                      rois={data.image.rois}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-3 col-span-12 flex flex-row items-end lg:items-start">
              <DetailPane className="w-full col-span-3 @container p-2 bg-black bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 z-100 overflow-hidden flex flex-col h-max-[400px]">
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
                      </>
                    }
                    className="group "
                  >
                    <FormSheet
                      trigger={
                        <HobbyKnifeIcon className="w-full group-hover:block hidden" />
                      }
                    >
                      {data?.image && <UpdateImageForm image={data?.image} />}
                    </FormSheet>
                    {data?.image?.name}
                  </DetailPaneTitle>
                </DetailPaneHeader>

                <DetailPaneContent className="flex flex-col">
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
                  <div className="font-light text-xs mb-2">
                    ZarrV {data?.image?.store?.version} [
                    {data.image.store.dtype}]
                  </div>

                  <div className="font-light mt-2 font-semibold ">Creation</div>
                  <div className="flex-row flex gap-2 mt-2">
                    <Timestamp
                      date={data?.image?.createdAt}
                      className="my-auto"
                    />{" "}
                    <div className="my-auto">by</div>
                    {data?.image?.creator?.sub && (
                      <UserInfo sub={data?.image?.creator?.sub} />
                    )}
                  </div>
                  <div className="font-light my-2 ">Knowledge </div>
                  <MikroImage.TinyKnowledge object={data?.image} />

                  <div className="flex-row flex gap-2 mt-2"></div>

                  <div className="font-light mb-2">Views</div>

                  <ResponsiveContainerGrid className="gap-3 ">
                    {/* `Image.views` no longer exists on the backend schema; kept as an
                        empty, type-safe no-op until a replacement query is wired up. */}
                    {([] as EditableView[]).map((view, index) => (
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
                        {view.__typename == "ROIView" && (
                          <ROIViewCard view={view} key={index} />
                        )}
                        {view.__typename == "FileView" && (
                          <FileViewCard view={view} key={index} />
                        )}
                        {view.__typename == "DerivedView" && (
                          <DerivedViewCard view={view} key={index} />
                        )}
                        {view.__typename == "PixelView" && (
                          <PixelViewCard view={view} key={index} />
                        )}
                        {view.__typename == "HistogramView" && (
                          <HistogramViewCard view={view} key={index} />
                        )}
                      </>
                    ))}
                    {data?.image && (
                      <Card className="opacity-0 hover:opacity-100 relative">
                        <CardContent className="grid place-items-center w-full h-full">
                          <FormDialog
                            trigger={<PlusIcon className="text-xl" />}
                            onSubmit={async (_data) => {
                              await refetch();
                            }}
                          >
                            <AddImageViewForm image={data?.image.id} />
                          </FormDialog>
                        </CardContent>
                      </Card>
                    )}
                  </ResponsiveContainerGrid>
                  {data?.image.derivedFromViews?.length > 0 && (
                    <>
                      <div className="font-light">Derived images</div>
                      <div className="flex flex-col gap-2 mt-2">
                        {data?.image.derivedFromViews?.map((view, index) => (
                          <MikroImage.Smart object={view.image} key={index}>
                            <MikroImage.DetailLink
                              object={view.image}
                              className="cursor-pointer"
                            >
                              <Card className="flex flex-row gap-2 px-2 py-1">
                                <span className="text-md">
                                  {view.image?.name}
                                </span>
                              </Card>
                            </MikroImage.DetailLink>
                          </MikroImage.Smart>
                        ))}
                      </div>
                    </>
                  )}
                </DetailPaneContent>
              </DetailPane>
            </div>
          </div>
        </TwoDViewProvider>
      </MikroImage.ModelPage>
    );
  },
);


export default ImageEditPage;
