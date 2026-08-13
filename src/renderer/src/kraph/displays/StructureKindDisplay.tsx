import { DisplayWidgetProps } from "@/lib/display/registry";
import { KraphStructureKind } from "@/linkers";
import { useGetStructureKindQuery } from "../api/graphql";

export const StructureKindDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetStructureKindQuery({ variables: { id: props.object } });

  if (!data?.structureKind) {
    return <div className="text-xs text-muted-foreground">Not found</div>;
  }

  const cat = data.structureKind;

  if (props.context === "command") {
    return (
      <KraphStructureKind.DetailLink object={{ id: props.object }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{cat.label}</span>
          <span className="text-xs text-muted-foreground font-mono shrink-0">{cat.identifier}</span>
        </div>
      </KraphStructureKind.DetailLink>
    );
  }

  return (
    <KraphStructureKind.DetailLink object={{ id: props.object }}>
      <div className="w-full rounded-lg border border-border/60 bg-card p-3 space-y-1">
        {cat.image?.presignedUrl && (
          <img src={cat.image.presignedUrl} alt={cat.label ?? cat.identifier} className="w-full h-20 object-cover rounded" />
        )}
        <div className="font-semibold text-sm">{cat.label || cat.identifier}</div>
        <div className="text-xs text-muted-foreground font-mono">{cat.identifier}</div>
        {cat.description && (
          <div className="text-xs text-muted-foreground line-clamp-2">{cat.description}</div>
        )}
      </div>
    </KraphStructureKind.DetailLink>
  );
};

