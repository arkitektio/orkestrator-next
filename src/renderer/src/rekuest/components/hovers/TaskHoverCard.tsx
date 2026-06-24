import {
  HoverRow,
  HoverSectionLabel,
  HoverShell,
  HoverSkeleton,
} from "@/components/hover/HoverShell";
import { Progress } from "@/components/ui/progress";
import { Object } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useHoverAssignationQuery } from "../../api/graphql";
import { AssignationStatusIcon, formatEventKind } from "./status";

export const AssignationHoverCard = ({ object }: { object: Object }) => {
  const { data, error } = useHoverAssignationQuery({
    variables: { id: object.id },
    fetchPolicy: "cache-first",
  });

  if (error) {
    return (
      <div className="p-3 text-xs text-destructive">
        Could not load task details.
      </div>
    );
  }

  if (!data) {
    return <HoverSkeleton />;
  }

  const assignation = data.assignation;
  const latestProgress = assignation.events.find(
    (event) => event.progress != null,
  )?.progress;
  const latestMessage = assignation.events.find(
    (event) => event.message,
  )?.message;

  return (
    <HoverShell
      title={assignation.action.name}
      subtitle={assignation.reference ?? undefined}
      icon={
        <AssignationStatusIcon
          kind={assignation.latestEventKind}
          isDone={assignation.isDone}
        />
      }
    >
      <div className="flex flex-col gap-1">
        <HoverRow
          label="Status"
          value={formatEventKind(assignation.latestEventKind)}
        />
        {assignation.implementation?.agent && (
          <HoverRow
            label="Agent"
            value={assignation.implementation.agent.name}
          />
        )}
        <HoverRow
          label="Started"
          value={formatDistanceToNow(new Date(assignation.createdAt), {
            addSuffix: true,
          })}
        />
        {assignation.finishedAt && (
          <HoverRow
            label="Finished"
            value={formatDistanceToNow(new Date(assignation.finishedAt), {
              addSuffix: true,
            })}
          />
        )}
      </div>

      {!assignation.isDone && latestProgress != null && (
        <div className="flex flex-col gap-1">
          <Progress value={latestProgress} className="h-1.5" />
          <span className="text-[10px] text-muted-foreground text-right">
            {latestProgress}%
          </span>
        </div>
      )}

      {latestMessage && (
        <div className="flex flex-col gap-1">
          <HoverSectionLabel>Latest</HoverSectionLabel>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {latestMessage}
          </p>
        </div>
      )}
    </HoverShell>
  );
};

export default AssignationHoverCard;
