import { useRekuest } from "@/arkitekt/Arkitekt";
import { useSettings } from "@/providers/settings/SettingsContext";
import { ReturnsContainer } from "@/rekuest/widgets/tailwind";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  AgentsDocument,
  AgentsQuery,
  AssignationsDocument,
  AssignationsQuery,
  useDetailNodeQuery,
  WatchAgentsDocument,
  WatchAgentsSubscription,
  WatchAgentsSubscriptionVariables,
  WatchAssignationEventsSubscriptionVariables,
  WatchAssignationsDocument,
  WatchAssignationsSubscription
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
          WatchAgentsSubscription,
          WatchAgentsSubscriptionVariables
        >({
          query: WatchAgentsDocument,
          variables: {},
        })
        .subscribe((res) => {
          console.error("Received agent update", res);

          let update = res.data?.agents.update;
          let create = res?.data?.agents.create;

          if (update) {
            client.cache.updateQuery<AgentsQuery>(
              {
                query: AgentsDocument,
              },
              (data) => {

                return {
                  agents: (data?.agents || []).map((ass) =>
                    ass.id == update.id
                      ? { ...ass, update}
                      : ass,
                  ),
                };
              },
            );
          }

          if (create) {
            client.cache.updateQuery<AgentsQuery>(
              {
                query: AgentsDocument,
              },
              (data) => {
                return {
                  agents: data?.agents.concat([create]) || [create],
                };
              },
            );

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
