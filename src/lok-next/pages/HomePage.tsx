import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useCreateRoomMutation, useMeQuery } from "../api/graphql";
import { ThreadsCarousel } from "../components/carousels/ThreadsCarousel";
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
      <ThreadsCarousel />

      <Separator />
    </PageLayout>
  );
};

export default Page;
