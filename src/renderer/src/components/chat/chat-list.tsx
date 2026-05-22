import {
  ListMessageFragment,
} from "@/alpaka/api/graphql";
import { Card, CardContent } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { cn } from "@/lib/utils";
import { useMeQuery } from "@/lok-next/api/graphql";
import { PortKind } from "@/rekuest/api/graphql";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DelegatingStructureWidget } from "../widgets/returns/DelegatingStructureWidget";
import ChatBottombar from "./chat-bottombar";

interface ChatListProps {
  messages?: ListMessageFragment[];
  currentAgentId: string;
  sendMessage: (message: string) => void;
  isMobile: boolean;
}

const getInitials = (value: string | undefined, fallback: string) => {
  const normalized = value?.trim();

  if (!normalized) {
    return fallback;
  }

  return normalized.slice(0, 2).toUpperCase();
};

export function ChatList({
  messages,
  currentAgentId,
  sendMessage,
  isMobile,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { data: meData } = useMeQuery();
  const resolve = useResolve();

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex min-h-0 flex-col flex-grow">
      <div
        ref={messagesContainerRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
      >
        <div className="flex flex-1 flex-col gap-3 px-3 py-4 sm:px-4">
          {messages?.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              Start the conversation. Messages and attached structures will appear here.
            </div>
          )}
          <AnimatePresence initial={false}>
          {messages?.map((message, index) => (
            (() => {
              const isOwnMessage = message.agent.id === currentAgentId;
              const messageTimestamp = new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const senderName = isOwnMessage
                ? meData?.me?.username || "You"
                : message.agent.id === "default"
                  ? "Assistant"
                  : `Agent ${message.agent.id}`;

              return (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: index * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex w-full items-end gap-3",
                isOwnMessage ? "justify-end" : "justify-start",
              )}
            >
              {!isOwnMessage && (
                <Avatar size="lg" className="mt-1 border bg-muted/60 shadow-sm">
                  <AvatarFallback className="bg-muted/60 text-muted-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={cn("flex max-w-[85%] min-w-0 flex-col gap-1", isOwnMessage && "items-end")}>
                <div className={cn("flex items-center gap-2 px-1 text-[11px] text-muted-foreground", isOwnMessage && "justify-end")}>
                  <span className="font-medium text-foreground/80">{senderName}</span>
                  <span>{messageTimestamp}</span>
                </div>
                <Card
                  className={cn(
                    "w-full overflow-hidden border shadow-sm",
                    isOwnMessage
                      ? "border-primary/20 bg-primary text-primary-foreground"
                      : "border-border/60 bg-card/95",
                  )}
                >
                  <CardContent className="space-y-3 p-3">
                    {message.text && (
                      <div className="whitespace-pre-wrap text-sm leading-6">{message.text}</div>
                    )}
                    {message.attachedStructures.length > 0 && (
                      <div
                        className={cn(
                          "space-y-2 rounded-xl border p-2",
                          isOwnMessage
                            ? "border-primary-foreground/15 bg-primary-foreground/10"
                            : "border-border/60 bg-muted/30",
                        )}
                      >
                        {message.attachedStructures.map((s, structureIndex) => (
                          <div
                            key={`${message.id}-${s.identifier}-${s.object}-${structureIndex}`}
                            className="overflow-hidden rounded-lg"
                          >
                            <DelegatingStructureWidget
                              port={{
                                kind: PortKind.Structure,
                                identifier: s.identifier,
                                __typename: "Port",
                                key: structureIndex.toString(),
                                nullable: false,
                              }}
                              value={s.object}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              {isOwnMessage && (
                <Avatar size="lg" className="mt-1 border bg-background shadow-sm">
                  <AvatarImage
                    src={resolve(meData?.me?.profile?.avatar?.presignedUrl)}
                    alt={meData?.me?.username || "You"}
                  />
                  <AvatarFallback>
                    {getInitials(meData?.me?.username, "YO")}
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
              );
            })()
          ))}
          </AnimatePresence>
        </div>
      </div>
      <ChatBottombar
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
