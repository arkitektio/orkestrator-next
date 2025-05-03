import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { useGetPodForAgentQuery } from "@/kabinet/api/graphql";
import { cn } from "@/lib/utils";
import { KabinetPod, RekuestAgent } from "@/linkers";
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
import { Badge } from "@/components/ui/badge";

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
      clientId: props.agent.registry.app.clientId,
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
            }}
          />
        }
        pageActions={
          <div className="flex flex-row gap-2">
            <PinAgent agent={data.agent} />
            <ManagedByCard agent={data.agent} />
          </div>
        }
      >
        <AgentCarousel agent={data.agent} />

        <div className="p-6 mt-2">
          {data.agent.extensions.map((extension) => (
            <Badge key={extension} className="mr-2">
              {extension}
            </Badge>
          ))}
        </div>

        <div className="p-6 mt-2">
          {data.agent.states.map((state) => (
            <>
              <StateDisplay stateId={state.id} label={true} />
            </>
          ))}

          <ListRender
            array={data.agent.implementations}
            title={<p className="text-xs ml-2 mb-2">Registered Actions</p>}
          >
            {(item) => <ImplementationCard item={item} />}
          </ListRender>
        </div>
      </RekuestAgent.ModelPage>
    );
  },
);
