import { ListRender } from "@/components/layout/ListRender";
import { PageLayout } from "@/components/layout/PageLayout";
import { DropZone } from "@/components/ui/dropzone";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroDataset } from "@/linkers";
import { withOmeroArk } from "@jhnnsrs/omero-ark";
import React from "react";
import { useParams } from "react-router";
import {
  useGetProjectQuery
} from "../api/graphql";
import DatasetCard from "../components/cards/DatasetCard";
import { Komments } from "@/lok-next/components/komments/Komments";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <></>;

  const { data } = withOmeroArk(useGetProjectQuery)({
      variables: {id},
    },
  );

  return (
    <PageLayout actions={<MikroDataset.Actions id={id} />}  sidebars={<Komments identifier="@omero-ark/project" object={id} />}>
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle
            actions={
              <>
              </>
            }
          >
            {data?.project?.name}
          </DetailPaneTitle>
        </DetailPaneHeader>
        <div className="flex flex-col  p-3 rounded rounded-md mt-2 mb-2">
          <div className="font-light mt-2 ">Created At</div>
          <div className="font-light mt-2 ">Created by</div>

          <div className="font-light mt-2 ">Tags</div>
          <div className="text-xl flex mb-2">
            {data?.project?.tags?.map((tag, index) => (
              <>
                <span className="font-semibold mr-2">#{tag} </span>
              </>
            ))}
          </div>
        </div>
        <ListRender
          title="Contained Dataset"
          array={data?.project?.datasets}
        >
          {(item, index) => <DatasetCard dataset={item} key={index} />}
        </ListRender>
      </DetailPane>
    </PageLayout>
  );
};

export default Page;
