import { useMutation as useApolloMutation } from "@apollo/client";
import { toast } from "sonner";

// `fn` is expected to be a zero-arg wrapper hook (e.g. `() => useMutation(MY_DOCUMENT)`),
// not `useMutation` itself (which requires a document argument).
type MutationFuncType = () => ReturnType<typeof useApolloMutation>;

export const withAlertCatch = <T extends MutationFuncType>(fn: T): ReturnType<T> => {
  const [mutation, options] = fn();
  const newOptions = {
    ...options,
    onError: (error: Error) => {
      console.error(error);
      toast.error(error.message);
    },
  };
  return [mutation, newOptions] as ReturnType<T>;
};
