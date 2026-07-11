import { DisplayWidgetProps } from "@/lib/display/registry";
import { MikroInstrument } from "@/linkers";
import { useGetInstrumentQuery } from "@/mikro-next/api/graphql";

export const InstrumentDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetInstrumentQuery({ variables: { id: props.object } });

  if (!data?.instrument) {
    return <div className="text-xs text-muted-foreground">Instrument not found</div>;
  }

  const instrument = data.instrument;

  if (props.context === "command") {
    return (
      <MikroInstrument.DetailLink object={{ id: props.object }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{instrument.name}</span>
          {instrument.model && (
            <span className="text-xs text-muted-foreground shrink-0">{instrument.model}</span>
          )}
        </div>
      </MikroInstrument.DetailLink>
    );
  }

  return (
    <MikroInstrument.DetailLink object={{ id: props.object }}>
      <div className="w-full rounded-lg border border-border/60 bg-card p-3 space-y-1">
        <div className="font-semibold text-sm">{instrument.name}</div>
        {instrument.model && (
          <div className="text-xs text-muted-foreground">{instrument.model}</div>
        )}
        <div className="text-xs text-muted-foreground font-mono">{instrument.serialNumber}</div>
      </div>
    </MikroInstrument.DetailLink>
  );
};
