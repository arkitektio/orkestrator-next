import { useCallback } from "react";
import {
  ListSearchField,
  ListSearchFieldProps,
  Option,
} from "./ListSearchField";
import { CreatableListSearchField } from "./CreatableListSearchField";

export type GraphQLListSearchFieldProps = Omit<
  ListSearchFieldProps,
  "search"
> & {
  searchQuery: (x: {
    variables: { search?: string | undefined; values?: string[] };
  }) => Promise<{ data?: { options: Option[] }; errors?: any }>;
  createMutation: (x: { variables: { input: string } }) => Promise<{
    data?:
    | { result?: { value?: string | number } | null | undefined }
    | null
    | undefined;
    errors?: any;
  }>;
};

export const GraphQLCreatableListSearchField: React.FC<GraphQLListSearchFieldProps> = ({
  searchQuery,
  createMutation,
  ...props
}) => {
  const search = useCallback(
    async (x: {
      search?: string | undefined;
      values?: (string | number)[] | undefined;
    }) => {
      let queryResult = await searchQuery({
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

  const create = useCallback(
    async (input: string) => {
      let queryResult = await createMutation({
        variables: { input: input },
      });
      if (queryResult?.errors) {
        throw new Error(queryResult.errors[0].message);
      }
      if (!queryResult.data) {
        throw new Error("No data");
      }
      if (!queryResult.data.result?.value) {
        throw new Error("No value");
      }
      return queryResult.data.result?.value;
    },
    [createMutation],
  );

  return <CreatableListSearchField {...props} search={search} create={create} />;
};
