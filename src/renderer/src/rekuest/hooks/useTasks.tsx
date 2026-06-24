import { useMemo } from "react";
import {
  AssignationEventKind,
  PortKind,
  PostmanAssignationFragment,
  useAssignationsQuery,
} from "../api/graphql";

export const useAssignations = () => {
  const queryResult = useAssignationsQuery();

  return queryResult;
};

export const useAssignation = (options: { assignation?: string }) => {
  const { data } = useAssignations();
  const assignation = data?.assignations.find(
    (a) => a.id === options.assignation,
  );

  return assignation;
};

export type FilterOptions = {
  identifier?: string;
  object?: string;
  action?: string;
  implementation?: string;
  assignation?: string;
  assignedImplementation?: string;
  assignedAction?: string;
  allowDone?: boolean;
  refetch?: boolean;
};


export const useFilteredAssignations = (options?: FilterOptions) => {
  const { data } = useAssignations();

  const assignations = useMemo(
    () =>
      data?.assignations.filter((a) => {
        if (!options) {
          return true;
        }

        if (options.assignation) {
          if (a.id != options.assignation) {
            return false;
          }
        }

        if (
          !options.allowDone &&
          (a.isDone || a.latestEventKind == AssignationEventKind.Done)
        ) {
          return false;
        }

        if (options.action) {
          if (a.action?.id != options.action) {
            return false;
          }
        }

        if (options.implementation) {
          if (a.implementation?.id != options.implementation) {
            return false;
          }
        }

        if (options.assignedAction) {
          if (a?.action.id != options.assignedAction) {
            return false;
          }
        }

        if (options.assignedImplementation) {
          console.log(a.provision?.implementation.id, options.assignedImplementation);
          if (a.provision?.implementation.id != options.assignedImplementation) {
            return false;
          }
        }

        if (options.identifier && options.object) {
          let matches = false;
          for (const port of a.action.args) {
            if (
              port.kind == PortKind.Structure &&
              port.identifier == options.identifier
            ) {
              if (a.args[port.key] == options.object) {
                matches = true;
                break;
              }
            }

            if (!matches) {
              return false;
            }
          }
        }

        return true;
      }) || [],
    [
      data?.assignations,
      options?.action,
      options?.implementation,
      options?.assignedImplementation,
      options?.identifier,
      options?.object,
      options?.assignation,
      options?.allowDone,
      options?.refetch,
    ],
  );

  return assignations;
};

export const useLatestAssignation = (options: FilterOptions) => {
  const assignations = useFilteredAssignations(options);
  const latestAssignation = assignations.at(-1);
  return latestAssignation;
};

export const deriveLiveState = (
  assignation: PostmanAssignationFragment | undefined,
) => {
  const latestProgress = assignation?.events
    .filter((x) => x.kind == AssignationEventKind.Progress)
    .at(0)?.progress;
  const latestYield = assignation?.events
    .filter((x) => x.kind == AssignationEventKind.Yield)
    .at(0)?.returns;
  const done = assignation?.events
    .filter((x) => x.kind == AssignationEventKind.Done)
    .at(0);
  const cancelled = assignation?.events
    .filter((x) => x.kind == AssignationEventKind.Cancelled)
    .at(0);

  const error = assignation?.events
    .filter(
      (x) =>
        x.kind == AssignationEventKind.Critical ||
        x.kind == AssignationEventKind.Error,
    )
    .at(0)?.message;

  const latestMessage = assignation?.events.find(
    (x) => x.message != undefined,
  )?.message;

  return {
    progress:
      done == undefined && error == undefined ? latestProgress : undefined,
    yield: latestYield,
    cancelled: cancelled,
    done,
    error,
    actionId: assignation?.action.id,
    actionName: assignation?.action.name,
    message: latestMessage,
    event: assignation?.events.at(0),
    assignationId: assignation?.id,
    id: assignation?.id,
    reference: assignation?.reference,
    latestEventKind: assignation?.latestEventKind,
    isDone: assignation?.isDone,
    createdAt: assignation?.createdAt,
  };
};

export type LiveAssignationState = ReturnType<typeof deriveLiveState>;

export const useLiveAssignation = (options: FilterOptions) => {
  // Live trackers follow a specific assignation through completion, so Done
  // assignations stay in scope unless the caller opts out explicitly.
  const assignation = useLatestAssignation({ allowDone: true, ...options });

  return useMemo(() => deriveLiveState(assignation), [assignation]);
};
