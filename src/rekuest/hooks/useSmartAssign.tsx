import { toast } from "sonner";
import {
  AssignInput,
  PostmanAssignationFragment,
  PrimaryActionFragment,
  ReserveMutationVariables
} from "../api/graphql";

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

  const onActionSelect = async (action: PrimaryActionFragment) => {
    alert("Conditional Assign");
    let the_key = action.args?.at(0)?.key;

    let neededAdditionalPorts = action.args.filter(
      (x) => !x.nullable && x.key != the_key,
    );
    if (!the_key) {
      toast.error("No key found");
      return;
    }
    if (neededAdditionalPorts.length > 0) {
      setDialogAction({ action: action, args: { [the_key]: props.object } });
      return;
    }

    try {
      await assign({
        action: action.id,
        args: {
          [the_key]: props.object,
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onImplementationSelect = async (
    action: PrimaryActionFragment,
    implementation: ListImplementationFragment,
  ) => {
    let the_key = action.args?.at(0)?.key;

    let neededAdditionalPorts = action.args.filter(
      (x) => !x.nullable && x.key != the_key,
    );
    if (!the_key) {
      toast.error("No key found");
      return;
    }
    if (neededAdditionalPorts.length > 0) {
      setDialogAction(action);
      return;
    }

    try {
      await assign({
        action: action.id,
        args: {
          [the_key]: props.object,
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return {
    onActionSelect,
    onImplementationSelect,
  };
};
function setDialogAction(arg0: {
  action: PrimaryActionFragment;
  args: { [x: string]: any };
}) {
  throw new Error("Function not implemented.");
}
