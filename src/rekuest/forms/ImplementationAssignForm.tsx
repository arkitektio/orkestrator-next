import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { useActionDescription } from "@/lib/rekuest/ActionDescription";
import { cn } from "@/lib/utils";
import { ApolloError } from "@apollo/client";
import { toast } from "sonner";
import { PostmanAssignationFragment } from "../api/graphql";
import { useImplementationAction } from "../hooks/useImplementationAction";
import { usePortForm } from "../hooks/usePortForm";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

export type ImplementationAssignFormProps = {
  id: string;
  onAssign?: (assignation: PostmanAssignationFragment) => void;
  onError?: (error: any) => void;
  args?: any;
  hidden?: { [key: string]: any };
};

export const ImplementationAssignForm = (props: ImplementationAssignFormProps) => {
  const { assign, latestAssignation, cancel, implementation } = useImplementationAction({
    id: props.id,
  });

  const description = useActionDescription({
    description: implementation?.action.description || "",
  });

  const form = usePortForm({
    ports: implementation?.action.args || [],
    overwrites: { ...latestAssignation?.args, ...props.args },
    reValidateMode: "onChange",
  });


  const onSubmit = async (data: any) => {
    console.log("Submitting");
    console.log(data);
    try {
      let assignation = await assign({
        implementation: props.id,
        args: data,
        hooks: [],
      });

      props.onAssign?.(assignation);
    } catch (e) {
      let message = (e as ApolloError).message;
      if (props.onError) {
        props.onError?.(e);
      } else {
        if (!message) {
          toast.error("No key found");
          return;
        }
        toast.error(message);
      }
    }
  };

  const { registry } = useWidgetRegistry();

  return (
    <>
      <h1 className="text-lg font-semibold mb-1">
        {implementation?.action.name}
        <p className="text-muted-foreground text-xs">@ {implementation?.interface}</p>
      </h1>

      <p className="text-mutated">{description}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <ArgsContainer
            registry={registry}
            ports={implementation?.action.args || []}
            path={[]}
            bound={implementation?.id}
            groups={implementation?.action.portGroups}
            hidden={props.hidden}
          />

          <DialogFooter>
            <Button type="submit" className={cn(form.formState.isSubmitting && "bg-red-200")}>
              {" "}
              Submit{" "}
            </Button>
        
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
