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

export const NodeAssignForm = (props: { id: string }) => {
  const { assign, latestAssignation, cancel, node } = useNodeAction({
    id: props.id,
  });

  const form = usePortForm({
    ports: node?.args || [],
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
              path={[]}
            />
            <Collapsible>
              <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">Advanced</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <SelectHooks />
              </CollapsibleContent>
            </Collapsible>

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
