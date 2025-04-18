import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { OntologyFragment, useUpdateOntologyMutation } from "../api/graphql";

export const UpdateOntologyForm = (props: { ontology: OntologyFragment }) => {
  const [add] = useUpdateOntologyMutation();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm({
    defaultValues: {
      description: props.ontology.description,
      name: props.ontology.name,
    },
  });

  const onSubmitted = async (data: any) => {
    dialog({
      variables: {
        input: {
          id: props.ontology.id,
          ...data,
        },
      },
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitted)}>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex-col gap-1 flex">
              <StringField
                label="New name"
                name="name"
                description="The new name"
              />
              <ParagraphField
                label="New description"
                name="description"
                description="The new description"
              />
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
