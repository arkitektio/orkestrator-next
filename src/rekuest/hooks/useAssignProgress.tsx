import { AssignationEventKind, PortKind } from "../api/graphql";
import { useAssignations } from "./useAssignations";

export const useAssignProgress = (options: {
  identifier?: string;
  object?: string;
  node?: string;
  template?: string;
  assignedTemplate?: string;
}) => {
  const { data } = useAssignations();

  const assignations = data?.assignations.filter((a) => {
    if (a.status == AssignationEventKind.Done) {
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
