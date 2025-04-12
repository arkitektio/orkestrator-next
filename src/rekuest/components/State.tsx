import { StateFragment } from "../api/graphql";
import { useWidgetRegistry } from "../widgets/WidgetsContext";
import { useGetStateQuery, WatchStateEventsSubscription, WatchStateEventsSubscriptionVariables, WatchStateEventsDocument} from "../api/graphql";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";


export const useRekuestState = ({
  state: id
}) => {

  const { data, subscribeToMore, refetch } = useGetStateQuery({
    variables: {
      id: id,
    },
  });

  useEffect(() => {
    console.log("Refetching");
    refetch({
      id: id,
    });
  }, [id]);

  useEffect(() => {
    if (data?.state) {
      console.log( "subscribing to", data.state.id);
      return subscribeToMore<
        WatchStateEventsSubscription,
        WatchStateEventsSubscriptionVariables
      >({
        document: WatchStateEventsDocument,
        variables: {
          stateID: data.state.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          console.log("State update for", prev, subscriptionData.data);
          // TODO: This is so weird and hacky because why is it subscribing to the other state as well?
          if (
            subscriptionData.data.stateUpdateEvents.id !== data.state.id
          ) {
            return prev;
          }
          return {
            state: {
              ...prev.state,
              ...subscriptionData.data.stateUpdateEvents,
            },
          };
        },
      });
    }

    return () => {};
  }, [subscribeToMore, data?.state?.id]);


  return data;
};


export const StateDisplay = ({
  stateId,
  select,
  label,
}: {
  stateId: string;
  label?: boolean;
  select?: string[] | null | undefined;
}) => {
  const { registry } = useWidgetRegistry();


  const data = useRekuestState({
    state: stateId,
  });

  const ports = select
    ? data?.state.stateSchema.ports.filter((p) => select.includes(p.key)) || []
    : data?.state.stateSchema.ports || [];

  return (
    <Card className="grid grid-cols-2 gap-4 p-3">
      {ports.map((port, index) => {
        const Widget = registry.getReturnWidgetForPort(port);

        return (
          <div className="flex-1 h-96 w-96 flex flex-col gap-2" key={index}>
            {label && <label>{port.key}</label>}
            <Widget
              key={index}
              value={data?.state?.value[port.key]}
              port={port}
              widget={port.returnWidget}
            />
          </div>
        );
      })}
    </Card>
  );
};
