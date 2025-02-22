import {
  DetailRoomFragment,
  useSendMessageMutation,
} from "@/alpaka/api/graphql";
import { ChatList } from "./chat-list";
import { Message, UserData } from "./data";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
  room: DetailRoomFragment;
}

export function Chat({ messages, selectedUser, isMobile, room }: ChatProps) {
  const [send] = useSendMessageMutation({
    refetchQueries: ["DetailRoom"],
  });

  const sendMessage = (text: string) => {
    send({
      variables: {
        text: text,
        room: room.id,
        agentId: "default",
      },
    });
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
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
