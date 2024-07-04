import { PageLayout } from "@/components/layout/PageLayout";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { PopularCarousel } from "@/lok-next/components/PopularCarousel";
import { withLokNext } from "@jhnnsrs/lok-next";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useCreateRoomMutation } from "../api/graphql";
import { ActionButton } from "@/components/ui/action";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createRoom] = withLokNext(useCreateRoomMutation)({
    refetchQueries: ["Rooms"],
  });

  return (
    <PageLayout
      title="Lok"
      actions={
        <>
          <ActionButton run={createRoom} title="Create Room">
            Create Room
          </ActionButton>
        </>
      }
    >
      <DetailPane className="p-3 @container">
        <PopularCarousel />
        <DetailPaneHeader></DetailPaneHeader>
      </DetailPane>

      <Separator />

      <div className="p-3 @container">
        <DetailPaneTitle>Hi</DetailPaneTitle>
      </div>
    </PageLayout>
  );
};

export default Page;
