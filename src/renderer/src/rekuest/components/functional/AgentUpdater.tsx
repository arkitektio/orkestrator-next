import { useRekuest } from "@/app/Arkitekt";
import type { ApolloClient } from "@apollo/client";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  AgentChangeFragment,
  AgentsDocument,
  AgentsQuery,
  HydrateAgentDocument,
  HydrateAgentQuery,
  HydrateAgentQueryVariables,
  useAgentQuery,
  WatchAgentsDocument,
  WatchAgentsSubscription,
  WatchAgentsSubscriptionVariables,
} from "../../api/graphql";

type RekuestClient = ApolloClient<unknown>;

/**
 * An agent `update` is a non-traversable `AgentChange` (`__typename:
 * "AgentChange"`), so it does NOT auto-normalize into the `Agent:<id>` entity.
 * Write its hot scalars onto the normalized agent explicitly — any list/detail
 * query referencing it updates in place.
 */
const applyAgentScalars = (
  client: RekuestClient,
  change: AgentChangeFragment,
) => {
  client.cache.modify({
    id: client.cache.identify({ __typename: "Agent", id: change.id }),
    fields: {
      name: () => change.name,
      connected: () => change.connected,
      blocked: () => change.blocked,
      lastSeen: () => change.lastSeen ?? null,
    },
  });
};

/**
 * A new agent arrives non-traversable, so fetch its full (list-shaped) graph
 * once and insert it into the Agents list cache.
 */
const hydrateAndInsertAgent = async (client: RekuestClient, id: string) => {
  let agent;
  try {
    const res = await client.query<
      HydrateAgentQuery,
      HydrateAgentQueryVariables
    >({
      query: HydrateAgentDocument,
      variables: { id },
      fetchPolicy: "network-only",
    });
    agent = res.data?.agent;
  } catch (error) {
    console.error("Failed to hydrate agent", id, error);
    return;
  }
  if (!agent) return;

  client.cache.updateQuery<AgentsQuery>({ query: AgentsDocument }, (data) => {
    if (!data) return { agents: [agent!] };
    if (data.agents.some((a) => a.id === agent!.id)) return data;
    return { agents: data.agents.concat([agent!]) };
  });
};

export const AgentToatser = (_props: { id: string }) => {
  const { data } = useAgentQuery({});

  return (
    <div className="h-full relative w-full overflow-hidden group p-2">
      {data?.agent?.name} is now{" "}
      {data?.agent.connected ? "connected" : "disconnected"}
    </div>
  );
};

export const AgentUpdater = (_props: {}) => {
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
          const update = res.data?.agents.update;
          const create = res.data?.agents.create;
          const deleted = res.data?.agents.delete;

          if (update) {
            applyAgentScalars(client, update);
          }

          if (create) {
            void hydrateAndInsertAgent(client, create.id).then(() => {
              const toastId = create.id;
              toast(<AgentToatser id={toastId} />, {
                id: toastId,
                duration: 300,
                dismissible: true,
              });
            });
          }

          if (deleted) {
            client.cache.updateQuery<AgentsQuery>(
              { query: AgentsDocument },
              (data) =>
                data
                  ? { agents: data.agents.filter((a) => a.id !== deleted) }
                  : data,
            );
          }
        });

      return () => subscription.unsubscribe();
    }
    return undefined;
  }, [client]);

  return <></>;
};
