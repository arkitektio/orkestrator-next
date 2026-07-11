import { DisplayWidgetProps } from "@/lib/display/registry";
import { MikroTable } from "@/linkers";
import { useGetTableQuery } from "@/mikro-next/api/graphql";

export const TableDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetTableQuery({ variables: { id: props.object } });

  if (!data?.table) {
    return <div className="text-xs text-muted-foreground">Table not found</div>;
  }

  const table = data.table;
  const columnCount = table.columns?.length ?? 0;

  if (props.context === "command") {
    return (
      <MikroTable.DetailLink object={{ id: props.object }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{table.name}</span>
          {columnCount > 0 && (
            <span className="text-xs text-muted-foreground shrink-0">
              {columnCount} {columnCount === 1 ? "column" : "columns"}
            </span>
          )}
        </div>
      </MikroTable.DetailLink>
    );
  }

  return (
    <MikroTable.DetailLink object={{ id: props.object }}>
      <div className="w-full rounded-lg border border-border/60 bg-card p-3 space-y-2">
        <div className="font-semibold text-sm">{table.name}</div>
        {columnCount > 0 && (
          <div className="flex flex-wrap gap-1">
            {table.columns.slice(0, 6).map((col) => (
              <span
                key={col.name}
                className="text-xs bg-muted/60 rounded px-1.5 py-0.5 font-mono"
              >
                {col.name}
              </span>
            ))}
            {columnCount > 6 && (
              <span className="text-xs text-muted-foreground">+{columnCount - 6} more</span>
            )}
          </div>
        )}
      </div>
    </MikroTable.DetailLink>
  );
};
