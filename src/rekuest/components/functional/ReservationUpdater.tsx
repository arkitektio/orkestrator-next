import { useService } from "@/arkitekt/hooks";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useEffect } from "react";
import {
  PostmanReservationFragmentDoc,
  ReservationsDocument,
  ReservationsQuery,
  WatchReservationEventsDocument,
  WatchReservationEventsSubscription,
  WatchReservationEventsSubscriptionVariables,
  WatchReservationsDocument,
  WatchReservationsSubscription,
  WatchReservationsSubscriptionVariables,
} from "../../api/graphql";
import { useRekuest } from "@/arkitekt/Arkitekt";

export const ReservationUpdater = (props: {}) => {
  const { settings } = useSettings();
  const client = useRekuest();

  useEffect(() => {
    if (client) {
      console.log("Subscribing to Postman Assignation");
      const subscription = client
        ?.subscribe<
          WatchReservationEventsSubscription,
          WatchReservationEventsSubscriptionVariables
        >({
          query: WatchReservationEventsDocument,
          variables: {
            instanceId: settings.instanceId,
          },
        })
        .subscribe((res) => {
          console.log(res);

          let update = res.data?.reservationEvents;

          if (update) {
            client.cache.updateFragment(
              {
                id: `Reservation:${update.reservation.id}`,
                fragment: PostmanReservationFragmentDoc,
                fragmentName: "PostmanReservation",
              },
              (data) => {
                if (!data) return;
                console.log("Update Fragment", data);
                return {
                  ...data,
                  events: data.events ? [...data.events, update] : [update],
                };
              },
            );
          }
        });

      return () => subscription.unsubscribe();
    }
  }, [client]);

  useEffect(() => {
    if (client) {
      console.log("Subscribing to Postman Assignation");
      const subscription = client
        ?.subscribe<
          WatchReservationsSubscription,
          WatchReservationsSubscriptionVariables
        >({
          query: WatchReservationsDocument,
          variables: {
            instanceId: settings.instanceId,
          },
        })
        .subscribe((res) => {
          console.log(res);

          let update = res.data?.reservations;

          if (update) {
            let old = client.cache.readQuery<ReservationsQuery>({
              query: ReservationsDocument,
              variables: {
                instanceId: settings.instanceId,
              },
            });

            console.log(old);

            client.cache.writeQuery<ReservationsQuery>({
              query: ReservationsDocument,
              variables: {
                instanceId: settings.instanceId,
              },
              data: {
                reservations: old?.reservations.concat([update]) || [update],
              },
            });
          }
        });

      return () => subscription.unsubscribe();
    }
  }, [client]);

  return <></>;
};
