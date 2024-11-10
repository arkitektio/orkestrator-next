import { useRekuest } from "@/arkitekt/Arkitekt";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import { ReturnsContainer } from "@/rekuest/widgets/tailwind";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AssignationsDocument,
  AssignationsQuery,
  useCancelMutation,
  useDetailNodeQuery,
  WatchAssignationEventsSubscriptionVariables,
  WatchAssignationsDocument,
  WatchAssignationsSubscription,
} from "../../api/graphql";

export const DynamicYieldDisplay = (props: {
  values: any[];
  nodeId: string;
}) => {
  const { data } = useDetailNodeQuery({
    variables: {
      id: props.nodeId,
    },
  });

  const { registry } = useWidgetRegistry();

  if (!data) {
    return <> Loaaading </>;
  }

  return (
    <div>
      <ReturnsContainer
        ports={data.node.returns}
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
      {ass.error && <Alert>{ass.error}</Alert>}
      {ass.yield && ass.nodeId && (
        <DynamicYieldDisplay values={ass.yield} nodeId={ass.nodeId} />
      )}
      {ass.cancelled && <Alert>{ass.message}</Alert>}
      {ass.progress != undefined && <Progress value={ass.progress} />}
      <p className="mt-2">{ass.message}</p>
      {ass.done && "Done :)"}

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
