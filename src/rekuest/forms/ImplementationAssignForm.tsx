import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { useActionDescription } from "@/lib/rekuest/ActionDescription";
import { cn } from "@/lib/utils";
import { ApolloError } from "@apollo/client";
import { toast } from "sonner";
import {
  ListDependencyFragment,
  PostmanAssignationFragment,
  useImplementationOptionsLazyQuery,
} from "../api/graphql";
import { useImplementationAction } from "../hooks/useImplementationAction";
import { useImplementationForm } from "../hooks/useImplementationForm";
import { useWidgetRegistry } from "../widgets/WidgetsContext";
import { ContainerGrid, ResponsiveContainerGrid } from "@/components/layout/ContainerGrid";

export type ImplementationAssignFormProps = {
  id: string;
  onAssign?: (assignation: PostmanAssignationFragment) => void;
  onError?: (error: any) => void;
  args?: any;
  hidden?: { [key: string]: any };
};

export const DependencyWidget = ({
  dependency,
}: {
  dependency: ListDependencyFragment;
}) => {
  const [search] = useImplementationOptionsLazyQuery({
    variables: { dependency: dependency.id },
  });

  return (
    <div className="rounded shadow-md border border-gray-600 p-4 rounded-md max-h-60  ">
      <GraphQLSearchField
        name={`dependencies.${dependency.key}`}
        searchQuery={search}
        label={dependency.key}
        description={dependency.description || ""}
      />
    </div>
  );
};

export const ImplementationAssignForm = (
  props: ImplementationAssignFormProps,
) => {
  const { assign, latestAssignation, implementation, error } =
    useImplementationAction({
      id: props.id,
    });

  const description = useActionDescription({
    description: implementation?.action.description || "",
  });

  const form = useImplementationForm({
    implementation: implementation,
    overwrites: { ...latestAssignation?.args, ...props.args },
    presetDependencies: latestAssignation?.dependencies,
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: {
    args: Record<string, unknown>;
    dependencies: Record<string, string>;
  }) => {
    console.log("Submitting");
    console.log(data);
    try {
      const assignation = await assign({
        implementation: props.id,
        args: data.args,
        dependencies: data.dependencies,
        hooks: [],
      });

      props.onAssign?.(assignation);
    } catch (e) {
      const message = (e as ApolloError).message;
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

  const dependencies = form.watch("dependencies");

  const { registry } = useWidgetRegistry();

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full h-full mx-auto p-6 overflow-hidden @container">
          <div className="flex flex-col sm:justify-between mb-2 h-full min-h-0">


          <h1 className="text-lg font-semibold mb-1 flex-initial ">
            {implementation?.action.name}
            <p className="text-muted-foreground text-xs">
              @ {implementation?.interface}
            </p>
          </h1>

          <div className="text-muted-foreground flex-initial my-2">{description}</div>
          <div className="flex-grow  mb-4 @container ">
            <ArgsContainer
              registry={registry}
              ports={implementation?.action.args || []}
              path={["args"]}
              bound={implementation?.id}
              groups={implementation?.action.portGroups}
              hidden={props.hidden}
            />

          </div>
            <ResponsiveContainerGrid className="grid @lg:grid-cols-3 @xl:grid-cols-3 @2xl:grid-cols-4  @3xl:grid-cols-4 @4xl:grid-cols-4 @5xl:grid-cols-4  @6xl:grid-cols-4 gap-2 max-h-128 overflow-y-auto w-min-[80vw] @container mb-4" >
              {implementation?.dependencies.map((dep) => (
                <DependencyWidget dependency={dep} key={dep.id} />
              ))}
            </ResponsiveContainerGrid>
          <DialogFooter className="flex-initial">
            <Button
              type="submit"
              className={cn("flex-initial", form.formState.isSubmitting && "bg-red-200")}
            >
              {" "}
              Submit{" "}
            </Button>
          </DialogFooter>
          </div>
        </form>
      </Form>
  );
};
