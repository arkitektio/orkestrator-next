import { AssignationEventKind, PortKind } from "../api/graphql";
import { useAssignations } from "./useAssignations";

export const useAssignProgress = (options: {
  identifier?: string;
  object?: string;
  action?: string;
  implementation?: string;
  assignedImplementation?: string;
}) => {
  const { data } = useAssignations();

  const assignations = data?.assignations.filter((a) => {
    if (a.status == AssignationEventKind.Done) {
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
  });

  const latestProgress = assignations
    ?.at(-1)
    ?.events.filter(
      (e) =>
        e.kind == AssignationEventKind.Progress ||
        e.kind == AssignationEventKind.Done,
    )
    .at(0);

  const latestError = assignations
    ?.at(-1)
    ?.events.filter(
      (e) =>
        e.kind == AssignationEventKind.Error ||
        e.kind == AssignationEventKind.Critical,
    )
    .at(0);

  return { latestProgress };
};
