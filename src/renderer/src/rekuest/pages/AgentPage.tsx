import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetPodForAgentQuery } from "@/kabinet/api/graphql";
import { cn } from "@/lib/utils";
import { KabinetPod, RekuestAgent, RekuestMemoryShelve } from "@/linkers";
import {
  AgentFragment,
  useAgentQuery,
  useBounceMutation,
  usePinAgentMutation,
  WatchImplementationsDocument,
  WatchImplementationsSubscription,
  WatchImplementationsSubscriptionVariables,
} from "@/rekuest/api/graphql";
import { useEffect } from "react";
import ImplementationCard from "../components/cards/ImplementationCard";
import TaskCard from "../components/cards/TaskCard";
import { StateDisplay } from "../components/State";
import Timestamp from "react-timestamp";
import { ClientImage } from "@/lok-next/components/ClientAvatar";
import { AgentTasksSidebar } from "../sidebars/AgentTasksSidebar";
import { Activity, Box, CheckCircle, Clock, Database, Pin, PinOff, Server } from "lucide-react";

export const PinAgent = (props: { agent: AgentFragment }) => {
  const [pin] = usePinAgentMutation();

  return (
    <Button
      variant={props.agent.pinned ? "default" : "outline"}
      size="sm"
      onClick={() => {
        pin({
          variables: {
            input: { id: props.agent.id, pin: !props.agent.pinned },
          },
        });
      }}
    >
      {props.agent.pinned ? (
        <>
          <PinOff className="h-4 w-4 mr-2" />
          Unpin
        </>
      ) : (
        <>
          <Pin className="h-4 w-4 mr-2" />
          Pin
        </>
      )}
    </Button>
  );
};

export const BounceAgentButton = (props: { agent: AgentFragment }) => {
  const [bounce] = useBounceMutation();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        bounce({
          variables: {
            input: { agent: props.agent.id, duration: 10 },
          },
        });
      }}
    >
      Bounce
    </Button>
  );
};

export const ManagedByCard = (props: { agent: AgentFragment }) => {
  const { data } = useGetPodForAgentQuery({
    variables: {
      clientId: props.agent.registry.client.clientId,
      instanceId: props.agent.instanceId,
    },
  });

  if (!data?.podForAgent) {
    return null;
  }

  return (
    <KabinetPod.DetailLink object={data?.podForAgent.id}>
      <Button variant="outline" size="sm">
        <Server className="h-4 w-4 mr-2" />
        {data?.podForAgent?.resource?.name} • {data?.podForAgent?.backend?.name}
      </Button>
    </KabinetPod.DetailLink>
  );
};

export default asDetailQueryRoute(
  useAgentQuery,
  ({ data, subscribeToMore }) => {
    useEffect(() => {
      return subscribeToMore<
        WatchImplementationsSubscription,
        WatchImplementationsSubscriptionVariables
      >({
        document: WatchImplementationsDocument,
        variables: { agent: data.agent.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const create = subscriptionData.data.implementations.create;
          const update = subscriptionData.data.implementations.update;
          const remove = subscriptionData.data.implementations.delete;
          if (create) {
            return {
              agent: {
                ...prev.agent,
                implementations: [...prev.agent.implementations, create],
              },
            };
          }
          if (update) {
            return {
              agent: {
                ...prev.agent,
                implementations: prev.agent.implementations.map((x) =>
                  x.id == update.id ? update : x,
                ),
              },
            };
          }
          if (remove) {
            return {
              agent: {
                ...prev.agent,
                implementations: prev.agent.implementations.filter((x) => x.id != remove),
              },
            };
          }
          return prev;
        },
      });
    }, [subscribeToMore, data.agent.id]);

    return (
      <RekuestAgent.ModelPage
        title={data.agent.name}
        object={data.agent.id}
        sidebars={
          <MultiSidebar
            map={{
              Comments: <RekuestAgent.Komments object={data?.agent?.id} />,
              States: <>
                {/* States Section */}
                {data.agent.states.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Agent States
                    </h3>
                    <div className="space-y-3">
                      {data.agent.states.map((state) => (
                        <StateDisplay key={state.id} stateId={state.id} label={true} />
                      ))}
                    </div>
                  </div>
                )}
              </>,
              Tasks: <AgentTasksSidebar agent={data.agent.id} />,
            }}
          />
        }
        pageActions={
          <div className="flex flex-row gap-2">
            <PinAgent agent={data.agent} />
            <ManagedByCard agent={data.agent} />
            {data.agent.memoryShelve && (
              <RekuestMemoryShelve.DetailLink object={data.agent.memoryShelve.id}>
                <Button variant="outline" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  Memory Shelve
                </Button>
              </RekuestMemoryShelve.DetailLink>
            )}
            <RekuestAgent.ObjectButton object={data.agent.id} />
          </div>
        }
      >
        {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="space-y-4">
                  <RekuestAgent.DetailLink object={data.agent.id}>
                    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl hover:text-primary transition-colors cursor-pointer">
                      {data.agent.name}
                    </h1>
                  </RekuestAgent.DetailLink>

                  {data.agent.extensions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {data.agent.extensions.map((extension) => (
                        <Badge key={extension} variant="secondary" className="text-xs font-mono">
                          {extension}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4  p-6 flex items-center justify-center">
                <ClientImage
                  clientId={data.agent.registry.client.clientId}
                  className="w-full max-w-[200px] h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
        <div className="space-y-8 mt-6">
          {/* Status Cards Section */}
          <div className="grid grid-cols-8  gap-3">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    data.agent.connected
                      ? "bg-green-500 animate-pulse shadow-sm shadow-green-500/50"
                      : "bg-red-500 shadow-sm shadow-red-500/50"
                  )}
                />
                <span className="text-lg font-semibold">
                  {data.agent.connected ? "Online" : "Offline"}
                </span>
              </div>
              {(data.agent.active !== data.agent.connected || data.agent.blocked) && (
                <div className="flex gap-1 mt-1">
                  {data.agent.active !== data.agent.connected && (
                    <Badge variant="outline" className="text-xs h-5 px-1">
                      ⚠️ Mismatch
                    </Badge>
                  )}
                  {data.agent.blocked && (
                    <Badge variant="destructive" className="text-xs h-5 px-1">
                      Blocked
                    </Badge>
                  )}
                </div>
              )}
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Last Seen</span>
              </div>
              <div className="text-lg font-semibold">
                <Timestamp date={data.agent.lastSeen} relative />
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Box className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Implementations</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold">
                  {data.agent.implementations.length}
                </span>
                <span className="text-xs text-muted-foreground">
                  {data.agent.implementations.length === 1 ? "action" : "actions"}
                </span>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Extensions</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold">
                  {data.agent.extensions.length}
                </span>
                <span className="text-xs text-muted-foreground">
                  {data.agent.extensions.length === 1 ? "ext" : "exts"}
                </span>
              </div>
            </Card>
          </div>



          {/* Assignations Section */}
          {data.agent.assignations && data.agent.assignations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-muted-foreground" />
                <h2 className="text-2xl font-bold">Latest Tasks</h2>
                <Badge variant="outline">{data.agent.assignations.length}</Badge>
              </div>
              <Separator />
              <ListRender array={data.agent.assignations}>
                {(item) => <TaskCard item={item} />}
              </ListRender>
            </div>
          )}

          {/* Implementations Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Box className="h-6 w-6 text-muted-foreground" />
              <h2 className="text-2xl font-bold">Registered Actions</h2>
              <Badge variant="outline">{data.agent.implementations.length}</Badge>
            </div>
            <Separator />
            <ListRender array={data.agent.implementations}>
              {(item) => <ImplementationCard item={item} />}
            </ListRender>
          </div>
        </div>
      </RekuestAgent.ModelPage>
    );
  },
);
