import { DisplayWidgetProps } from "@/lib/display/registry";
import { KraphMetricCategory } from "@/linkers";
import { useGetMetricCategoryQuery } from "../api/graphql";

export const MetricCategoryDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetMetricCategoryQuery({ variables: { id: props.object } });

  if (!data?.metricCategory) {
    return <div className="text-xs text-muted-foreground">Not found</div>;
  }

  const cat = data.metricCategory;

  if (props.context === "command") {
    return (
      <KraphMetricCategory.DetailLink object={{ id: props.object }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{cat.label}</span>
          <span className="text-xs text-muted-foreground shrink-0">{cat.valueKind}</span>
        </div>
      </KraphMetricCategory.DetailLink>
    );
  }

  return (
    <KraphMetricCategory.DetailLink object={{ id: props.object }}>
      <div className="w-full rounded-lg border border-border/60 bg-card p-3 space-y-1">
        {cat.image?.presignedUrl && (
          <img src={cat.image.presignedUrl} alt={cat.label} className="w-full h-20 object-cover rounded" />
        )}
        <div className="font-semibold text-sm">{cat.label}</div>
        <div className="text-xs text-muted-foreground">{cat.valueKind}</div>
        {cat.description && (
          <div className="text-xs text-muted-foreground line-clamp-2">{cat.description}</div>
        )}
      </div>
    </KraphMetricCategory.DetailLink>
  );
};
