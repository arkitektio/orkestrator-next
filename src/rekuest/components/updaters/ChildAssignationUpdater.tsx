import { useDetailAssignationQuery, WatchChildAssignationsDocument, WatchChildAssignationsSubscription, WatchChildAssignationsSubscriptionVariables } from "@/rekuest/api/graphql";
import { useEffect } from "react";

export const ChildAssignationUpdater = (props: {assignationId: string}) => {
  const { assignationId } = props;
  const { data: childAssignationData, subscribeToMore } = useDetailAssignationQuery({
    variables: { id: assignationId },
  });


  useEffect(() => {
    const unsubscribe = subscribeToMore<WatchChildAssignationsSubscription, WatchChildAssignationsSubscriptionVariables>({
      document: WatchChildAssignationsDocument,
      variables: { parentId: assignationId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newChildAssignation = subscriptionData.data.childAssignations;

        if (!newChildAssignation) {
          return prev;
        }

        if (newChildAssignation.update) {
          return {
            ...prev,
            assignation: {
              ...prev.assignation,
              children: [
                ...(prev.assignation?.children || []).map((child) =>
                  child.id === newChildAssignation.update!.id
                    ? newChildAssignation.update!
                    : child,
                ),
              ],
            },
          };
        }

        if (newChildAssignation.create) {
          return {
            ...prev,
            assignation: {
              ...prev.assignation,
              children: [
                ...(prev.assignation?.children || []),
                newChildAssignation.create,
              ],
            },
          };
        }
        return prev;
      },
    });
    return () => {
      unsubscribe();
    };
  }, [assignationId, subscribeToMore]);

  return <> </>;
}
