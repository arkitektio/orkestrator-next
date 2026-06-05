import { DisplayWidgetProps } from "@/lib/display/registry";
import { AlpakaMessage, AlpakaRoom } from "@/linkers";
import { useGetMessageRoomQuery } from "../api/graphql";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, MessageSquare, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DelegatingStructureWidget } from "@/components/widgets/returns/DelegatingStructureWidget";
import { PortKind } from "@/rekuest/api/graphql";
import { Markdown } from "@/components/ui/markdown";

export const MessageDisplay = (props: DisplayWidgetProps) => {
  const { data, loading } = useGetMessageRoomQuery({
    variables: {
      messageId: props.object,
    },
    skip: !props.object,
  });

  let foundMessage: any = null;
  let foundRoom: any = null;

  if (data?.rooms) {
    for (const room of data.rooms) {
      const msg = room.messages.find((m) => m.id === props.object);
      if (msg) {
        foundMessage = msg;
        foundRoom = room;
        break;
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed p-3 text-xs text-muted-foreground animate-pulse">
        Loading message...
      </div>
    );
  }

  if (!foundMessage) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed p-3 text-xs text-muted-foreground">
        Message not found
      </div>
    );
  }

  const senderName = foundMessage.agent.id === "default" ? "Assistant" : `Agent ${foundMessage.agent.id}`;
  const messageTimestamp = new Date(foundMessage.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (props.context === "command") {
    return (
      <AlpakaMessage.Smart object={foundMessage}>
        {foundRoom ? (
          <AlpakaRoom.DetailLink object={foundRoom}>
            <div className="flex items-center gap-2 min-w-0 hover:text-foreground/80 transition-colors">
              <span className="font-semibold text-xs text-primary shrink-0">
                {senderName}
              </span>
              <span className="text-xs truncate text-muted-foreground">
                {foundMessage.text || (foundMessage.attachedStructures.length > 0 ? "Sent attachments" : "")}
              </span>
            </div>
          </AlpakaRoom.DetailLink>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-xs text-primary shrink-0">
              {senderName}
            </span>
            <span className="text-xs truncate text-muted-foreground">
              {foundMessage.text}
            </span>
          </div>
        )}
      </AlpakaMessage.Smart>
    );
  }

  const content = (
    <Card className="border-border/60 bg-card/95 shadow-md overflow-hidden hover:border-primary/45 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-3">
            <Avatar size="lg" className="border bg-muted/60 shadow-sm">
              <AvatarFallback className="bg-muted/60 text-muted-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground/90">{senderName}</span>
              <span className="text-[10px] text-muted-foreground">{messageTimestamp}</span>
            </div>
          </div>
          {foundRoom && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="max-w-[120px] truncate">{foundRoom.title}</span>
              <ArrowUpRight className="h-3 w-3 shrink-0" />
            </div>
          )}
        </div>

        {foundMessage.text && (
          <Markdown text={foundMessage.text} isOwn={false} />
        )}

        {foundMessage.attachedStructures.length > 0 && (
          <div className="space-y-2 rounded-xl border border-border/50 p-2.5 bg-muted/30">
            {foundMessage.attachedStructures.map((s: any, index: number) => (
              <div
                key={`${foundMessage.id}-${s.identifier}-${s.object}-${index}`}
                className="overflow-hidden rounded-lg shadow-sm border bg-background"
              >
                <DelegatingStructureWidget
                  port={{
                    kind: PortKind.Structure,
                    identifier: s.identifier,
                    __typename: "ReturnPort",
                    key: index.toString(),
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
  );

  return (
    <AlpakaMessage.Smart object={foundMessage}>
      {foundRoom ? (
        <AlpakaRoom.DetailLink object={foundRoom}>
          {content}
        </AlpakaRoom.DetailLink>
      ) : (
        content
      )}
    </AlpakaMessage.Smart>
  );
};
