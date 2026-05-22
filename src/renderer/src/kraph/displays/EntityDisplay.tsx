import { DisplayWidgetProps } from "@/lib/display/registry";
import { KraphEntity } from "@/linkers";
import { useGetEntityQuery } from "../api/graphql";

export const EntityDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetEntityQuery({ variables: { id: props.object } });

  if (!data?.entity) {
    return <div className="text-xs text-muted-foreground">Entity not found</div>;
  }

  const entity = data.entity;

  if (props.context === "command") {
    return (
      <KraphEntity.DetailLink object={entity}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{entity.label}</span>
          <span className="text-xs text-muted-foreground shrink-0">{entity.category.label}</span>
        </div>
      </KraphEntity.DetailLink>
    );
  }

  return (
    <KraphEntity.DetailLink object={entity}>
      <div className="w-full rounded-lg border border-border/60 bg-card p-3 space-y-1">
        <div className="font-semibold text-sm">{entity.label}</div>
        <div className="text-xs text-muted-foreground">{entity.category.label}</div>
      </div>
    </KraphEntity.DetailLink>
  );
};
