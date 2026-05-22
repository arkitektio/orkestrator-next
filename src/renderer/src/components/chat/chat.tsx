import {
  RoomFragment,
  useSendMessageMutation
} from "@/alpaka/api/graphql";
import { useSmartDrop } from "@/providers/smart/hooks";
import { MessageSquareText } from "lucide-react";
import { Card } from "../ui/card";
import { ChatList } from "./chat-list";

interface ChatProps {
  isMobile: boolean;
  room: RoomFragment;
}

export function Chat({ isMobile, room }: ChatProps) {
  const [send, { loading }] = useSendMessageMutation({
    refetchQueries: ["DetailRoom"],
  });

  const sendMessage = (text: string) => {
    send({
      variables: {
        input: { text: text, room: room.id, agentId: "default" },
      },
    });
  };

  const [{ isOver }, drop] = useSmartDrop((structures) => {
    send({
      variables: {
        input: {
          text: "",
          room: room.id,
          agentId: "default",
          attachStructures: structures,
        },
      },
    });
  });

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[inherit]"
      ref={drop}
    >
      {(isOver || loading) && (
        <div className="absolute top-0 left-0 z-50 h-full w-full backdrop-blur-sm">
          <div className="flex items-center justify-center h-full">
            <Card className="p-4">
              {loading ? "Adding..." : "Drop to Add to Chat"}
            </Card>
          </div>
        </div>
      )}
      <div className="border-b px-4 py-3 backdrop-blur ">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-muted/60 text-muted-foreground shadow-sm">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{room.title}</div>
            <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {room.description || "Ask questions, attach structures, and keep the context in one room."}
            </div>
          </div>
          <div className="hidden rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:block">
            {room.messages.length} {room.messages.length === 1 ? "message" : "messages"}
          </div>
        </div>
      </div>
      <ChatList
        messages={[...room.messages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )}
        currentAgentId="default"
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
