import { GraphQLSearchField } from "@/components/fields/GraphQLListSearchField";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { NodeDescription } from "@/lib/rekuest/NodeDescription";
import { ChevronsUpDown } from "lucide-react";
import { useHooksSearchLazyQuery } from "../api/graphql";
import { useNodeAction } from "../hooks/useNodeAction";
import { usePortForm } from "../hooks/usePortForm";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

export const SelectHooks = (props: {}) => {
  const [search, _] = useHooksSearchLazyQuery();

  return <GraphQLSearchField name="hooks" searchQuery={search} />;
};

export const NodeAssignForm = (props: {
  id: string;
  args?: { [key: string]: any };
  hidden?: { [key: string]: any };
}) => {
  const { assign, latestAssignation, cancel, node } = useNodeAction({
    id: props.id,
  });

  const form = usePortForm({
    ports: node?.args || [],
    overwrites: props.args,
  });

  const onSubmit = async (data: any) => {
    console.log("Submitting");
    console.log(data);
    await assign({
      node: props.id,
      args: data,
      hooks: [],
    });
  };

  const data = form.watch();
  const isSubmitting = form.formState.isSubmitting;

  const { registry } = useWidgetRegistry();

  return (
    <div>
      <DialogHeader>
        <DialogTitle>{node?.name}</DialogTitle>
      </DialogHeader>
      <DialogDescription className="mt2">
        {node?.description && (
          <NodeDescription description={node?.description} variables={data} />
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            {node?.args.length == 0 && (
              <div className="text-muted"> No Arguments needed</div>
            )}
            <ArgsContainer
              registry={registry}
              ports={node?.args || []}
              hidden={props.args}
              path={[]}
            />

            <DialogFooter>
              <Button type="submit" variant={"outline"}>
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
