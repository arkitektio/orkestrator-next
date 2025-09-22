import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateEntityCategoryMutationVariables,
  CreateReagentCategoryMutation,
  CreateReagentCategoryMutationVariables,
  GetGraphDocument,
  ListEntitiesDocument,
  ListGraphReagentCategoriesDocument,
  ListReagentCategoryDocument,
  useCreateEntityCategoryMutation,
  useCreateReagentCategoryMutation,
  useListReagentCategoryQuery,
  useSearchGraphsLazyQuery,
} from "../api/graphql";

const enumToOptions = (e: any) => {
  return Object.keys(e).map((key) => ({
    label: key,
    value: e[key],
  }));
};

export default (
  props: Partial<CreateReagentCategoryMutationVariables["input"]>,
) => {
  const [add] = useCreateReagentCategoryMutation({
    refetchQueries: [
      props.graph
        ? { query: GetGraphDocument, variables: { id: props.graph } }
        : {
            query: ListGraphReagentCategoriesDocument,
            variables: { id: props.graph },
          },
    ],
  });

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateReagentCategoryMutationVariables["input"]>({
    defaultValues: {
      ...props,
    },
  });

  const [search] = useSearchGraphsLazyQuery();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                input: {
                  ...data,
                },
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              {!props.graph && (
                <>
                  <GraphQLSearchField
                    label="Graph"
                    name="graph"
                    description="What graph do you want to add this expression to?"
                    searchQuery={search}
                  />
                </>
              )}
              <StringField
                label="Label"
                name="label"
                description="Whats the expression? (e.g. 'Person' or 'Connected to')"
              />
              <ParagraphField
                label="Description"
                name="description"
                description="What describes your expression the best? (e.g. 'A person is a human being')"
              />
              <StringField
                label="PURL"
                name="purl"
                description="What is the PURL of this expression?"
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
