import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { PopularCarousel } from "@/lok-next/components/PopularCarousel";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useCreateRoomMutation, useMeQuery } from "../api/graphql";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createRoom] = useCreateRoomMutation({
    refetchQueries: ["Rooms"],
  });
  const { data } = useMeQuery();

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
      <PopularCarousel />
      <DetailPaneHeader></DetailPaneHeader>

      <Separator />

      <div className="p-3 @container">
        <DetailPaneTitle>
          Hi {data?.me.firstName || data?.me.username}
        </DetailPaneTitle>
      </div>
    </PageLayout>
  );
};

export default Page;
