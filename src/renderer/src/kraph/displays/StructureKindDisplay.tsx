import { DisplayWidgetProps } from "@/lib/display/registry";
import { KraphStructureCategory } from "@/linkers";
import { useGetStructureCategoryQuery } from "../api/graphql";

export const StructureCategoryDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetStructureCategoryQuery({ variables: { id: props.object } });

  if (!data?.structureCategory) {
    return <div className="text-xs text-muted-foreground">Not found</div>;
  }

  const cat = data.structureCategory;

  if (props.context === "command") {
    return (
      <KraphStructureCategory.DetailLink object={{ id: props.object }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{cat.label}</span>
          <span className="text-xs text-muted-foreground font-mono shrink-0">{cat.identifier}</span>
        </div>
      </KraphStructureCategory.DetailLink>
    );
  }

  return (
    <KraphStructureCategory.DetailLink object={{ id: props.object }}>
      <div className="w-full rounded-lg border border-border/60 bg-card p-3 space-y-1">
        {cat.image?.presignedUrl && (
          <img src={cat.image.presignedUrl} alt={cat.label} className="w-full h-20 object-cover rounded" />
        )}
        <div className="font-semibold text-sm">{cat.label}</div>
        <div className="text-xs text-muted-foreground font-mono">{cat.identifier}</div>
        {cat.description && (
          <div className="text-xs text-muted-foreground line-clamp-2">{cat.description}</div>
        )}
        <div className="text-xs text-muted-foreground">{cat.graph.name}</div>
      </div>
    </KraphStructureCategory.DetailLink>
  );
};

