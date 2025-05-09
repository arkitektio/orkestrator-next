import { cn } from "@/lib/utils";
import {
  RoomFragment,
  ListMessageFragment,
} from "@/alpaka/api/graphql";
import { PortKind } from "@/rekuest/api/graphql";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DelegatingStructureWidget } from "../widgets/returns/DelegatingStructureWidget";
import ChatBottombar from "./chat-bottombar";

interface ChatListProps {
  messages?: ListMessageFragment[];
  agent: { id: string };
  sendMessage: (message: string) => void;
  isMobile: boolean;
  room: RoomFragment;
}

export function ChatList({
  messages,
  agent,
  sendMessage,
  isMobile,
  room,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap dark:text-white",
                message.agent.id !== agent.id ? "items-end" : "items-start",
              )}
            >
              <div className="flex gap-3 bg-accent p-1 rounded-md max-w-xs flex-col">
                <div className="flex flex-row gap-2">
                  <span className=" bg-accent p-3 rounded-md max-w-xs">
                    {message.text}
                  </span>
                  {message.agent.id !== agent.id && (
                    <Avatar className="flex justify-center items-center">
                      <AvatarImage
                        src={message.id}
                        alt={message.id}
                        width={6}
                        height={6}
                      />
                    </Avatar>
                  )}
                  {message.attachedStructures.length > 0 && (
                    <div className="bg-black p-1 rounded-md max-w-xs">
                      {message.attachedStructures.map((s, index) => (
                        <DelegatingStructureWidget
                          port={{
                            kind: PortKind.Structure,
                            identifier: s.identifier,
                            __typename: "Port",
                            key: index.toString(),
                            nullable: false,
                          }}
                          value={s.object}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-row gap-2 items-center ">
                  <span className="text-xs text-muted-foreground">
                    {message.agent.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar
        sendMessage={sendMessage}
        isMobile={isMobile}
        room={room}
      />
    </div>
  );
}
