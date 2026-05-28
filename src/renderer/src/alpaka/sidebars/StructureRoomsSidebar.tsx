import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from "@/components/ui/empty";
import { Identifier, Object } from "@/types";
import { useEffect, useState } from "react";
import {
  useCreateRoomMutation,
  useGetRoomQuery,
  useListRoomsQuery,
  WatchMessagesDocument,
  WatchMessagesSubscription,
  WatchMessagesSubscriptionVariables,
} from "../api/graphql";
import { Chat } from "@/components/chat/chat";
import { storeRoomTalkingAbout } from "../roomTalkingAbout";

export type StructureRoomsSidebarProps = {
  identifier: Identifier;
  object: Object;
};

const buildSidebarStorageKey = (identifier: Identifier, object: Object) =>
  `alpaka-structure-rooms:${identifier}:${object.id}`;

const StructureRoomView = ({ roomId }: { roomId: string }) => {
  const { data, loading, error, subscribeToMore } = useGetRoomQuery({
    variables: {
      id: roomId,
    },
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    return subscribeToMore<
      WatchMessagesSubscription,
      WatchMessagesSubscriptionVariables
    >({
      document: WatchMessagesDocument,
      variables: {
        room: roomId,
        agentId: "default",
      },
      updateQuery: (prev, options) => {
        const nextMessage = options.subscriptionData.data.room.message;

        if (!nextMessage) {
          return prev;
        }

        if (prev.room.messages.some((message) => message.id === nextMessage.id)) {
          return prev;
        }

        return {
          room: {
            ...prev.room,
            messages: prev.room.messages.concat([nextMessage]),
          },
        };
      },
    });
  }, [roomId, subscribeToMore]);

  if (loading && !data) {
    return <div className="p-3 text-xs text-muted-foreground">Loading room…</div>;
  }

  if (error) {
    return <div className="p-3 text-xs text-destructive">{error.message}</div>;
  }

  if (!data?.room) {
    return <div className="p-3 text-xs text-muted-foreground">Room unavailable.</div>;
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg ">
      <Chat
        isMobile={isMobile}
        room={data.room}
      />
    </div>
  );
};

const STRUCTURE_ROOMS_SIDEBAR_KEY = "structure-rooms-sidebar-accordion";

export const StructureRoomsSidebar = ({
  identifier,
  object,
}: StructureRoomsSidebarProps) => {
  const storageKey = `${STRUCTURE_ROOMS_SIDEBAR_KEY}:${buildSidebarStorageKey(identifier, object)}`;
  const { data, loading, error, refetch } = useListRoomsQuery({
    variables: {
      filter: {
        talkingAbout: {
          identifier,
          object: object.id,
        },
      },
      pagination: {
        limit: 20,
      },
    },
  });
  const [createRoom, { loading: creatingRoom }] = useCreateRoomMutation();
  const [activeRoomId, setActiveRoomId] = useState<string>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved || "";
  });

  useEffect(() => {
    if (activeRoomId) {
      localStorage.setItem(storageKey, activeRoomId);
    }
  }, [activeRoomId, storageKey]);

  const resolvedActiveRoomId = (() => {
    const firstRoomId = data?.rooms.at(0)?.id ?? "";

    if (!firstRoomId) {
      return "";
    }

    if (!activeRoomId) {
      return firstRoomId;
    }

    return data?.rooms.some((room) => room.id === activeRoomId)
      ? activeRoomId
      : firstRoomId;
  })();

  const handleCreateRoom = async () => {
    const result = await createRoom({
      variables: {
        input: {
          title: `Chat about ${identifier}`,
          description: `Talking about ${object.id}`,
          talkingAbout: [
            {
              identifier,
              object: object.id,
            },
          ],
        },
      },
    });

    const nextRoomId = result.data?.createRoom.id;
    await refetch();

    if (nextRoomId) {
      storeRoomTalkingAbout(nextRoomId, [
        {
          identifier,
          object: object.id,
        },
      ]);
      setActiveRoomId(nextRoomId);
    }
  };

  if (error) {
    return (
      <Empty>
        <EmptyTitle>Error loading rooms</EmptyTitle>
        <EmptyDescription>
          There was an error loading the conversations about this structure.
        </EmptyDescription>
        <EmptyContent>{error.message}</EmptyContent>
      </Empty>
    );
  }

  if (!loading && (data?.rooms.length ?? 0) === 0) {
    return (
      <Empty>
        <EmptyTitle>No rooms yet</EmptyTitle>
        <EmptyDescription>
          There are no Alpaka conversations attached to this structure yet.
        </EmptyDescription>
        <EmptyContent>
          <Button onClick={handleCreateRoom} disabled={creatingRoom} variant="outline">
            {creatingRoom ? "Opening…" : "Chat about"}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      value={resolvedActiveRoomId}
      onValueChange={setActiveRoomId}
      className="flex h-full min-h-0 flex-col overflow-hidden p-2"
    >
      {data?.rooms.map((room) => (
        <AccordionItem
          key={room.id}
          value={room.id}
          className="flex min-h-0 flex-col border-0 data-[state=open]:flex-1"
        >
          <AccordionTrigger className="shrink-0 truncate text-sm">{room.title}</AccordionTrigger>
          <AccordionContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
            {resolvedActiveRoomId === room.id && <StructureRoomView roomId={room.id} />}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default StructureRoomsSidebar;
