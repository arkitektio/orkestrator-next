import { useService } from "@/arkitekt/hooks";
import { useSettings } from "@/providers/settings/SettingsContext";
import { useAssignations } from "@/rekuest/hooks/useAssignations";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  AssignationsDocument,
  AssignationsQuery,
  WatchAssignationEventsSubscriptionVariables,
  WatchAssignationsDocument,
  WatchAssignationsSubscription,
} from "../../api/graphql";

export const AssignationToaster = (props: { id: string }) => {
  const { data } = useAssignations();

  const events = data?.assignations.find((a) => a.id === props.id)?.events;

  return (
    <div>
      <a to="" className="">
        <>
          <h1>Assignation Created</h1>
          {events?.map((e) => <div className="">{e.kind}</div>)}
        </>
      </a>
    </div>
  );
};

export const AssignationUpdater = (props: {}) => {
  const { settings } = useSettings();
  const client = useService("rekuest");
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
          console.log("Received assignation update", res);

          let event = res.data?.assignations.event;
          let create = res?.data?.assignations.create;

          if (event) {
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
                assignations: (old?.assignations || []).map((ass) =>
                  ass.reference == event.reference
                    ? { ...ass, events: ass.events.concat([event]) }
                    : ass,
                ),
              },
            });
          }

          if (create) {
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
                assignations: old?.assignations.concat([create]) || [create],
              },
            });

            toast(<AssignationToaster id={create.id} />);
          }
        });

      return () => subscription.unsubscribe();
    }
  }, [client]);

  return <></>;
};
