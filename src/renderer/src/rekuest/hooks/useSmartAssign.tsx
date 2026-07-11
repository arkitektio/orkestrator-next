import { toast } from "sonner";
import { buildAssignInput } from "@/rekuest/assign";
import {
  AssignInput,
  ListImplementationFragment,
  PostmanTaskFragment,
  PrimaryActionFragment,
} from "../api/graphql";
import { useAssign } from "./useAssign";

export type ActionAssignVariables = AssignInput;

export type useActionReturn = {
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanTaskFragment>;
};

export type useActionOptions = {
  id: string;
};

export const useSmartAssign = (props: { object: any }) => {
  const { assign } = useAssign();

  const onActionSelect = async (action: PrimaryActionFragment) => {
    const the_key = action.args?.at(0)?.key;

    const neededAdditionalPorts = action.args.filter(
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
      await assign(buildAssignInput({
        action: action.id,
        args: {
          [the_key]: props.object,
        },
      }));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onImplementationSelect = async (
    action: PrimaryActionFragment,
    _implementation: ListImplementationFragment,
  ) => {
    const the_key = action.args?.at(0)?.key;

    const neededAdditionalPorts = action.args.filter(
      (x) => !x.nullable && x.key != the_key,
    );
    if (!the_key) {
      toast.error("No key found");
      return;
    }
    if (neededAdditionalPorts.length > 0) {
      setDialogAction({ action, args: { [the_key]: props.object } });
      return;
    }

    try {
      await assign(buildAssignInput({
        action: action.id,
        args: {
          [the_key]: props.object,
        },
      }));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return {
    onActionSelect,
    onImplementationSelect,
  };
};

function setDialogAction(_arg0: {
  action: PrimaryActionFragment;
  args: { [x: string]: any };
}) {
  throw new Error("Function not implemented.");
}
