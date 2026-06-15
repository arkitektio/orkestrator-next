import {
  PostmanAssignationFragment,
  useAssignationsQuery,
} from "../api/graphql";

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
  const { data: assignations_data } = useAssignationsQuery();

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
