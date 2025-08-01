import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { ActionDescription } from "@/lib/rekuest/ActionDescription";
import { useHooksSearchLazyQuery } from "../api/graphql";
import { useAction } from "../hooks/useAction";
import { usePortForm } from "../hooks/usePortForm";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

export const SelectHooks = (props: {}) => {
  const [search, _] = useHooksSearchLazyQuery();

  return <GraphQLListSearchField name="hooks" searchQuery={search} />;
};

export const ActionAssignForm = (props: {
  id: string;
  args?: { [key: string]: any };
  hidden?: { [key: string]: any };
}) => {
  const { assign, latestAssignation, cancel, action } = useAction({
    id: props.id,
  });

  const form = usePortForm({
    ports: action?.args || [],
    overwrites: props.args,
  });

  const onSubmit = async (data: any) => {
    console.log("Submitting");
    console.log(data);
    await assign({
      action: props.id,
      args: data,
      hooks: [],
    });
  };

  const data = form.watch();
  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  const { registry } = useWidgetRegistry();

  return (
    <div>
      <DialogHeader>
        <DialogTitle>{action?.name}</DialogTitle>
      </DialogHeader>
      <DialogDescription className="mt2">
        {action?.description && (
          <ActionDescription
            description={action?.description}
            variables={data}
          />
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            {action?.args.length == 0 && (
              <div className="text-muted"> No Arguments needed</div>
            )}
            <ArgsContainer
              registry={registry}
              groups={action?.portGroups || []}
              ports={action?.args || []}
              hidden={props.args}
              path={[]}
            />

            <DialogFooter>
              <Button type="submit" variant={"outline"} disabled={!isValid}>
                {" "}
                Do {isSubmitting && "ing"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogDescription>
    </div>
  );
};
