import { useSettings } from "@/providers/settings/SettingsContext";
import { useAssignations } from "@/rekuest/hooks/useAssignations";
import { useRekuest } from "@jhnnsrs/rekuest-next";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  AssignationsDocument,
  AssignationsQuery,
  PostmanAssignationFragmentDoc,
  WatchAssignationEventsDocument,
  WatchAssignationEventsSubscription,
  WatchAssignationEventsSubscriptionVariables,
  WatchAssignationsDocument,
  WatchAssignationsSubscription,
} from "../../api/graphql";

export const AssignationToaster = (props: { id: string }) => {
  const { data } = useAssignations();

  return (
    <div className="">
      {data?.assignations
        .find((a) => a.id === props.id)
        ?.events.map((e, i) => (
          <div key={i} className="">
            <h3 className="text-lg font-semibold">{e.kind}</h3>
            <p>{e.message}</p>
          </div>
        ))}
    </div>
  );
};

export const AssignationUpdater = (props: {}) => {
  const { settings } = useSettings();
  const { client } = useRekuest();

  useEffect(() => {
    if (client) {
      console.log("Subscribing to Postman Assignation");
      const subscription = client
        ?.subscribe<
          WatchAssignationEventsSubscription,
          WatchAssignationEventsSubscriptionVariables
        >({
          query: WatchAssignationEventsDocument,
          variables: {
            instanceId: settings.instanceId,
          },
        })
        .subscribe((res) => {
          console.log(res);

          let update = res.data?.assignationEvents;

          if (update) {
            client.cache.updateFragment(
              {
                id: `Assignation:${update.assignation.id}`,
                fragment: PostmanAssignationFragmentDoc,
                fragmentName: "PostmanAssignation",
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
          WatchAssignationsSubscription,
          WatchAssignationEventsSubscriptionVariables
        >({
          query: WatchAssignationsDocument,
          variables: {
            instanceId: settings.instanceId,
          },
        })
        .subscribe((res) => {
          console.log(res);

          let update = res.data?.assignations;

          if (update) {
            let old = client.cache.readQuery<AssignationsQuery>({
              query: AssignationsDocument,
              variables: {
                instanceId: settings.instanceId,
              },
            });

            console.log(old);

            client.cache.writeQuery<AssignationsQuery>({
              query: AssignationsDocument,
              variables: {
                instanceId: settings.instanceId,
              },
              data: {
                assignations: old?.assignations.concat([update]) || [update],
              },
            });

            toast(<AssignationToaster id={update.id} />);
          }
        });

      return () => subscription.unsubscribe();
    }
  }, [client]);

  return <></>;
};
