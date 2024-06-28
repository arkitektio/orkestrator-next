import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { LokRoom } from "@/linkers";
import { Komments } from "@/lok-next/components/komments/Komments";
import { withLokNext } from "@jhnnsrs/lok-next";
import { useDetailRoomQuery } from "../api/graphql";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  withLokNext(useDetailRoomQuery),
  ({ data }) => {
    return (
      <ModelPageLayout
        title={data?.room?.title}
        identifier="@lok/room"
        object={data.room.id}
        actions={<LokRoom.Actions object={data.room.id} />}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <Komments identifier="@lok/room" object={data.room.id} />
              ),
            }}
          />
        }
      >
        <ChatLayout navCollapsedSize={200} />
      </ModelPageLayout>
    );
  },
);
