import { cn } from "@/lib/utils";
import { RekuestTask } from "@/linkers";
import { TaskEventKind, ListTaskFragment } from "@/rekuest/api/graphql";
import { CheckCircle, Clock, XCircle, Loader } from "lucide-react";
import Timestamp from "react-timestamp";

interface Props {
  item: ListTaskFragment;
}

const statusIcon = (kind: TaskEventKind, isDone: boolean) => {
  if (isDone) return <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />;
  if (kind === TaskEventKind.Failed || kind === TaskEventKind.Critical)
    return <XCircle className="h-4 w-4 shrink-0 text-destructive" />;
  if (kind === TaskEventKind.Cancelled || kind === TaskEventKind.Cancelling)
    return <XCircle className="h-4 w-4 shrink-0 text-muted-foreground" />;
  return <Loader className="h-4 w-4 shrink-0 text-muted-foreground animate-spin" />;
};

const AgentTaskCard = ({ item }: Props) => {
  return (
    <RekuestTask.Smart object={item}>
      <RekuestTask.DetailLink object={item}>
        <div
          className={cn(
            "group flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer",
            "hover:bg-accent hover:border-accent-foreground/20 transition-colors",
          )}
        >
          {statusIcon(item.latestEventKind, item.isDone)}
          <p className="text-sm font-medium leading-none truncate flex-1">
            {item.action.name}
          </p>
          <span className="text-xs text-muted-foreground shrink-0">
            <Timestamp date={item.createdAt} relative />
          </span>
        </div>
      </RekuestTask.DetailLink>
    </RekuestTask.Smart>
  );
};

export default AgentTaskCard;
