import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { ResponsiveContainerGrid } from "@/components/layout/ContainerGrid";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DetailPane,
  DetailPaneContent,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroDataset, MikroImage, MikroPixelView } from "@/linkers";
import { UserInfo } from "@/lok-next/components/protected/UserInfo";
import { TwoDViewProvider } from "@/providers/view/ViewProvider";
import { Matrix4 } from "@math.gl/core";
import { HobbyKnifeIcon, PlusIcon } from "@radix-ui/react-icons";
import { Download } from "lucide-react";
import { useMemo } from "react";
import Timestamp from "react-timestamp";
import {
  AffineTransformationViewFragment,
  useGetImageQuery,
  useGetPixelViewQuery,
  usePinImageMutation,
} from "../api/graphql";
import AcquisitionViewCard from "../components/cards/AcquisitionViewCard";
import ChannelViewCard from "../components/cards/ChannelViewCard";
import FileCard from "../components/cards/FileCard";
import LabelViewCard from "../components/cards/LabelViewCard";
import OpticsViewCard from "../components/cards/OpticsViewCard";
import RGBViewCard from "../components/cards/RGBViewCard";
import SpecimenViewCard from "../components/cards/SpecimenViewCard";
import TransformationViewCard from "../components/cards/TransformationViewCard";
import WellPositionViewCard from "../components/cards/WellPositionViewCard";
import { RGBD } from "../components/render/TwoDThree";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";
import { PinToggle } from "../components/ui/PinToggle";
import { AddImageViewForm } from "../forms/AddImageViewForm";
import { UpdateImageForm } from "../forms/UpdateImageForm";
import { VivRenderer } from "../components/render/VivRenderer";
import ROIViewCard from "../components/cards/ROIViewCard";
import FileViewCard from "../components/cards/FileViewCard";
import DerivedViewCard from "../components/cards/DerivedViewCard";
import { useParams } from "react-router-dom";
import { NotImplementedYet } from "@/app/components/fallbacks/NotImplemted";

export type IRepresentationScreenProps = {};

export const dimensionOrder = ["c", "t", "z", "y", "x"];

export default asDetailQueryRoute(useGetPixelViewQuery, ({ data, refetch }) => {
  const x = data?.pixelView.image?.store?.shape?.at(4);
  const y = data?.pixelView.image?.store?.shape?.at(4);
  const z = data?.pixelView.image?.store?.shape?.at(2) || 1;
  const t = data?.pixelView.image?.store?.shape?.at(1) || 1;
  const c = data?.pixelView.image?.store?.shape?.at(0) || 1;

  const aspectRatio = x && y ? x / y : 1;

  const [pinImage] = usePinImageMutation();

  const modelMatrix = useMemo(() => {
    const affineView = data?.pixelView.image?.views.find(
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
  }, [data?.pixelView.image?.views]);

  const resolve = useResolve();

  const { value } = useParams<{ id: string; value: string }>();

  return (
    <MikroPixelView.ModelPage
      title={data?.pixelView?.id}
      object={data?.pixelView?.id}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <MikroPixelView.Komments object={data?.pixelView?.id} />,
          }}
        />
      }
      pageActions={
        <>
          <MikroPixelView.ObjectButton object={data?.pixelView?.id} />
        </>
      }
      variant="black"
    >
      <TwoDViewProvider initialC={0} initialT={0} initialZ={0}>
        <div className="grid grid-cols-12 grid-reverse flex-col rounded-md gap-4 mt-2 h-full">
          <div className="absolute w-full h-full overflow-hidden border-0">
            {data?.pixelView.image?.rgbContexts?.map((context, index) => (
              <div className={"h-full w-full mt-0 rounded rounded-md relative"}>
                <div className="w-full h-full items-center flex justify-center flex-col">
                  <VivRenderer
                    context={context}
                    rois={data.pixelView.image.rois}
                    modelMatrix={modelMatrix}
                  />
                  <NotImplementedYet
                    className="absolute top-1/2 right-1/2"
                    message={
                      "Soon you will see the highlighted pixel values here"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <DetailPane className="col-span-3 @container p-2 bg-black bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 z-100 overflow-hidden">
            <DetailPaneHeader>
              <DetailPaneTitle
                actions={
                  <>
                    <PinToggle
                      onPin={(e) => {
                        data?.pixelView.id &&
                          pinImage({
                            variables: {
                              id: data?.pixelView?.id,
                              pin: e,
                            },
                          });
                      }}
                      pinned={data?.pixelView.image?.pinned || false}
                    />
                  </>
                }
                className="group flex-row flex justify-between"
              >
                <div className="flex flex-row gap-2">
                  {data?.pixelView.image?.name}{" "}
                  {value && (
                    <div className="text-muted-foreground">Value: {value}</div>
                  )}
                </div>
              </DetailPaneTitle>
            </DetailPaneHeader>

            <DetailPaneContent>
              {data?.pixelView.image?.dataset && (
                <>
                  <div className="font-light">In Dataset</div>
                  <Card className="flex flex-row mb-2 px-2 py-1">
                    <MikroDataset.DetailLink
                      className="text-xl cursor-pointer"
                      object={data?.pixelView?.image.id}
                    >
                      {data?.pixelView?.image.dataset.name}
                    </MikroDataset.DetailLink>
                  </Card>
                </>
              )}

              <div className="font-light mt-2 ">Created At</div>
              <div className="text-md mt-2 ">
                <Timestamp date={data?.pixelView.image?.createdAt} />
              </div>
              <div className="font-light mt-2 ">Created by</div>
              <div className="text-md mt-2 ">
                {data?.pixelView.image?.creator?.sub && (
                  <UserInfo sub={data?.pixelView.image?.creator?.sub} />
                )}
              </div>
              <div className="font-light">Shape</div>
              <div className="text-xl flex mb-2">
                {data?.pixelView.image?.store?.shape?.map((val, index) => (
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
                {data?.pixelView.image?.tags?.map((tag, index) => (
                  <>
                    <span className="font-semibold mr-2">#{tag} </span>
                  </>
                ))}
              </div>
              <div className="font-light">Views</div>
              <ResponsiveContainerGrid className="gap-3 ">
                {data?.pixelView.image.views?.map((view, index) => (
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
                    {view.__typename == "ROIView" && (
                      <ROIViewCard view={view} key={index} />
                    )}
                    {view.__typename == "FileView" && (
                      <FileViewCard view={view} key={index} />
                    )}
                    {view.__typename == "DerivedView" && (
                      <DerivedViewCard view={view} key={index} />
                    )}
                  </>
                ))}
                {data?.pixelView.image && (
                  <Card className="opacity-0 hover:opacity-100 relative">
                    <CardContent className="grid place-items-center w-full h-full">
                      <FormDialog
                        trigger={<PlusIcon className="text-xl" />}
                        onSubmit={async (data) => {
                          await refetch();
                        }}
                      >
                        <AddImageViewForm image={data?.pixelView.image.id} />
                      </FormDialog>
                    </CardContent>
                  </Card>
                )}
              </ResponsiveContainerGrid>
            </DetailPaneContent>
          </DetailPane>
        </div>
      </TwoDViewProvider>
    </MikroPixelView.ModelPage>
  );
});
