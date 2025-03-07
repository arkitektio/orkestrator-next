import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useCreateRoomMutation } from "../api/graphql";
import RoomsCarousel from "../components/carousels/RoomsCarousel";
import { useNavigate } from "react-router-dom";
import { AlpakaRoom } from "@/linkers";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createRoom] = useCreateRoomMutation({
    refetchQueries: ["Rooms"],
  });

  const navigate = useNavigate();



  const handleCreateRoom = async () => {
    const { data } = await createRoom();
    if (data?.createRoom) {
      navigate(AlpakaRoom.linkBuilder(data.createRoom.id));
    }
  }


  return (
    <PageLayout
      title="Alpaka"
      pageActions={
        <>
          <ActionButton run={handleCreateRoom} title="Create Room" variant={"outline"} label="Create Room">
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
