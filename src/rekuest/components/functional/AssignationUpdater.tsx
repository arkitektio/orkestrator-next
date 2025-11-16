import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRekuest } from "@/lib/arkitekt/Arkitekt";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import { ReturnsContainer } from "@/rekuest/widgets/tailwind";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
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
import { DialogButton } from "@/components/ui/dialogbutton";

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
    <div className="h-32 w-32 overflow-auto border p-2">
      <ReturnsContainer
        ports={data.action.returns}
        values={props.values}
        registry={registry}
        className="p-2"
      />
    </div>
  );
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
      className="h-full relative w-full overflow-hidden group p-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {ass.error && <Alert className="bg-red-800">{ass.error}</Alert>}
      {ass.error && ass.assignationId && <DialogButton name="reportbug" variant="outline" size="sm"
        dialogProps={{ assignationId: ass.assignationId }}
      >
        Report Bug
      </DialogButton>}
      {ass.yield && ass.actionId && (
        <DynamicYieldDisplay values={ass.yield} actionId={ass.actionId} />
      )}
      {ass.cancelled && <Alert>{ass.message}</Alert>}
      {ass.progress != undefined && <Progress value={ass.progress} />}
      <p className="mt-2">{ass.message}</p>
      {ass.done && "Done :)"}
      {ass.event?.kind == AssignationEventKind.Queued && <>Enqueued...</>}
      {ass.event?.kind == AssignationEventKind.Bound && <>Bound...</>}
      {ass.event?.kind == AssignationEventKind.Cancelled && (
        <>Successfully cancelled :)</>
      )}

      <div className="group-hover:opacity-100 opacity-0 bg-black p-1 rounded-full absolute bottom-0 right-0">
        {!ass.done && !ass.error ? (
          <Button
            onClick={() =>
              cancelAssign({ variables: { input: { assignation: props.id } } })
            }
            variant={"destructive"}
            size={"sm"}
            className="flex-1 rounded-l-full py-1"
          >
            {" "}
            Cancel{" "}
          </Button>
        ) : (
          <Button
            variant={"destructive"}
            size={"sm"}
            onClick={() => {
              toast.dismiss(props.id);
            }}
            className="flex-1 rounded-l-full py-1"
            disabled={true}
          >
            {" "}
            Accept{" "}
          </Button>
        )}
        <RekuestAssignation.DetailLink object={props.id}>
          Open
        </RekuestAssignation.DetailLink>
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => {
            toast.dismiss(props.id);
          }}
          className="flex-1 rounded-r-full"
        >
          Hide
        </Button>
      </div>
    </div>
  );
};

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
                  console.error(
                    "Assignation not found",
                    event.assignation.id,
                    data?.assignations,
                  );
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
                return {
                  assignations: data?.assignations.concat([create]) || [create],
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
