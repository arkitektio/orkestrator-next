import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { useNodeDescription } from "@/lib/rekuest/NodeDescription";
import { ApolloError } from "@apollo/client";
import { toast } from "sonner";
import { usePortForm } from "../hooks/usePortForm";
import { useTemplateAction } from "../hooks/useTemplateAction";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

export const TemplateAssignForm = (props: { id: string }) => {
  const { assign, latestAssignation, cancel, template } = useTemplateAction({
    id: props.id,
  });

  const description = useNodeDescription({
    description: template?.node.description || "",
  });

  const form = usePortForm({
    ports: template?.node.args || [],
  });

  const onSubmit = async (data: any) => {
    console.log("Submitting");
    console.log(data);
    try {
      await assign({
        template: props.id,
        args: data,
        hooks: [],
      });
    } catch (e) {
      let message = (e as ApolloError).message;
      if (!message) {
        toast.error("No key found");
        return;
      }
      toast.error(message);
    }
  };

  const { registry } = useWidgetRegistry();

  return (
    <>
      <h1 className="text-lg font-semibold mb-1">
        {template?.node.name}{" "}
        <p className="text-muted-foreground text-xs">@ {template?.interface}</p>
      </h1>

      <p className="text-mutated">{description}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <ArgsContainer
            registry={registry}
            ports={template?.node.args || []}
            path={[]}
          />
          <DialogFooter>
            <Button type="submit" className="btn">
              {" "}
              Submit{" "}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
