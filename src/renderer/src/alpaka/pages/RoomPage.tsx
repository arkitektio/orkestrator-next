import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ChatLayout } from "@/components/chat/chat-layout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisplayWidget } from "@/command/Menu";
import { AlpakaRoom } from "@/linkers";
import { useEffect } from "react";
import {
  WatchMessagesDocument,
  WatchMessagesSubscription,
  WatchMessagesSubscriptionVariables,
  useGetRoomQuery,
} from "../api/graphql";
import { getRoomTalkingAbout } from "../roomTalkingAbout";


export const RoomPage =  asDetailQueryRoute(
  useGetRoomQuery,
  ({ data, subscribeToMore }) => {
    const talkingAboutStructures = getRoomTalkingAbout(data.room.id);

    useEffect(() => {
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
          const message = options.subscriptionData.data.room.message;
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
    }, [data.room.id, subscribeToMore]);

    return (
      <AlpakaRoom.ModelPage
        title={data?.room?.title}
        object={data.room}
        pageActions={
          <div className="flex flex-row gap-2">
            <AlpakaRoom.ObjectButton object={data.room} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <AlpakaRoom.Komments object={data.room} />,
            }}
          />
        }
      >
        <div className="space-y-4">
          {talkingAboutStructures.length > 0 ? (
            <Card className="border-border/60 bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Talking About</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {talkingAboutStructures.map((structure) => (
                  <div
                    key={`${structure.identifier}:${structure.object}`}
                    className="overflow-hidden rounded-xl border border-border/60 bg-muted/20 p-2"
                  >
                    <DisplayWidget
                      identifier={structure.identifier}
                      object={structure.object}
                      link
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <ChatLayout navCollapsedSize={200} room={data.room} />
        </div>
      </AlpakaRoom.ModelPage>
    );
  },
);


export default RoomPage;
