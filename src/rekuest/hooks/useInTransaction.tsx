import {
  PostmanAssignationFragment,
  useAssignationsQuery,
} from "../api/graphql";
import { useInstancId } from "./useInstanceId";

export type InTransactionOptions = {
  object: string;
  identifier: string;
};

export type InTransactionReturn = {
  asArgs?: PostmanAssignationFragment[] | undefined;
};

export const useInTransaction = (
  options: InTransactionOptions,
): InTransactionReturn => {
  const id = useInstancId();

  const { data: assignations_data } = useAssignationsQuery({
    variables: {
      instanceId: id,
    },
  });

  const asArgs = assignations_data?.assignations.filter(
    (x) =>
      x.args[
        x.action.args.find((x) => x.identifier == options.identifier)?.key ||
          "_unset"
      ] == options.object,
  );

  return {
    asArgs,
  };
};
