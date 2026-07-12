import { useDetailActionQuery } from "@/rekuest/api/graphql";
import { LiveTaskState } from "@/rekuest/hooks/useTasks";
import { WrappedReturnsContainer } from "@/rekuest/widgets/tailwind";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";

/** Renders a task's latest yielded values with the action's return ports. */
export const DynamicYieldDisplay = (props: {
  values: unknown[];
  actionId: string;
}) => {
  const { data } = useDetailActionQuery({
    variables: {
      id: props.actionId,
    },
  });

  const { registry } = useWidgetRegistry();

  if (!data) {
    return <> Loaaading </>;
  }

  return (
    <div className="w-full h-full overflow-hidden p-2 flex bg-muted/50 rounded-md border border-muted-foreground/10 flex-col gap-2 items-center justify-center">
      <WrappedReturnsContainer
        ports={data.action.returns}
        values={props.values}
        registry={registry}
        className="p-2"
      />
    </div>
  );
};

/** Border accent for a live task state (notification cards/pills). */
export const borderColorForLiveState = (live: LiveTaskState) => {
  if (live.error) {
    return "border-red-500";
  }
  if (live.cancelled) {
    return "border-orange-500";
  }
  if (live.done) {
    return "border-green-500";
  }
  if (live.yield) {
    return "border-blue-500";
  }

  return "border-muted-foreground/10";
};
