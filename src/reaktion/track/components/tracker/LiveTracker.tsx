import { useEffect } from "react";

import { useTrackRiver } from "../../context";
import {
  DetailRunFragment,
  EventsDocument,
  EventsSubscription,
  RunEventFragment,
  useEventsBetweenQuery,
} from "@/reaktion/api/graphql";

export const LiveTracker = ({
  startT,
  run,
}: {
  startT: number;
  run: DetailRunFragment;
}) => {
  const { setRunState } = useTrackRiver();

  const { data: events, subscribeToMore } = useEventsBetweenQuery({
    variables: {
      id: run.id,
      min: startT,
    },
  });

  useEffect(() => {
    let highest_t = 0;
    let newEvents = events?.eventsBetween?.reduce((prev, event) => {
      if (event) {
        let prev_node = prev?.find((i) => i.source === event?.source);
        if (prev_node) {
          if (prev_node.t <= event.t) {
            highest_t = Math.max(highest_t, event.t);

            return prev.map((i) => (i.source === event.source ? event : i));
          }
          return prev;
        }
        return [...prev, event];
      }
      return prev;
    }, [] as RunEventFragment[]);

    console.log(newEvents);
    setRunState({ t: highest_t, events: newEvents });
  }, [events?.eventsBetween]);

  useEffect(() => {
    console.log("fetching events");

    let unsubscripe = subscribeToMore<EventsSubscription>({
      document: EventsDocument,
      variables: { id: run.id },
      updateQuery: (prev, { subscriptionData }) => {
        console.log("got new event", subscriptionData);
        if (!subscriptionData.data) return prev;
        const newEvent = subscriptionData.data.events;
        if (!newEvent) return prev;
        return { eventsBetween: [...(prev.eventsBetween || []), newEvent] };
      },
    });

    return () => {
      unsubscripe();
    };
  }, [run.id]);

  return <></>;
};
