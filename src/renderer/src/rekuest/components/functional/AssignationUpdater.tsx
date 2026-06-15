import { useRekuest } from "@/app/Arkitekt";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useAssignation,
  useLiveAssignation,
} from "@/rekuest/hooks/useAssignations";
import { WrappedReturnsContainer } from "@/rekuest/widgets/tailwind";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  AssignationEventKind,
  AssignationsDocument,
  AssignationsQuery,
  useDetailActionQuery,
  WatchAssignationEventsSubscriptionVariables,
  WatchAssignationsDocument,
  WatchAssignationsSubscription,
} from "../../api/graphql";
import {
  bufferEvent,
  isTerminalEvent,
  registeredCallbacks,
  takeBufferedEvents,
} from "../../lib/assignationTracker";
import { AssignationStatusLine } from "../assignation/AssignationStatusLine";

export { registeredCallbacks } from "../../lib/assignationTracker";

export const DynamicYieldDisplay = (props: {
  values: any[];
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

export const borderColorForAss = (ass: any) => {
  if (ass.error) {
    return "border-red-500";
  }
  if (ass.cancelled) {
    return "border-orange-500";
  }
  if (ass.done) {
    return "border-green-500";
  }
  if (ass.yield) {
    return "border-blue-500";
  }

  return "border-muted-foreground/10";
};

const dismissedToasts = new Set<string>();

const dismissAssignationToast = (id: string) => {
  dismissedToasts.add(id);
  toast.dismiss(id);
};

const showAssignationToast = (id: string) => {
  if (dismissedToasts.has(id)) {
    return;
  }
  toast.custom(() => <AssignationToast id={id} />, {
    id,
    duration: Infinity, // Dismissal is driven by AssignationToast
    dismissible: true,
    onDismiss: () => dismissedToasts.add(id),
  });
};

export const AssignationToast = (props: { id: string }) => {
  const assignation = useAssignation({ assignation: props.id });
  const live = useLiveAssignation({ assignation: props.id });

  // Success and cancellation auto-dismiss after a short delay; errors persist
  // until closed via the X button.
  useEffect(() => {
    if (live.done || live.cancelled) {
      const timer = setTimeout(() => {
        dismissAssignationToast(props.id);
      }, 3000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [live.done, live.cancelled, props.id]);

  // Sonner measures a toast's height only when the toast itself is updated
  // (its jsx/title props change). Our content re-renders in place as events
  // arrive, so the recorded height goes stale — and hovering, which applies
  // `height: var(--initial-height)`, would visibly resize the toast. Re-issue
  // the toast whenever the rendered layout changes shape to force a
  // re-measure.
  const layoutKey = [
    live.progress != null,
    live.message,
    live.error,
    live.yield != null,
    live.latestEventKind,
  ].join("|");

  useEffect(() => {
    showAssignationToast(props.id);
  }, [layoutKey, props.id]);

  if (!assignation) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative w-[var(--width)] flex flex-col gap-2 rounded-md border bg-background p-3 shadow-lg",
        borderColorForAss(live),
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 text-muted-foreground hover:text-foreground"
        onClick={() => dismissAssignationToast(props.id)}
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="pr-7">
        <AssignationStatusLine assignation={assignation} showCancel showLink />
      </div>

      {live.error && (
        <div className="w-full rounded bg-red-500/10 p-2 text-xs text-red-500">
          {live.error}
        </div>
      )}

      {live.yield && live.actionId && (
        <DynamicYieldDisplay values={live.yield} actionId={live.actionId} />
      )}
    </div>
  );
};

export const AssignationUpdater = () => {
  const client = useRekuest();
  useEffect(() => {
    if (client) {
      console.log("Subscribing to Postman Assignation");
      const subscription = client
        ?.subscribe<
          WatchAssignationsSubscription,
          WatchAssignationEventsSubscriptionVariables
        >({
          query: WatchAssignationsDocument,
          variables: {},
        })
        .subscribe((res) => {
          const event = res.data?.assignations.event;
          const create = res?.data?.assignations.create;

          if (event) {
            // Deliver to locally tracking components outside the cache update
            // (updateQuery callbacks are skipped when the query isn't cached
            // and may run more than once).
            registeredCallbacks.get(event.assignation.reference)?.(event);
            if (isTerminalEvent(event.kind)) {
              registeredCallbacks.delete(event.assignation.reference);
            }

            client.cache.updateQuery<AssignationsQuery>(
              {
                query: AssignationsDocument,
                variables: {},
              },
              (data) => {
                if (!data) {
                  return data;
                }

                const assignation = data.assignations.find(
                  (a) => a.id === event.assignation.id,
                );

                if (!assignation) {
                  // The event arrived before its assignation's create payload;
                  // keep it until the create is processed.
                  bufferEvent(event.assignation.id, event);
                  return data;
                }

                return {
                  assignations: data.assignations.map((ass) =>
                    ass.id == event.assignation.id
                      ? {
                          ...ass,
                          events: [event, ...ass.events],
                          latestEventKind: event.kind,
                          isDone:
                            ass.isDone ||
                            event.kind === AssignationEventKind.Done,
                          finishedAt: isTerminalEvent(event.kind)
                            ? event.createdAt
                            : ass.finishedAt,
                        }
                      : ass,
                  ),
                };
              },
            );
          }

          if (create) {
            client.cache.updateQuery<AssignationsQuery>(
              {
                query: AssignationsDocument,
                variables: {},
              },
              (data) => {
                if (data?.assignations.some((a) => a.id === create.id)) {
                  return data;
                }

                const buffered = takeBufferedEvents(create.id);
                let new_create = create;

                if (buffered.length > 0) {
                  // Buffered events arrived oldest-first; the events list is
                  // ordered newest-first.
                  const events = [
                    ...buffered.slice().reverse(),
                    ...create.events,
                  ];
                  const latest = events[0];
                  new_create = {
                    ...create,
                    events,
                    latestEventKind: latest.kind,
                    isDone:
                      create.isDone ||
                      events.some(
                        (e) => e.kind === AssignationEventKind.Done,
                      ),
                  };
                }

                return {
                  assignations:
                    data?.assignations.concat([new_create]) || [new_create],
                };
              },
            );

            if (create.ephemeral) {
              // Ephemeral Assignations do not get a notification
              return;
            }

            if (create.reference && registeredCallbacks.has(create.reference)) {
              // Already tracked locally by a component, skip global toast notification
              return;
            }

            // Use the assignation id as the toast id
            showAssignationToast(create.id);
          }
        });

      return () => subscription.unsubscribe();
    }
    return undefined;
  }, [client]);

  return <></>;
};
