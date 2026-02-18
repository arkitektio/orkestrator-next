import { useDialog } from "@/app/dialog";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateEntityMutationVariables,
  GetEntityCategoryDocument,
  useCreateEntityMutation,
  useGetEntityCategoryQuery,
} from "../api/graphql";
import { toast } from "sonner";

const TForm = (props: { category: string }) => {

  const {data} = useGetEntityCategoryQuery({
    variables: {
      id: props.category
    }
  })


  const [add] = useCreateEntityMutation({
    variables: {
      input: { entityCategory: props.category },
    },
    refetchQueries: [
      {
        query: GetEntityCategoryDocument,
        variables: { id: props.category },
      },
    ],
  });

  const { closeDialog } = useDialog();

  const form = useForm<CreateEntityMutationVariables["input"]>({
    defaultValues: {

    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            add({
              variables: {
                input: {
                  ...data,
                  entityCategory: props.category,
                },
              },
            })
              .then(closeDialog)
              .catch((e) => {
                toast.error("Error creating entity:", e);
              });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              {data?.entityCategory.propertyDefinitions.map((p) => (
                <StringField
                  key={p.key}
                  label={p.label || p.key}
                  name={p.key}
                  description={p.description || `Add a value for ${p.label || p.key}`}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Change</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default TForm
