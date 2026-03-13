import { useRekuest } from "@/app/Arkitekt";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  AgentsDocument,
  AgentsQuery,
  useAgentQuery,
  WatchAgentsDocument,
  WatchAgentsSubscription,
  WatchAgentsSubscriptionVariables
} from "../../api/graphql";

export const AgentToatser = (props: { id: string }) => {
  const { data } = useAgentQuery({});

  return (
    <div className="h-full relative w-full overflow-hidden group p-2">
      {data?.agent?.name} is now{" "}
      {data?.agent.connected ? "connected" : "disconnected"}
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
        ?.subscribe<WatchAgentsSubscription, WatchAgentsSubscriptionVariables>({
          query: WatchAgentsDocument,
          variables: {},
        })
        .subscribe((res) => {
          console.error("Received agent update", res);

          const update = res.data?.agents.update;
          const create = res?.data?.agents.create;

          if (update) {
            client.cache.updateQuery<AgentsQuery>(
              {
                query: AgentsDocument,
              },
              (data) => {
                return {
                  agents: (data?.agents || []).map((ass) =>
                    ass.id == update.id ? { ...ass, update } : ass,
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
              duration: 300, // Keep toast open until manually closed or task completes
              dismissible: true,
            });
          }
        });

      return () => subscription.unsubscribe();
    }
  }, [client]);

  return <></>;
};
