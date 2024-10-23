import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/ui/dropzone";
import { MikroDataset } from "@/linkers";
import { Komments } from "@/lok-next/components/komments/Komments";
import {
  DatasetFragment,
  useChildrenQuery,
  usePinDatasetMutation,
  usePutDatasetsInDatasetMutation,
  usePutImagesInDatasetMutation,
} from "@/mikro-next/api/graphql";
import { ViewType } from "@/mikro-next/pages/DatasetPage";
import { ArrowLeft, ArrowRight, LayoutList, ListIcon } from "lucide-react";
import DatasetCard from "../cards/DatasetCard";
import FileCard from "../cards/FileCard";
import ImageCard from "../cards/ImageCard";
import { ProvenanceSidebar } from "../sidebars/ProvenanceSidebar";
import { offset } from "@udecode/plate-floating";
import { useState } from "react";

export type IRepresentationScreenProps = {};

export const DatasetListExplorer = (props: {
  dataset: DatasetFragment;
  setView: (type: ViewType) => void;
}) => {
  const [pinDataset] = usePinDatasetMutation();
  const [putDatasets] = usePutDatasetsInDatasetMutation();
  const [putImages] = usePutImagesInDatasetMutation();

  const [pagination, setPagination] = useState({
    limit: 30,
    offset: 0,
  });

  const { data, loading, refetch, error } = useChildrenQuery({
    variables: {
      id: props.dataset.id,
      pagination: pagination,
    },
  });

  return (
    <MikroDataset.ModelPage
      title={props.dataset?.name}
      object={props.dataset.id}
      actions={<MikroDataset.Actions object={props.dataset.id} />}
      sidebars={
        <MultiSidebar
          map={{
            Comments: (
              <Komments identifier="@mikro/dataset" object={props.dataset.id} />
            ),
            Provenance: <ProvenanceSidebar items={props?.dataset.history} />,
          }}
        />
      }
      pageActions={
        <div className="flex flex-row gap-2">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() =>
              pinDataset({
                variables: {
                  input: { id: props.dataset.id, pin: !props.dataset.pinned },
                },
              })
            }
          >
            {props.dataset.pinned ? "Unpin" : "Pin"}
          </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => props.setView("list")}
          >
            <ListIcon />
          </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => props.setView("icons")}
            disabled={true}
          >
            <LayoutList />
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setPagination({
                limit: pagination.limit,
                offset: pagination.offset - pagination.limit,
              });
            }}
            disabled={pagination.offset - pagination.limit < 0}
          >
            <ArrowLeft />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPagination({
                limit: pagination.limit,
                offset: pagination.offset + pagination.limit,
              });
            }}
            disabled={
              data?.children && data?.children.length < pagination.limit
            }
          >
            <ArrowRight />
          </Button>
        </div>
      }
    >
      <div className="flex-grow">
        <div className="grid grid-cols-6 rounded-md gap-4 mt-2">
          {data?.children.map((child) => {
            if (child.__typename === "Dataset") {
              return <DatasetCard dataset={child} className="h-10" />;
            } else if (child.__typename === "Image") {
              return (
                <ImageCard image={child} className="h-20 w-full  ellipsis" />
              );
            } else if (child.__typename === "File") {
              return <FileCard file={child} className="h-10" />;
            } else {
              return <div>Unknown type</div>;
            }
          })}
        </div>
        <DropZone
          accepts={["item:@mikro/image", "list:@mikro/image"]}
          className="border border-gray-800 cursor-pointer rounded p-5 text-white bg-gray-900 hover:shadow-lg truncate"
          onDrop={async (item) => {
            await putImages({
              variables: {
                selfs: item.map((i) => i.id),
                other: props?.dataset?.id,
              },
            });
          }}
          canDropLabel={"Drag datasets here to associated with this Dataset"}
          overLabel={"Release to add"}
        />
        <DropZone
          accepts={["item:@mikro/dataset", "list:@mikro/dataset"]}
          className="border border-gray-800 cursor-pointer rounded p-5 text-white bg-gray-900 hover:shadow-lg truncate"
          onDrop={async (item) => {
            await putDatasets({
              variables: {
                selfs: item.map((i) => i.id),
                other: props?.dataset?.id,
              },
            });
          }}
          canDropLabel={"Drag datasets here to associated with this Dataset"}
          overLabel={"Release to add"}
        />
      </div>
    </MikroDataset.ModelPage>
  );
};
