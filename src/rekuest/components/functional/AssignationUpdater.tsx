import { Button } from "@/components/ui/button";
import { DialogButton } from "@/components/ui/dialogbutton";
import { Progress } from "@/components/ui/progress";
import { useRekuest } from "@/lib/arkitekt/Arkitekt";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import { ReturnsContainer, WrappedReturnsContainer } from "@/rekuest/widgets/tailwind";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { AlertCircle, Bug, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AssignationEventFragment,
  AssignationEventKind,
  AssignationsDocument,
  AssignationsQuery,
  useCancelMutation,
  useDetailActionQuery,
  WatchAssignationEventsSubscriptionVariables,
  WatchAssignationsDocument,
  WatchAssignationsSubscription,
} from "../../api/graphql";
import { RekuestAssignation } from "@/linkers";
import { cn } from "@/lib/utils";
import Timestamp from "react-timestamp";

export const registeredCallbacks = new Map<
  string,
  (event: AssignationEventFragment) => void
>();

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

export const AssignationToaster = (props: { id: string }) => {
  const ass = useLiveAssignation({ assignation: props.id });
  const [hover, setHovered] = useState(false);

  const [cancelAssign] = useCancelMutation();

  // useEffect to close the toast if `ass.done` becomes true
  useEffect(() => {
    if ((ass.done || ass.cancelled) && !hover) {
      // wait delay
      const timer = setTimeout(() => {
        toast.dismiss(props.id);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [ass.done, ass.cancelled, props.id, hover]);

  return (
    <div
      className={cn("relative w-full! !w-full  group flex flex-col gap-2 h-20")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={cn("absolute bottom-0 left-2 h-6  z-999 translate-y-[30%] border border-muted-foreground/10 bg-background rounded-md px-2 py-1", borderColorForAss(ass))}>
        <RekuestAssignation.DetailLink object={ass.assignationId || ""}>
          <div className="flex flex-row h-full w-full justify-center ">
            {JSON.stringify(ass)}
            {ass.event?.kind == AssignationEventKind.Progress && (
              <Loader2 className="animate-spin h-4 w-4 text-muted-foreground flex-shrink-0 my-auto" />
            )}
            {ass.event?.kind == AssignationEventKind.Bound && (
              <Loader2 className="animate-spin h-4 w-4 text-blue-500 flex-shrink-0 my-auto" />
            )}
            {ass.yield && !ass.done && (
              <Loader2 className="animate-spin h-4 w-4 text-muted-foreground flex-shrink-0 my-auto" />
            )}
            {ass.done && <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 my-auto" />}
            {ass.cancelled && <XCircle className="h-4 w-4 text-orange-500 flex-shrink-0 my-auto" />}
            {ass.error && <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 my-auto" />}
            <div className="ml-2 text-xs my-auto">{ass.event?.kind}</div>
            {ass.message && !ass.error && <div className="ml-2 font-light text-xs my-auto">{ass.message}</div>}
            {ass.progress != undefined && ass.progress != 0 && (
              <div className="ml-2 font-light text-xs my-auto">{ass.progress}</div>
            )}
          </div>
        </RekuestAssignation.DetailLink>
      </div>
      <div className="h-full w-full flex flex-col items-center justify-center">
        {ass.error && (
          <div className="text-xs text-red-500 bg-red-500/10 p-2 rounded w-full h-full">
            {ass.error}
          </div>
        )}


        {ass.yield && ass.actionId && (
          <DynamicYieldDisplay values={ass.yield} actionId={ass.actionId} />
        )}

        {ass.message && !ass.yield && !ass.error && (
          <div className="text-xs  bg-slate-500/10 p-2 rounded h-full w-full">
            {ass.message}
          </div>
        )}


      </div>
    </div>
  );
};


export const cached_assignations_events = {}

export const AssignationUpdater = (props: {}) => {
  const { settings } = useSettings();
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
          variables: {
            instanceId: settings.instanceId,
          },
        })
        .subscribe((res) => {
          console.log("Received assignation update", res);

          let event = res.data?.assignations.event;
          let create = res?.data?.assignations.create;

          if (event) {
            client.cache.updateQuery<AssignationsQuery>(
              {
                query: AssignationsDocument,
                variables: {
                  instanceId: settings.instanceId,
                },
              },
              (data) => {
                let assignation = data?.assignations.find(
                  (a) => a.id === event.assignation.id,
                );

                if (!assignation) {
                  cached_assignations[event.assignation.id] = event;
                }

                registeredCallbacks.get(event.assignation.reference)?.(event);

                return {
                  assignations: (data?.assignations || []).map((ass) =>
                    ass.id == event.assignation.id
                      ? { ...ass, events: [event, ...ass.events] }
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
                variables: {
                  instanceId: settings.instanceId,
                },
              },
              (data) => {
                event = cached_assignations_events[create.id];

                let new_create;
                if (event) {
                  new_create = {
                    ...create,
                    events: [event, ...create.events],
                  };
                }
                else {
                  new_create = create;
                }





                return {
                  assignations: data?.assignations.concat([new_create]) || [new_create],
                };
              },
            );

            if (create.ephemeral) {
              // Ephemeral Assignations do not get a notification
              return;
            }

            console.error("Added assignation", create.reference);
            const toastId = create.id; // Use the assignation id as the toastId
            toast(<AssignationToaster id={toastId} />, {
              id: toastId,
              duration: Infinity, // Keep toast open until manually closed or task completes
              dismissible: true,
            });
          }
        });

      return () => subscription.unsubscribe();
    }
  }, [client]);

  return <></>;
};
