import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { LokRoom } from "@/linkers";
import { Komments } from "@/lok-next/components/komments/Komments";
import { useEffect } from "react";
import {
  WatchMessagesDocument,
  WatchMessagesSubscription,
  WatchMessagesSubscriptionVariables,
  useDetailRoomQuery,
} from "../api/graphql";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailRoomQuery,
  ({ data, subscribeToMore }) => {
    useEffect(() => {
      console.log("RUning subscription");
      return subscribeToMore<
        WatchMessagesSubscription,
        WatchMessagesSubscriptionVariables
      >({
        document: WatchMessagesDocument,
        variables: {
          room: data.room.id,
          agentId: "default",
        },
        updateQuery: (prev, options) => {
          let message = options.subscriptionData.data.room.message;
          if (!message) {
            return prev;
          }
          return {
            room: {
              ...prev.room,
              messages: prev.room.messages.concat([message]),
            },
          };
        },
      });
    }, [subscribeToMore]);

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
        <ChatLayout navCollapsedSize={200} room={data.room} />
      </ModelPageLayout>
    );
  },
);
