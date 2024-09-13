import { useSettings } from "@/providers/settings/SettingsContext";
import {
  AssignationEventKind,
  PortKind,
  useAssignationsQuery,
} from "../api/graphql";
import { progress } from "framer-motion";
import { useMemo } from "react";

export const useAssignations = () => {
  const { settings } = useSettings();
  const queryResult = useAssignationsQuery({
    variables: {
      instanceId: settings.instanceId,
    },
  });

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
  node?: string;
  template?: string;
  assignedTemplate?: string;
  allowDone?: boolean;
};

export const useFilteredAssignations = (options?: FilterOptions) => {
  const { data } = useAssignations();

  const assignations = useMemo(
    () =>
      data?.assignations.filter((a) => {
        if (!options) {
          return true;
        }

        if (a.status == AssignationEventKind.Done && !options.allowDone) {
          return false;
        }

        if (options.node) {
          if (a.node?.id != options.node) {
            return false;
          }
        }

        if (options.template) {
          if (a.template?.id != options.template) {
            return false;
          }
        }

        if (options.assignedTemplate) {
          console.log(a.provision?.template.id, options.assignedTemplate);
          if (a.provision?.template.id != options.assignedTemplate) {
            return false;
          }
        }

        if (options.identifier && options.object) {
          let matches = false;
          for (const port of a.node.args) {
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
      options?.node,
      options?.template,
      options?.assignedTemplate,
      options?.identifier,
      options?.object,
    ],
  );

  return assignations;
};

export const useLatestAssignation = (options: FilterOptions) => {
  const assignations = useFilteredAssignations(options);
  const latestAssignation = assignations.at(-1);
  return latestAssignation;
};

export const useLiveAssignation = (options: FilterOptions) => {
  const assignation = useLatestAssignation(options);

  const latestProgress = assignation?.events
    .filter((x) => x.kind == AssignationEventKind.Progress)
    .at(0)?.progress;
  const latestYield = assignation?.events
    .filter((x) => x.kind == AssignationEventKind.Yield)
    .at(0)?.returns;
  const done = assignation?.events
    .filter((x) => x.kind == AssignationEventKind.Done)
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
    done,
    error,
    nodeId: assignation?.node.id,
    message: latestMessage,
  };
};
