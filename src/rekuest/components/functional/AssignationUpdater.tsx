import { useRekuest } from "@/arkitekt/Arkitekt";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import { ReturnsContainer } from "@/rekuest/widgets/tailwind";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  AssignationsDocument,
  AssignationsQuery,
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
    <>
      <ReturnsContainer
        ports={data.node.returns}
        values={props.values}
        registry={registry}
      />
    </>
  );
};

export const AssignationToaster = (props: { id: string }) => {
  const ass = useLiveAssignation({ assignation: props.id });

  return (
    <div className="truncate w-full h-full">
      {ass.progress != undefined && <Progress value={ass.progress} />}
      <p className="mt-2">{ass.message}</p>
      {ass.error && <Alert>{ass.error}</Alert>}
      {ass.yield && ass.nodeId && (
        <DynamicYieldDisplay values={ass.yield} nodeId={ass.nodeId} />
      )}
      {ass.done && "Done :)"}
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
            toast(<AssignationToaster id={create.id} />, {
              duration: 5000,
              dismissible: true,
            });
          }
        });

      return () => subscription.unsubscribe();
    }
  }, [client]);

  return <></>;
};
