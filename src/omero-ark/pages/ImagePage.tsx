import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroDataset } from "@/linkers";
import { Komments } from "@/lok-next/components/komments/Komments";
import { withOmeroArk } from "@jhnnsrs/omero-ark";
import React from "react";
import { useParams } from "react-router";
import { useGetImageQuery } from "../api/graphql";
import AuthorizedImage from "../components/Thumbnail";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <></>;

  const { data } = withOmeroArk(useGetImageQuery)({
    variables: { id },
  });

  return (
    <PageLayout
      title={data?.image?.name}
      actions={<MikroDataset.Actions id={id} />}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <Komments identifier="@omero-ark/image" object={id} />,
          }}
        />
      }
    >
      <div className="flex @2xl:flex-row-reverse flex-col rounded-md gap-4 mt-2 w-full">
        <div className="flex-1 overflow-hidden ">
          <div className=" group overflow-hidden rounded rounded-md shadow shadow-xl relative">
            <AuthorizedImage id={id} />
          </div>
        </div>
        <DetailPane className="flex-grow p-3 @container">
          <DetailPaneHeader>
            <DetailPaneTitle actions={<></>}>
              {data?.image?.name}
            </DetailPaneTitle>
          </DetailPaneHeader>
          <div className="flex flex-col p-3 rounded rounded-md mt-2 mb-2">
            <div className="font-light mt-2 ">Created At</div>
            <div className="font-light mt-2 ">Created by</div>

            <div className="font-light mt-2 ">Tags</div>
            <div className="text-xl flex mb-2">
              {data?.image?.tags?.map((tag, index) => (
                <>
                  <span className="font-semibold mr-2">#{tag} </span>
                </>
              ))}
            </div>
          </div>
        </DetailPane>
      </div>
    </PageLayout>
  );
};

export default Page;
