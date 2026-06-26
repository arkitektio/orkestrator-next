import {
  HoverRow,
  HoverShell,
  HoverSkeleton,
} from "@/components/hover/HoverShell";
import { Object } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useDetailSimulationQuery } from "../../api/graphql";

export const SimulationHoverCard = ({ object }: { object: Object }) => {
  const { data, error } = useDetailSimulationQuery({
    variables: { id: object.id },
    fetchPolicy: "cache-first",
  });

  if (error) {
    return (
      <div className="p-3 text-xs text-destructive">
        Could not load simulation details.
      </div>
    );
  }

  if (!data) {
    return <HoverSkeleton />;
  }

  const simulation = data.simulation;

  return (
    <HoverShell title={simulation.name} subtitle={`from ${simulation.model.name}`}>
      <div className="flex flex-col gap-1">
        <HoverRow label="Duration" value={`${simulation.duration} ms`} />
        <HoverRow label="Time step" value={`${simulation.dt} ms`} />
        <HoverRow label="Recordings" value={simulation.recordings.length} />
        <HoverRow label="Stimuli" value={simulation.stimuli.length} />
        {simulation.creator && (
          <HoverRow label="Creator" value={simulation.creator.sub} />
        )}
        <HoverRow
          label="Created"
          value={
            simulation.createdAt
              ? formatDistanceToNow(new Date(simulation.createdAt), {
                  addSuffix: true,
                })
              : "—"
          }
        />
      </div>
    </HoverShell>
  );
};

export default SimulationHoverCard;
