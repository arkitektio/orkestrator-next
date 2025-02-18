import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useCreateRoomMutation } from "../api/graphql";
import RoomsCarousel from "../components/carousels/RoomsCarousel";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createRoom] = useCreateRoomMutation({
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
      <RoomsCarousel />

      <Separator />
    </PageLayout>
  );
};

export default Page;
