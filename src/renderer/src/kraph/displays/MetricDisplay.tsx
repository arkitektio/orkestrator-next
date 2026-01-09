import { DisplayWidgetProps } from "@/lib/display/registry";
import { useGetMetricQuery } from "../api/graphql";
import { KraphMetric } from "@/linkers";

export const MetricDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetMetricQuery({
    variables: { id: props.object },
  });

  return (
    <KraphMetric.DetailLink object={props.object}>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-light text-muted-foreground">{data?.metric.category.label}</h1>
        <p className="text-sm text-muted-foreground">{data?.metric.category.description}</p>
        <p className="text-foreground text-2xl font-bold">
          {data?.metric.value || "No value available."}
        </p>
        {/* Additional components or content can be added here */}
      </div>
    </KraphMetric.DetailLink>
  );
};
