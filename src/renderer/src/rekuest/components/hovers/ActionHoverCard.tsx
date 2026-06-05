import { useDialog } from "@/app/dialog";
import {
  HoverRow,
  HoverSectionLabel,
  HoverShell,
  HoverSkeleton,
} from "@/components/hover/HoverShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RekuestImplementation } from "@/linkers";
import { Object } from "@/types";
import { Zap } from "lucide-react";
import { AssignationEventKind, useHoverActionQuery } from "../../api/graphql";

export const ActionHoverCard = ({ object }: { object: Object }) => {
  const { openDialog } = useDialog();
  const { data, error } = useHoverActionQuery({
    variables: { id: object.id },
    fetchPolicy: "cache-first",
  });

  if (error) {
    return (
      <div className="p-3 text-xs text-destructive">
        Could not load action details.
      </div>
    );
  }

  if (!data) {
    return <HoverSkeleton />;
  }

  const action = data.action;
  const done = action.assignations.filter(
    (a) => a.isDone || a.latestEventKind === AssignationEventKind.Done,
  ).length;
  const failed = action.assignations.filter(
    (a) =>
      a.latestEventKind === AssignationEventKind.Error ||
      a.latestEventKind === AssignationEventKind.Critical,
  ).length;
  const activeAgents = action.implementations.filter(
    (i) => i.agent.active,
  ).length;

  return (
    <HoverShell
      title={action.name}
      subtitle={action.app.identifier}
      icon={
        action.logo ? (
          <img src={action.logo} alt="" className="h-6 w-6 rounded" />
        ) : undefined
      }
    >
      {action.description && (
        <p className="text-xs text-muted-foreground line-clamp-3">
          {action.description}
        </p>
      )}

      <div className="flex flex-row flex-wrap gap-1">
        <Badge variant="secondary" className="text-[10px]">
          {action.kind.toLowerCase()}
        </Badge>
        {action.stateful && (
          <Badge variant="secondary" className="text-[10px]">
            stateful
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <HoverRow
          label="Implementations"
          value={`${action.implementations.length} (${activeAgents} active)`}
        />
        <HoverRow
          label="Recent runs"
          value={
            <span className="inline-flex gap-2">
              <span className="text-green-500">{done} done</span>
              {failed > 0 && (
                <span className="text-destructive">{failed} failed</span>
              )}
            </span>
          }
        />
      </div>

      {action.implementations.length > 0 && (
        <div className="flex flex-col gap-1">
          <HoverSectionLabel>Provided by</HoverSectionLabel>
          <div className="flex flex-col gap-0.5">
            {action.implementations.slice(0, 6).map((impl) => (
              <RekuestImplementation.DetailLink
                key={impl.id}
                object={impl}
                className="flex flex-row items-center gap-2 text-xs rounded px-1 py-0.5 hover:bg-muted transition-colors"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    impl.agent.active ? "bg-green-500" : "bg-muted-foreground/40",
                  )}
                />
                <span className="line-clamp-1">{impl.agent.name}</span>
              </RekuestImplementation.DetailLink>
            ))}
          </div>
        </div>
      )}

      <Button
        size="sm"
        variant="outline"
        className="mt-1 w-full gap-2"
        onClick={() => openDialog("createshortcut", { id: action.id })}
      >
        <Zap className="h-3.5 w-3.5" />
        Create shortcut
      </Button>
    </HoverShell>
  );
};

export default ActionHoverCard;
