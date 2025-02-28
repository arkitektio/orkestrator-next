import {
  DetailRoomFragment,
  useSendMessageMutation,
} from "@/alpaka/api/graphql";
import { ChatList } from "./chat-list";
import { Message, UserData } from "./data";
import { useSmartDrop } from "@/providers/smart/hooks";
import { Card } from "../ui/card";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
  room: DetailRoomFragment;
}

export function Chat({ messages, selectedUser, isMobile, room }: ChatProps) {
  const [send, {loading}] = useSendMessageMutation({
    refetchQueries: ["DetailRoom"],
  });

  const sendMessage = (text: string) => {
    send({
      variables: {
        input: {text: text,
        room: room.id,
        agentId: "default",
        }
      },
    });
  };

  const [{ isOver, canDrop }, drop] = useSmartDrop((structures) => {
    send({
      variables: {
        input: {text: "",
        room: room.id,
        agentId: "default",
        attachStructures: structures
        }
        
      },
    });
  });

  return (
    <div className="flex flex-col justify-between w-full h-full" ref={drop}>
      
      {(isOver|| loading )&& <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm z-50">
        <div className="flex items-center justify-center h-full">
          <Card className="p-4">
            {loading ? "Adding..." : "Drop to Add to Chat"}
          </Card>
        </div>
    </div>}
      <ChatList
        messages={[...room.messages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )}
        agent={{ id: "1" }}
        sendMessage={sendMessage}
        isMobile={isMobile}
        room={room}
      />
    </div>
  );
}
