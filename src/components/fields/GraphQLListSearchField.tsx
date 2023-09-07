import { useCallback } from "react";
import {
  Option,
  ListSearchField,
  ListSearchFieldProps,
} from "./ListSearchField";

export type GraphQLListSearchFieldProps = Omit<
  ListSearchFieldProps,
  "search"
> & {
  searchQuery: (x: {
    variables: { search?: string | undefined; values?: string[] };
  }) => Promise<{ data?: { options: Option[] }; errors?: any }>;
};

export const GraphQLSearchField: React.FC<GraphQLListSearchFieldProps> = ({
  searchQuery,
  ...props
}) => {
  const search = useCallback(
    async (x: {
      search?: string | undefined;
      values?: (string | number)[] | undefined;
    }) => {
      let queryResult = await searchQuery({
        variables: { search: x.search },
      });
      if (queryResult?.errors) {
        throw new Error(queryResult.errors[0].message);
      }
      if (!queryResult.data) {
        throw new Error("No data");
      }
      return queryResult.data?.options;
    },
    [searchQuery],
  );

  return <ListSearchField {...props} search={search} />;
};
