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
  AssignationEventKind,
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

export const AgentToatser = (props: { id: string }) => {
  return (
    <div className="h-full relative w-full overflow-hidden group p-2">
      I bims 1 Agent
    </div>
  );
};

export const AgentUpdater = (props: {}) => {
  const { settings } = useSettings();
  const client = useRekuest();

  useEffect(() => {
    if (client) {
      console.log("Subscribing to Postman Agents");
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

            if (create.ephemeral) {
              // Ephemeral Assignations do not get a notification
              return;
            }

            console.error("Added assignation", create.reference);
            const toastId = create.id; // Use the assignation id as the toastId
            toast(<AgentToatser id={toastId} />, {
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
