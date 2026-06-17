import {
  HoverRow,
  HoverShell,
  HoverSkeleton,
} from "@/components/hover/HoverShell";
import { Object } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useDetailExperimentQuery } from "../../api/graphql";

export const ExperimentHoverCard = ({ object }: { object: Object }) => {
  const { data, error } = useDetailExperimentQuery({
    variables: { id: object.id },
    fetchPolicy: "cache-first",
  });

  if (error) {
    return (
      <div className="p-3 text-xs text-destructive">
        Could not load experiment details.
      </div>
    );
  }

  if (!data) {
    return <HoverSkeleton />;
  }

  const experiment = data.experiment;

  return (
    <HoverShell title={experiment.name} subtitle="Experiment">
      {experiment.description && (
        <p className="text-xs text-muted-foreground line-clamp-3">
          {experiment.description}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <HoverRow label="Recordings" value={experiment.recordingViews.length} />
        <HoverRow label="Stimuli" value={experiment.stimulusViews.length} />
        <HoverRow
          label="Created"
          value={
            experiment.createdAt
              ? formatDistanceToNow(new Date(experiment.createdAt), {
                  addSuffix: true,
                })
              : "—"
          }
        />
      </div>
    </HoverShell>
  );
};

export default ExperimentHoverCard;
