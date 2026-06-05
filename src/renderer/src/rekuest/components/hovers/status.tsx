import { CheckCircle, Clock, Loader, XCircle } from "lucide-react";
import { AssignationEventKind } from "../../api/graphql";

/**
 * Maps an assignation's latest event kind to a small status icon, mirroring the
 * conventions used by AgentTaskCard.
 */
export const AssignationStatusIcon = ({
  kind,
  isDone,
  className = "h-4 w-4 shrink-0",
}: {
  kind: AssignationEventKind;
  isDone: boolean;
  className?: string;
}) => {
  if (isDone || kind === AssignationEventKind.Done) {
    return <CheckCircle className={`${className} text-green-500`} />;
  }
  if (
    kind === AssignationEventKind.Error ||
    kind === AssignationEventKind.Critical
  ) {
    return <XCircle className={`${className} text-destructive`} />;
  }
  if (
    kind === AssignationEventKind.Cancelled ||
    kind === AssignationEventKind.Canceling ||
    kind === AssignationEventKind.Interupted ||
    kind === AssignationEventKind.Interupting
  ) {
    return <XCircle className={`${className} text-muted-foreground`} />;
  }
  if (kind === AssignationEventKind.Queued) {
    return <Clock className={`${className} text-muted-foreground`} />;
  }
  return <Loader className={`${className} text-muted-foreground animate-spin`} />;
};

export const formatEventKind = (kind: AssignationEventKind) =>
  kind.charAt(0) + kind.slice(1).toLowerCase();
