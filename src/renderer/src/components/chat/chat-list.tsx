import {
  ListMessageFragment,
} from "@/alpaka/api/graphql";
import { Card, CardContent } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { cn } from "@/lib/utils";
import { useMeQuery } from "@/lok-next/api/graphql";
import { PortKind } from "@/rekuest/api/graphql";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, CheckCircle2, AlertCircle, XCircle, X, Ban, RefreshCw } from "lucide-react";
import { ActiveTask } from "./chat";
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DelegatingStructureWidget } from "../widgets/returns/DelegatingStructureWidget";
import ChatBottombar from "./chat-bottombar";
import { Markdown } from "@/components/ui/markdown";

interface ChatListProps {
  messages?: ListMessageFragment[];
  currentAgentId: string;
  sendMessage: (message: string) => void;
  isMobile: boolean;
  stagedStructures: { identifier: string; object: string }[];
  onRemoveStructure: (index: number) => void;
  prefillText?: string;
  activeTasks?: ActiveTask[];
  onDismissTask?: (reference: string) => void;
  onCancelTask?: (id: string, reference: string) => void;
  onRereply?: (messageId: string) => void;
  replyerControl?: React.ReactNode;
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
  stagedStructures,
  onRemoveStructure,
  prefillText,
  activeTasks = [],
  onDismissTask,
  onCancelTask,
  onRereply,
  replyerControl,
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
    <div className="flex min-h-0 flex-col flex-1 h-full overflow-hidden">
      <div
        ref={messagesContainerRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
      >
        <div className="flex flex-1 flex-col gap-3 px-3 py-4 sm:px-4">
          {messages?.length === 0 && (
            <div className="flex flex-1 items-center justify-center  text-center text-sm text-muted-foreground">
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
                <div className="relative group/msg w-full">
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
                        <Markdown text={message.text} isOwn={isOwnMessage} />
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
                                  __typename: "ReturnPort",
                                  key: structureIndex.toString(),
                                  nullable: false,
                                }}
                                value={s}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Rereply Hover Button */}
                  {onRereply && (
                    <div
                      className={cn(
                        "absolute top-2 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200 z-10",
                        isOwnMessage ? "left-2" : "right-2"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => onRereply(message.id)}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg border shadow-xs transition-all hover:scale-105 active:scale-95",
                          isOwnMessage
                            ? "bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20"
                            : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
                        )}
                        title="Re-run selected replyer on this message"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
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
      <div className="sticky bottom-0 px-3">
        {activeTasks.length > 0 && (
          <div className="flex flex-col gap-2 items-center">
            <AnimatePresence>
              {activeTasks.map((ass) => (
                <motion.div
                  key={ass.reference}
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={cn(
                    "flex items-center gap-3 rounded-full border px-4 py-2 text-xs shadow-md backdrop-blur-md transition-colors mb-2 max-w-[50%]",
                    ass.status === "DONE" && "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300",
                    ass.status === "ERROR" && "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
                    ass.status === "CANCELLED" && "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300",
                    (ass.status === "RUNNING" || ass.status === "PENDING") && "border-primary/20 bg-primary/5 text-primary-foreground/90 dark:text-primary"
                  )}
                >
                  {/* Status Indicator Icon */}
                  <div className="flex items-center justify-center shrink-0">
                    {(ass.status === "PENDING" || ass.status === "RUNNING") && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-current" />
                    )}
                    {ass.status === "DONE" && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-current" />
                    )}
                    {ass.status === "ERROR" && (
                      <AlertCircle className="h-3.5 w-3.5 text-current" />
                    )}
                    {ass.status === "CANCELLED" && (
                      <XCircle className="h-3.5 w-3.5 text-current" />
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[250px] flex items-center gap-1.5">
                      <span className="truncate">{ass.actionName}</span>
                      {ass.delegatedName && (
                        <span className="text-muted-foreground font-normal text-[10px] bg-muted/70 dark:bg-muted/30 border border-muted-foreground/10 px-1.5 py-0.5 rounded-full shrink-0">
                          {ass.delegatedName}
                        </span>
                      )}
                    </span>
                    {ass.message && (
                      <span className="text-muted-foreground truncate font-light text-[11px]">
                        • {ass.message}
                      </span>
                    )}
                  </div>

                  {/* Progress bar or percentage */}
                  {ass.progress !== undefined && ass.progress !== null && (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                        {Math.round(ass.progress)}%
                      </span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted/50 border border-muted-foreground/10">
                        <div
                          className="h-full bg-primary/80 transition-all duration-300 rounded-full"
                          style={{ width: `${Math.round(ass.progress)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Close/Cancel Button */}
                  {ass.status === "PENDING" || ass.status === "RUNNING" ? (
                    <button
                      type="button"
                      disabled={!ass.id}
                      onClick={() => ass.id && onCancelTask?.(ass.id, ass.reference)}
                      className="rounded-full p-1 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors shrink-0 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                      title="Cancel Replyer"
                    >
                      <Ban className="h-3 w-3" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onDismissTask?.(ass.reference)}
                      className="rounded-full p-1 hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      title="Dismiss"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        <ChatBottombar
          sendMessage={sendMessage}
          isMobile={isMobile}
          stagedStructures={stagedStructures}
          onRemoveStructure={onRemoveStructure}
          prefillText={prefillText}
          replyerControl={replyerControl}
        />
      </div>
    </div>
  );
}
