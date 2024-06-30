import {
  DetailRoomFragment,
  useSendMessageMutation,
} from "@/lok-next/api/graphql";
import { withLokNext } from "@jhnnsrs/lok-next";
import { ChatList } from "./chat-list";
import { Message, UserData } from "./data";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
  room: DetailRoomFragment;
}

export function Chat({ messages, selectedUser, isMobile, room }: ChatProps) {
  const [send] = withLokNext(useSendMessageMutation)({
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
        messages={room.messages}
        agent={{ id: "1" }}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
