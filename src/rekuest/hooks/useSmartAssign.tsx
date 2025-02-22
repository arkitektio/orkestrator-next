import { useSettings } from "@/providers/settings/SettingsContext";
import { useCallback } from "react";
import {
  AssignInput,
  PostmanAssignationFragment,
  PrimaryNodeFragment,
  ReserveMutationVariables,
  useAssignMutation,
} from "../api/graphql";
import { toast } from "sonner";

export type ActionReserveVariables = Omit<
  ReserveMutationVariables,
  "instanceId"
>;
export type ActionAssignVariables = Omit<AssignInput, "instanceId">;

export type useActionReturn<T> = {
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanAssignationFragment>;
};

export type useActionOptions<T> = {
  id: string;
};

export const useAssign = <T extends any>(): useActionReturn<T> => {
  const { assign } = useAssign();

  const onNodeSelect = async (node: PrimaryNodeFragment) => {
    alert("Conditional Assign");
    let the_key = node.args?.at(0)?.key;

    let neededAdditionalPorts = node.args.filter(
      (x) => !x.nullable && x.key != the_key,
    );
    if (!the_key) {
      toast.error("No key found");
      return;
    }
    if (neededAdditionalPorts.length > 0) {
      setDialogNode({ node: node, args: { [the_key]: props.object } });
      return;
    }

    try {
      await assign({
        node: node.id,
        args: {
          [the_key]: props.object,
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onTemplateSelect = async (
    node: PrimaryNodeFragment,
    template: ListTemplateFragment,
  ) => {
    let the_key = node.args?.at(0)?.key;

    let neededAdditionalPorts = node.args.filter(
      (x) => !x.nullable && x.key != the_key,
    );
    if (!the_key) {
      toast.error("No key found");
      return;
    }
    if (neededAdditionalPorts.length > 0) {
      setDialogNode(node);
      return;
    }

    try {
      await assign({
        node: node.id,
        args: {
          [the_key]: props.object,
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return {
    onNodeSelect,
    onTemplateSelect,
  };
};
function setDialogNode(arg0: {
  node: PrimaryNodeFragment;
  args: { [x: string]: any };
}) {
  throw new Error("Function not implemented.");
}
