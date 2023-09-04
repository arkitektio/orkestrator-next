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

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <></>;

  const { data } = withMikroNext(useGetDatasetQuery)({
    variables: {
      id: id,
    },
  });

  const [pinDataset] = withMikroNext(usePinDatasetMutation)();
  const [putDatasets] = withMikroNext(usePutDatasetsInDatasetMutation)();
  const [releaseDatasets] = withMikroNext(
    useReleaseDatasetsFromDatasetMutation,
  )();
  const [putImages] = withMikroNext(usePutImagesInDatasetMutation)();
  const [releaseImage] = withMikroNext(useReleaseImagesFromDatasetMutation)();

  return (
    <PageLayout actions={<MikroDataset.Actions id={id} />}>
      <div className="p-3 flex-grow flex flex-col">
        <div className="flex flex-row">
          <div className="flex-grow" />
          <div className="flex text-white">
            {data?.dataset?.id && (
              <button
                type="button"
                onClick={() =>
                  pinDataset({
                    variables: {
                      id: data?.dataset?.id || "",
                      pin: !data?.dataset?.pinned || false,
                    },
                  })
                }
              >
                {data?.dataset?.pinned ? <BsPinFill /> : <BsPinAngle />}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col bg-white p-3 rounded rounded-md mt-2 mb-2">
          <div className="font-light mt-2 ">Created At</div>
          <div className="text-md mt-2 ">
            <Timestamp date={data?.dataset?.createdAt} />
          </div>
          <div className="font-light mt-2 ">Created by</div>
          <div className="font-light mt-2 ">Provenance</div>
          <div className="text-md mt-2 ">
            {data?.dataset?.history?.map((history, index) => (
              <HistoryCard key={index} history={history} />
            ))}
          </div>

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
                      other: id,
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
                      other: id,
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
      </div>
    </PageLayout>
  );
};

export default Page;
