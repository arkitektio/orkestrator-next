import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ChatLayout } from "@/components/chat/chat-layout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { AlpakaRoom } from "@/linkers";
import { useEffect } from "react";
import {
  WatchMessagesDocument,
  WatchMessagesSubscription,
  WatchMessagesSubscriptionVariables,
  useGetRoomQuery,
} from "../api/graphql";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useGetRoomQuery,
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
      <AlpakaRoom.ModelPage
        title={data?.room?.title}
        object={data.room.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <AlpakaRoom.ObjectButton object={data.room.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <AlpakaRoom.Komments object={data.room.id} />,
            }}
          />
        }
      >
        <ChatLayout navCollapsedSize={200} room={data.room} />
      </AlpakaRoom.ModelPage>
    );
  },
);
