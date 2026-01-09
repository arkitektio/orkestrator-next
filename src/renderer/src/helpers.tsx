import { toast } from "sonner";

type MutationFuncType = typeof useApolloMutation;

export const withAlertCatch = <T extends MutationFuncType>(fn: T): T => {
  const [mutation, options] = fn();
  const newOptions = {
    ...options,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  };
  return [mutation, newOptions] as T;
};
