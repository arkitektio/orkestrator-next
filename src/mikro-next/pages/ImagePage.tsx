import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { ResponsiveContainerGrid } from "@/components/layout/ContainerGrid";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/plate-ui/button";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import {
  DetailPane,
  DetailPaneContent,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroImage } from "@/linkers";
import { UserInfo } from "@/lok-next/components/protected/UserInfo";
import { TwoDViewProvider } from "@/providers/view/ViewProvider";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { Download, DownloadIcon } from "lucide-react";
import { useEffect } from "react";
import Timestamp from "react-timestamp";
import {
  useGetImageQuery,
  usePinImageMutation,
  WatchRoisDocument,
  WatchRoisSubscription,
  WatchRoisSubscriptionVariables
} from "../api/graphql";
import RGBViewCard from "../components/cards/RGBViewCard";
import { FinalRender } from "../components/render/FInalRender";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";
import { PinToggle } from "../components/ui/PinToggle";
import { UpdateImageForm } from "../forms/UpdateImageForm";

export type IRepresentationScreenProps = {};

export const dimensionOrder = ["c", "t", "z", "y", "x"];

export default asDetailQueryRoute(
  useGetImageQuery,
  ({ data, refetch, subscribeToMore }) => {
    const x = data?.image?.store?.shape?.at(4);
    const y = data?.image?.store?.shape?.at(4);

    const aspectRatio = x && y ? x / y : 1;

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


    const defautContext = data?.image?.rgbContexts?.at(0);

    // Get pixel size from affine transformation views
    const affineView = data?.image?.affineTransformationViews?.at(0);
    const pixelSizeX = affineView?.pixelSizeX;
    const pixelSizeY = affineView?.pixelSizeY;

    const resolve = useResolve();
    return (
      <MikroImage.ModelPage
        title={data?.image?.name}
        object={data?.image?.id}
        pageActions={
          <div className="flex flex-row gap-2 ml-2">
            <MikroImage.ObjectButton object={data?.image?.id} />
            {data.image.renders && data.image.renders.length > 0 && (
              <Popover>
                <PopoverTrigger>
                  <Button variant="outline" className="w-full">
                    <DownloadIcon className="mr-2" />
                    Renders
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-3 flex flex-col gap-2">
                    {data.image.renders.map((render) => (
                      <Card className="p-2 truncate" key={render.id}>
                        {render.__typename == "Snapshot" && (
                          <Image
                            src={resolve(render.store.presignedUrl)}
                            className="w-full"
                          />
                        )}
                        <a href={resolve(render.store.presignedUrl)} download>
                          <Download size={24} />
                          {render.__typename}
                        </a>
                      </Card>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        }
        variant="black"
      >
        <TwoDViewProvider initialC={0} initialT={0} initialZ={0}>
          <div className="grid grid-cols-12 grid-reverse flex-col rounded-md  h-full flex relative">
            <div className="absolute w-full h-full overflow-hidden border-0">
              {defautContext && (
                <FinalRender
                  context={defautContext}
                  rois={data.image.rois}
                  pixelSizeX={pixelSizeX}
                  pixelSizeY={pixelSizeY}
                />
              )}
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col">
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
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex flex-col">
                        <div className="font-light">Chunks</div>
                        <div className="text-xl flex mb-2">
                          {data?.image?.store?.chunks?.map((val, index) => (
                            <div key={index}>
                              <span className="font-semibold">{val}</span>{" "}
                              <span className="text-xs font-light mr-1 ml-1 my-auto">
                                {" "}
                                {dimensionOrder[index]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
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

                  <div className="flex-row flex gap-2 mt-2"></div>

                  <div className="font-light mb-2">Channels</div>

                  <ResponsiveContainerGrid className="gap-3 ">
                    {defautContext?.views.map((view, index) => (
                      <>
                        <RGBViewCard view={view} key={"rgb-" + view.id} />
                      </>
                    ))}
                  </ResponsiveContainerGrid>
                  {data?.image.derivedFromViews?.length > 0 && (
                    <>
                      <div className="font-light">Derived images</div>
                      <div className="flex flex-col gap-2 mt-2">
                        {data?.image.derivedFromViews?.map((view) => (
                          <MikroImage.Smart
                            object={view.image.id}
                            key={view.image.id}
                          >
                            <MikroImage.DetailLink
                              object={view.image?.id}
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
