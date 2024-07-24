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
import { useRekuest } from "@/arkitekt";

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
  const client = useRekuest();
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
            client.cache.updateQuery<AssignationsQuery>(
              {
                query: AssignationsDocument,
                variables: {
                  instanceId: settings.instanceId,
                },
              },
              (data) => {
                let assignation = data?.assignations.find(
                  (a) => a.id === event.assignation.id,
                );

                if (!assignation) {
                  console.error(
                    "Assignation not found",
                    event.assignation.id,
                    data?.assignations,
                  );
                }

                return {
                  assignations: (data?.assignations || []).map((ass) =>
                    ass.id == event.assignation.id
                      ? { ...ass, events: [event, ...ass.events] }
                      : ass,
                  ),
                };
              },
            );
          }

          if (create) {
            client.cache.updateQuery<AssignationsQuery>(
              {
                query: AssignationsDocument,
                variables: {
                  instanceId: settings.instanceId,
                },
              },
              (data) => {
                return {
                  assignations: data?.assignations.concat([create]) || [create],
                };
              },
            );

            console.error("Added assignation", create.reference);
            toast(<AssignationToaster id={create.id} />);
          }
        });

      return () => subscription.unsubscribe();
    }
  }, [client]);

  return <></>;
};
