import {
  PostmanTaskFragment,
  useMyTasksQuery,
} from "../api/graphql";

export type InTransactionOptions = {
  object: string;
  identifier: string;
};

export type InTransactionReturn = {
  asArgs?: PostmanTaskFragment[] | undefined;
};

export const useInTransaction = (
  options: InTransactionOptions,
): InTransactionReturn => {
  const { data: tasks_data } = useMyTasksQuery();

  const asArgs = tasks_data?.myTasks.filter(
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
