import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useCreateRoomMutation } from "../api/graphql";
import RoomsCarousel from "../components/carousels/RoomsCarousel";
import { useNavigate } from "react-router-dom";
import { AlpakaRoom } from "@/linkers";
import RoomList from "../components/lists/RoomList";
import ProviderList from "../components/lists/ProviderList";
import LLMModelList from "../components/lists/LLMModelList";
import CollectionList from "../components/lists/CollectionList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createRoom] = useCreateRoomMutation({
    refetchQueries: ["Rooms"],
  });

  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const { data } = await createRoom({
      variables: {
        input: {
          title: "New Room",
          description: "A new room created from the home page",
        },
      },
    });
    if (data?.createRoom) {
      navigate(AlpakaRoom.linkBuilder(data.createRoom.id));
    }
  };

  return (
    <PageLayout
      title="Alpaka"
      pageActions={
        <>
          <ActionButton
            run={handleCreateRoom}
            title="Create Room"
            variant={"outline"}
            label="Create Room"
          >
            Create Room
          </ActionButton>
        </>
      }
    >
      <RoomsCarousel />

      <RoomList />
      <ProviderList />
      <LLMModelList />
      <CollectionList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
