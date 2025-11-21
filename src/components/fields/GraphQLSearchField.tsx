import { useCallback } from "react";
import { Option, SearchField, SearchFieldProps } from "./SearchField";

export type GraphQLSearchFieldProps = Omit<SearchFieldProps, "search"> & {
  searchQuery: (x: {
    variables: { search?: string | undefined; values?: string[] };
  }) => Promise<{ data?: { options: Option[] }; errors?: any }>;
};

export const GraphQLSearchField: React.FC<GraphQLSearchFieldProps> = ({
  searchQuery,
  ...props
}) => {
  const search = useCallback(
    async (x: {
      search?: string | undefined;
      values?: (string | number)[] | undefined;
    }) => {
      const queryResult = await searchQuery({
        variables: {
          search: x.search,
          values: x.values?.map((x) => x.toString()),
        },
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

  return <SearchField {...props} search={search} />;
};
