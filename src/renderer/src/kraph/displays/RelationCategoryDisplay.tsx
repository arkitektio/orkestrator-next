import { DisplayWidgetProps } from "@/lib/display/registry";
import { KraphRelationCategory } from "@/linkers";
import { useGetRelationCategoryQuery } from "../api/graphql";

export const RelationCategoryDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetRelationCategoryQuery({ variables: { id: props.object } });

  if (!data?.relationCategory) {
    return <div className="text-xs text-muted-foreground">Not found</div>;
  }

  const cat = data.relationCategory;

  if (props.context === "command") {
    return (
      <KraphRelationCategory.DetailLink object={{ id: props.object }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{cat.label}</span>
          {cat.description && (
            <span className="text-xs text-muted-foreground truncate">{cat.description}</span>
          )}
        </div>
      </KraphRelationCategory.DetailLink>
    );
  }

  return (
    <KraphRelationCategory.DetailLink object={{ id: props.object }}>
      <div className="w-full rounded-lg border border-border/60 bg-card p-3 space-y-1">
        <div className="font-semibold text-sm">{cat.label}</div>
        {cat.description && (
          <div className="text-xs text-muted-foreground line-clamp-2">{cat.description}</div>
        )}
      </div>
    </KraphRelationCategory.DetailLink>
  );
};
