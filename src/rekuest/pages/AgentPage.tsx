import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetPodForAgentQuery } from "@/kabinet/api/graphql";
import { cn } from "@/lib/utils";
import { KabinetPod, RekuestAgent, RekuestMemoryShelve } from "@/linkers";
import {
  AgentFragment,
  ListImplementationFragment,
  useAgentQuery,
  usePinAgentMutation,
  WatchImplementationsDocument,
  WatchImplementationsSubscription,
  WatchImplementationsSubscriptionVariables,
} from "@/rekuest/api/graphql";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { BellIcon } from "lucide-react";
import { useEffect } from "react";
import { ImplementationActionButton } from "../buttons/ImplementationActionButton";
import ImplementationCard from "../components/cards/ImplementationCard";
import AgentCarousel from "../components/carousels/AgentCarousel";
import { StateDisplay } from "../components/State";
import Timestamp from "react-timestamp";
import { ClientAvatar, ClientImage } from "@/lok-next/components/ClientAvatar";

export const sizer = (length: number, index: number): string => {
  const divider = 3;

  return (index || 1) % 3 == 0 && index != 0
    ? "col-span-2 row-span-1"
    : "col-span-1 row-span-1";
};

const ImplementationBentoCard = ({
  implementation,
  className,
}: {
  implementation: ListImplementationFragment;
  className: string;
}) => (
  <div
    key={implementation.id}
    className={cn(
      "group relative  flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] ",
      // dark styles
      "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
  >
    <div>
      <img className="absolute -right-20 -top-20 opacity-60" />
    </div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-40 cursor-pointer">
      <BellIcon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
        {implementation.action.name}
      </h3>
      <p className="max-w-lg text-neutral-400"> @{implementation.interface}</p>
    </div>

    <div
      className={cn(
        "absolute bottom-0 flex w-full translate-y-[100%] flex-col items-start p-6 opacity-100 transition-all duration-300 group-hover:translate-y-0 ",
      )}
    >
      <p className="max-w-lg text-neutral-400"> {implementation.action.description}</p>
      <ImplementationActionButton id={implementation.id}>
        <Button
          variant="ghost"
          asChild
          size="sm"
          className="cursor-pointer opacity-100"
        >
          <a>
            Assign
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </ImplementationActionButton>
    </div>
  </div>
);

export const PinAgent = (props: { agent: AgentFragment }) => {
  const [pin] = usePinAgentMutation();

  return (
    <div className="flex flex-row gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          pin({
            variables: {
              input: { id: props.agent.id, pin: !props.agent.pinned },
            },
          });
        }}
      >
        {props.agent.pinned ? "Unpin" : "Pin"}
      </Button>
    </div>
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
    return <></>;
  }

  return (
    <KabinetPod.DetailLink object={data?.podForAgent.id}>
      <Button variant="outline" size="sm">
        Running on {data?.podForAgent?.resource?.name} -{" "}
        {data?.podForAgent?.backend?.name}
      </Button>
    </KabinetPod.DetailLink>
  );
};

export default asDetailQueryRoute(
  useAgentQuery,
  ({ data, refetch, subscribeToMore }) => {
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
              </>
            }}
          />
        }
        pageActions={
          <div className="flex flex-row gap-2">
            <PinAgent agent={data.agent} />
            <ManagedByCard agent={data.agent} />
            {data.agent.memoryShelve && <RekuestMemoryShelve.DetailLink object={data.agent.memoryShelve.id}>
              <Button variant="outline" size="sm">
                Memory Shelve
              </Button>
            </RekuestMemoryShelve.DetailLink>}
          </div>
        }
      >
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      data.agent.connected
                        ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
                        : "bg-red-500 shadow-lg shadow-red-500/50"
                    )}
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.agent.connected ? "Connected" : "Disconnected"}
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    Last seen <Timestamp date={data.agent.lastSeen} relative />
                  </span>
                </div>

                <RekuestAgent.DetailLink object={data.agent.id}>
                  <h1 className="scroll-m-20 text-5xl font-bold tracking-tight lg:text-6xl hover:text-primary transition-colors cursor-pointer">
                    {data.agent.name}
                  </h1>
                </RekuestAgent.DetailLink>

                {data.agent.extensions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.agent.extensions.map((extension) => (
                      <Badge key={extension} variant="outline" className="text-xs font-mono">
                        {extension}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 flex items-start">
              <div className="w-full max-w-sm">
                <ClientImage
                  clientId={data.agent.registry.client.clientId}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Implementations Section */}
          <div className="space-y-6 pt-8 border-t">
            <ListRender
              array={data.agent.implementations}
              title={
                <div className="flex items-baseline gap-3 mb-6">
                  <h2 className="text-2xl font-bold">Registered Actions</h2>
                  <span className="text-sm text-muted-foreground">
                    {data.agent.implementations.length} {data.agent.implementations.length === 1 ? 'action' : 'actions'}
                  </span>
                </div>
              }
            >
              {(item) => <ImplementationCard item={item} />}
            </ListRender>
          </div>
        </div>
      </RekuestAgent.ModelPage>
    );
  },
);
