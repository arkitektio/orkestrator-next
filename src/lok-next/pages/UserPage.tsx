import { PageLayout } from "@/components/layout/PageLayout";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroDataset } from "@/linkers";
import { withLokNext } from "@jhnnsrs/lok-next";
import React from "react";
import { useParams } from "react-router";
import { useUserQuery } from "../api/graphql";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <></>;

  const { data } = withLokNext(useUserQuery)({
    variables: {
      id: id,
    },
  });

  return (
    <PageLayout actions={<MikroDataset.Actions id={id} />}>
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle>{data?.user?.username}</DetailPaneTitle>
        </DetailPaneHeader>
      </DetailPane>
    </PageLayout>
  );
};

export default Page;
