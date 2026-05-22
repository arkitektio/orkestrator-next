import { DisplayWidgetProps } from "@/lib/display/registry";
import { KraphProtocolEvent } from "@/linkers";
import { useGetProtocolEventQuery } from "../api/graphql";

export const ProtocolEventDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetProtocolEventQuery({ variables: { id: props.object } });

  if (!data?.protocolEvent) {
    return <div className="text-xs text-muted-foreground">Event not found</div>;
  }

  const event = data.protocolEvent;

  if (props.context === "command") {
    return (
      <KraphProtocolEvent.DetailLink object={event}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{event.label}</span>
          <span className="text-xs text-muted-foreground shrink-0">{event.category.label}</span>
        </div>
      </KraphProtocolEvent.DetailLink>
    );
  }

  return (
    <KraphProtocolEvent.DetailLink object={event}>
      <div className="w-full rounded-lg border border-border/60 bg-card p-3 space-y-1">
        <div className="font-semibold text-sm">{event.label}</div>
        <div className="text-xs text-muted-foreground">{event.category.label}</div>
        <div className="text-xs text-muted-foreground">
          {new Date(event.measuredFrom).toLocaleString()}
        </div>
      </div>
    </KraphProtocolEvent.DetailLink>
  );
};
