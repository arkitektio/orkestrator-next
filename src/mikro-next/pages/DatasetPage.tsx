import React from "react";
import { BsPinAngle, BsPinFill } from "react-icons/bs";
import { useParams } from "react-router";
import Timestamp from "react-timestamp";
import {
  useGetDatasetQuery,
  usePinDatasetMutation,
  usePutDatasetsInDatasetMutation,
  usePutImagesInDatasetMutation,
  useReleaseDatasetsFromDatasetMutation,
  useReleaseImagesFromDatasetMutation,
} from "../api/graphql";
import DatasetCard from "../components/cards/DatasetCard";
import FileCard from "../components/cards/FileCard";
import HistoryCard from "../components/cards/HistoryCard";
import ImageCard from "../components/cards/ImageCard";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { PageLayout } from "@/components/layout/PageLayout";
import { MikroDataset } from "@/linkers";
import { ListRender } from "@/components/layout/ListRender";
import { DropZone } from "@/components/ui/dropzone";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { PinToggle } from "../components/ui/PinToggle";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { FormSheet } from "@/components/dialog/FormDialog";
import { UpdateDatasetForm } from "../forms/UpdateDatasetForm";
import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { Komments } from "@/lok-next/components/komments/Komments";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  withMikroNext(useGetDatasetQuery),
  ({ data }) => {
    const [pinDataset] = withMikroNext(usePinDatasetMutation)();
    const [putDatasets] = withMikroNext(usePutDatasetsInDatasetMutation)();
    const [releaseDatasets] = withMikroNext(
      useReleaseDatasetsFromDatasetMutation,
    )();
    const [putImages] = withMikroNext(usePutImagesInDatasetMutation)();
    const [releaseImage] = withMikroNext(useReleaseImagesFromDatasetMutation)();

    return (
      <ModelPageLayout
        title={data?.dataset?.name}
        identifier="@mikro/dataset"
        object={data.dataset.id}
        actions={<MikroDataset.Actions id={data.dataset.id} />}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <Komments
                  identifier="@mikro/dataset"
                  object={data.dataset.id}
                />
              ),
              Provenance: <ProvenanceSidebar items={data?.dataset.history} />,
            }}
          />
        }
      >
        <DetailPane className="p-3 @container">
          <DetailPaneHeader>
            <DetailPaneTitle
              actions={
                <>
                  <PinToggle
                    onPin={(e) => {
                      data?.dataset.id;
                    }}
                    pinned={data?.dataset?.pinned || false}
                  />
                  <FormSheet trigger={<HobbyKnifeIcon />}>
                    {data?.dataset && (
                      <UpdateDatasetForm dataset={data?.dataset} />
                    )}
                  </FormSheet>
                </>
              }
            >
              {data?.dataset?.name}
            </DetailPaneTitle>
          </DetailPaneHeader>
          <div className="flex flex-col bg-white p-3 rounded rounded-md mt-2 mb-2">
            <div className="font-light mt-2 ">Created At</div>
            <div className="text-md mt-2 ">
              <Timestamp date={data?.dataset?.createdAt} />
            </div>
            <div className="font-light mt-2 ">Created by</div>

            <div className="font-light mt-2 ">Tags</div>
            <div className="text-xl flex mb-2">
              {data?.dataset?.tags?.map((tag, index) => (
                <>
                  <span className="font-semibold mr-2">#{tag} </span>
                </>
              ))}
            </div>
          </div>
          <ListRender
            title="Contained Datasets"
            array={data?.dataset?.children}
            additionalChildren={
              <>
                <DropZone
                  accepts={["item:@mikro/dataset", "list:@mikro/dataset"]}
                  className="border border-gray-800 cursor-pointer rounded p-5 text-white bg-gray-900 hover:shadow-lg truncate"
                  onDrop={async (item) => {
                    await putDatasets({
                      variables: {
                        selfs: item.map((i) => i.id),
                        other: data?.dataset?.id,
                      },
                    });
                  }}
                  canDropLabel={
                    "Drag datasets here to associated with this Dataset"
                  }
                  overLabel={"Release to add"}
                />
              </>
            }
          >
            {(dataset, index) => <DatasetCard dataset={dataset} key={index} />}
          </ListRender>
          <ListRender
            title="Contained Images"
            array={data?.dataset?.images}
            additionalChildren={
              <>
                <DropZone
                  accepts={["item:@mikro/image", "list:@mikro/image"]}
                  className="border border-gray-800 cursor-pointer rounded p-5 text-white bg-gray-900 hover:shadow-lg truncate"
                  onDrop={async (item) => {
                    await putImages({
                      variables: {
                        selfs: item.map((i) => i.id),
                        other: data?.dataset?.id,
                      },
                    });
                  }}
                  canDropLabel={
                    "Drag datasets here to associated with this Dataset"
                  }
                  overLabel={"Release to add"}
                />
              </>
            }
          >
            {(image, index) => <ImageCard image={image} key={index} />}
          </ListRender>
        </DetailPane>
      </ModelPageLayout>
    );
  },
);
