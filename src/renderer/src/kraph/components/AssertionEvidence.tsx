import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FlaskConical } from "lucide-react";
import { useMeasurementsForAssertionLazyQuery } from "../api/graphql";

/**
 * The measurements backing an assertion. Loaded lazily — a graph view can hold
 * many assertions, and eagerly fetching each one's evidence is a request storm.
 */
export const AssertionEvidence = ({ assertionId }: { assertionId: string }) => {
  const [load, { data, loading, called }] = useMeasurementsForAssertionLazyQuery({
    variables: { assertionId },
  });

  const metrics = data?.measurementsForAssertion ?? [];

  return (
    <Popover onOpenChange={(open) => open && !called && load()}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          style={{ pointerEvents: "all" }}
        >
          <FlaskConical className="h-3 w-3 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-2">
          <h4 className="font-medium text-sm leading-none">Supporting evidence</h4>
          {loading && (
            <p className="text-xs text-muted-foreground">Loading measurements…</p>
          )}
          {called && !loading && metrics.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No measurements support this assertion.
            </p>
          )}
          {metrics.map((metric) => (
            <div key={metric.id} className="flex justify-between text-xs gap-2">
              <span className="text-muted-foreground truncate">
                {metric.kind?.label || metric.kind?.key || metric.key}
              </span>
              <span className="font-mono shrink-0">
                {String(metric.value)}
                {metric.unit ? ` ${metric.unit}` : ""}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AssertionEvidence;
