import { useGetCoordinateGraphQuery } from "@/mikro-next/api/graphql";
import CoordinateGraphFlow from "./CoordinateGraphFlow";

/**
 * The connected component of the coordinate graph around one system, rendered
 * as a flow. Reachability is undirected — a calibration pointing *into* the
 * system you started from belongs to its component just as much as an edge
 * pointing out — so the walk shows a dataset's whole neighbourhood: its pyramid
 * levels, its calibrations, and the scenes it is registered into.
 */
export const CoordinateGraphView = ({
  coordinateSystem,
  maxDepth,
}: {
  coordinateSystem: string;
  maxDepth?: number;
}) => {
  const { data, loading, error } = useGetCoordinateGraphQuery({
    variables: { coordinateSystem, maxDepth },
  });

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-destructive">
        {error.message}
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        Walking the coordinate graph…
      </div>
    );
  }

  return <CoordinateGraphFlow graph={data.coordinateGraph} />;
};

export default CoordinateGraphView;
