import { CheckCircle, Clock, Loader, XCircle } from "lucide-react";
import { TaskEventKind } from "../../api/graphql";

/**
 * Maps an task's latest event kind to a small status icon, mirroring the
 * conventions used by AgentTaskCard.
 */
export const TaskStatusIcon = ({
  kind,
  isDone,
  className = "h-4 w-4 shrink-0",
}: {
  kind: TaskEventKind;
  isDone: boolean;
  className?: string;
}) => {
  if (isDone || kind === TaskEventKind.Completed) {
    return <CheckCircle className={`${className} text-green-500`} />;
  }
  if (
    kind === TaskEventKind.Failed ||
    kind === TaskEventKind.Critical
  ) {
    return <XCircle className={`${className} text-destructive`} />;
  }
  if (
    kind === TaskEventKind.Cancelled ||
    kind === TaskEventKind.Cancelling ||
    kind === TaskEventKind.Interrupted ||
    kind === TaskEventKind.Interrupting
  ) {
    return <XCircle className={`${className} text-muted-foreground`} />;
  }
  if (kind === TaskEventKind.Queued) {
    return <Clock className={`${className} text-muted-foreground`} />;
  }
  return <Loader className={`${className} text-muted-foreground animate-spin`} />;
};

export const formatEventKind = (kind: TaskEventKind) =>
  kind.charAt(0) + kind.slice(1).toLowerCase();
