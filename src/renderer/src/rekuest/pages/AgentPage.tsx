import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Pin, PinOff, Server } from "lucide-react";
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
                        <RekuestAgent.DetailLink
                          object={data?.agent}
                          subroute="states"
                          className="font-semibold"
                        >
                          <Button
                            variant={"outline"}
                            size={"sm"}
                          >
                            States
                          </Button>
                        </RekuestAgent.DetailLink>
                        <RekuestAgent.DetailLink
                          object={data?.agent}
                          subroute="tasks"
                          className="font-semibold"
                        >
                          <Button
                            variant={"outline"}
                            size={"sm"}
                          >
                            Tasks
                          </Button>
                        </RekuestAgent.DetailLink>
          </>
        }
      >
        <div className="relative h-full w-full overflow-hidden  shadow-[0_30px_120px_-48px_rgba(15,23,42,0.55)]">


          <div>
            {data.agent.placements.map((plc) => (
              <>{plc.model?.file && <AgentHeroScene placement={plc} />}</>

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
                </div>

                <div className="grid grid-cols-3 gap-1  ">
                    <div className="flex items-center gap-3">
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
                      <div className="font-light">
                      <Timestamp date={data.agent.lastSeen} relative />
                      </div>
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


                </div>
              </div>


        <div className="mt-6  @container">
          Tasks
              <ListRender array={data.agent.assignations}>
                {(item) => <TaskCard item={item} />}
              </ListRender>
        </div>

        <div className="mt-6  @container overflow-y-auto">
          Actions
          <ListRender array={data.agent.implementations}>
            {(item) => <ImplementationCard item={item} />}
          </ListRender>
        </div>
              </div>
            </div>

        </div>

      </RekuestAgent.ModelPage>
    );
  },
);


export default AgentPage;
