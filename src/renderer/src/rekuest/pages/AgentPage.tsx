import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetPodForAgentQuery } from "@/kabinet/api/graphql";
import { cn } from "@/lib/utils";
import { KabinetPod, RekuestAgent, RekuestState } from "@/linkers";
import {
  AgentFragment,
  useAgentQuery,
  useBounceMutation,
  usePinAgentMutation,
  WatchImplementationsDocument,
  WatchImplementationsSubscription,
  WatchImplementationsSubscriptionVariables,
} from "@/rekuest/api/graphql";
import { Activity, Box, CheckCircle, Clock, Pin, PinOff, Server } from "lucide-react";
import { useEffect } from "react";
import Timestamp from "react-timestamp";
import { AgentHeroScene } from "../components/AgentHeroScene";
import ImplementationCard from "../components/cards/ImplementationCard";
import TaskCard from "../components/cards/TaskCard";
import { AgentTasksSidebar } from "../sidebars/AgentTasksSidebar";

const stageCardClass =
  "border-white/20 bg-[linear-gradient(135deg,rgba(250,247,243,0.82),rgba(250,247,243,0.32))] shadow-[0_22px_50px_-30px_rgba(26,22,19,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(40,35,32,0.82),rgba(18,16,15,0.26))]";

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
    <KabinetPod.DetailLink object={data?.podForAgent}>
      <Button variant="outline" size="sm">
        <Server className="h-4 w-4 mr-2" />
        {data?.podForAgent?.resource?.name} • {data?.podForAgent?.backend?.name}
      </Button>
    </KabinetPod.DetailLink>
  );
};







export const AgentPage = asDetailQueryRoute(
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
        object={data.agent}
        variant={"black"}
        sidebars={
          <MultiSidebar
            map={{
              Comments: <RekuestAgent.Komments object={data?.agent} />,
              States: <>
                {/* States Section */}
                {data.agent.states.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Agent States
                    </h3>
                    <div className="space-y-3">
                      {data.agent.states.map((state) => (
                        <RekuestState.DetailLink object={state} key={state.id}>
                          <Button variant="outline" size="sm">
                            {state.id}
                          </Button>
                        </RekuestState.DetailLink>
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
          <>
            <PinAgent agent={data.agent} />
            <BounceAgentButton agent={data.agent} />
            <ManagedByCard agent={data.agent} />
            <RekuestAgent.DetailLink
                          object={data?.agent}
                          subroute="space"
                          className="font-semibold"
                        >
                          <Button
                            variant={"outline"}
                            size={"sm"}
                          >
                            Space
                          </Button>
                        </RekuestAgent.DetailLink>
          </>
        }
      >
        <div className="relative h-full w-full overflow-hidden  shadow-[0_30px_120px_-48px_rgba(15,23,42,0.55)]">


          <div>
            {data.agent.scenes.map((scene) => (
              <>{scene && <AgentHeroScene scene={scene} />}</>

            ))}

          </div>

          <div className="absolute inset-y-0 left-0 z-20 flex w-full max-w-[620px] items-stretch">
            <div className="flex w-full flex-col justify-between gap-6 p-6">
              <div className="space-y-1">
                <div className="space-y-4">
                  <RekuestAgent.DetailLink object={data.agent}>
                    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight transition-colors hover:text-primary lg:text-6xl cursor-pointer">
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Card className={`${stageCardClass} p-4`}>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <Activity className="h-3.5 w-3.5" />
                      Status
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          data.agent.connected
                            ? "bg-green-500 shadow-[0_0_14px_rgba(34,197,94,0.75)]"
                            : "bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.75)]",
                        )}
                      />
                      <span className="text-2xl font-semibold">
                        {data.agent.connected ? "Online" : "Offline"}
                      </span>
                    </div>
                    {(data.agent.active !== data.agent.connected || data.agent.blocked) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {data.agent.active !== data.agent.connected && (
                          <Badge variant="outline" className="text-xs">
                            Mismatch
                          </Badge>
                        )}
                        {data.agent.blocked && (
                          <Badge variant="destructive" className="text-xs">
                            Blocked
                          </Badge>
                        )}
                      </div>
                    )}
                  </Card>

                  <Card className={`${stageCardClass} p-4`}>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Last Seen
                    </div>
                    <div className="mt-3 text-2xl font-semibold">
                      <Timestamp date={data.agent.lastSeen} relative />
                    </div>
                  </Card>

                  <Card className={`${stageCardClass} p-4`}>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <Box className="h-3.5 w-3.5" />
                      Actions
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl font-semibold">{data.agent.implementations.length}</span>
                      <span className="text-sm text-muted-foreground">
                        {data.agent.implementations.length === 1 ? "registered action" : "registered actions"}
                      </span>
                    </div>
                  </Card>

                  <Card className={`${stageCardClass} p-4`}>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Extensions
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl font-semibold">{data.agent.extensions.length}</span>
                      <span className="text-sm text-muted-foreground">
                        {data.agent.extensions.length === 1 ? "extension" : "extensions"}
                      </span>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className={`${stageCardClass} p-4 sm:col-span-2`}>

        <div className="mt-6 space-y-8 xl:hidden @container">
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
        </div>

        <div className="mt-6 space-y-4  @container">
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
                </Card>
              </div>
            </div>


          <div className="absolute bottom-6 right-6 left-auto z-20 hidden w-[min(42rem,calc(100%-3rem))] max-w-2xl xl:block">
            {data.agent.assignations && data.agent.assignations.length > 0 && (
              <Card className={`${stageCardClass} p-5`}>
                <div className="mb-4 flex items-center gap-3">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">Latest Tasks</h2>
                  <Badge variant="outline">{data.agent.assignations.length}</Badge>
                </div>
                <div className="max-h-[16rem] overflow-auto pr-1">
                  <ListRender array={data.agent.assignations.slice(0, 3)}>
                    {(item) => <TaskCard item={item} />}
                  </ListRender>
                </div>
              </Card>
            )}
          </div>
        </div>

          </div>
      </RekuestAgent.ModelPage>
    );
  },
);


export default AgentPage;
