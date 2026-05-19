import { DisplayWidgetProps } from "@/lib/display/registry";
import { KraphNaturalEvent } from "@/linkers";
import { useGetNaturalEventQuery } from "../api/graphql";

export const NaturalEventDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetNaturalEventQuery({ variables: { id: props.object } });

  if (!data?.naturalEvent) {
    return <div className="text-xs text-muted-foreground">Event not found</div>;
  }

  const event = data.naturalEvent;

  if (props.context === "command") {
    return (
      <KraphNaturalEvent.DetailLink object={event}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{event.label}</span>
        </div>
      </KraphNaturalEvent.DetailLink>
    );
  }

  return (
    <KraphNaturalEvent.DetailLink object={event}>
      <div className="w-full rounded-lg border border-border/60 bg-card p-3 space-y-1">
        <div className="font-semibold text-sm">{event.label}</div>
        <div className="text-xs text-muted-foreground">
          {new Date(event.measuredFrom).toLocaleString()} – {new Date(event.measuredTo).toLocaleString()}
        </div>
      </div>
    </KraphNaturalEvent.DetailLink>
  );
};
