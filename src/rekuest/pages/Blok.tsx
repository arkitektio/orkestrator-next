import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { ActionDescription } from "@/lib/rekuest/ActionDescription";
import { RekuestBlok, RekuestPanel } from "@/linkers";
import { toast } from "sonner";
import {
  useGetBlokQuery,
  useGetPanelQuery,
  useGetStateQuery,
} from "../api/graphql";
import { StateDisplay } from "../components/State";
import { usePortForm } from "../hooks/usePortForm";
import { useImplementationAction } from "../hooks/useImplementationAction";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

const StateWidget = (props: {
  state: string;
  accessors?: string[] | null | undefined;
}) => {
  const { data } = useGetStateQuery({
    variables: {
      id: props.state,
    },
  });

  return (
    <>
      {data?.state && (
        <StateDisplay state={data?.state} select={props.accessors} />
      )}
    </>
  );
};

const Fake = (props: { implementation: string }) => {
  const { assign, latestAssignation, cancel, implementation } =
    useImplementationAction({
      id: props.implementation,
    });

  const form = usePortForm({
    ports: implementation?.action.args || [],
  });

  const onSubmit = (data: any) => {
    console.log("Submitting");
    console.log(data);
    assign({
      implementation: props.implementation,
      args: data,
      hooks: [],
    }).then(
      (result) => {
        console.log("Result", result);
      },
      (error) => {
        toast.error(error.message);
      },
    );
  };

  const { registry } = useWidgetRegistry();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {implementation?.action?.description && (
            <ActionDescription
              description={implementation.action.description}
              variables={form.watch()}
            />
          )}
          <ArgsContainer
            registry={registry}
            groups={implementation?.action?.portGroups || []}
            ports={implementation?.action.args || []}
            path={[]}
            bound={props.implementation}
          />
          <Button type="submit" className="btn">
            {" "}
            Submit{" "}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default asDetailQueryRoute(useGetBlokQuery, ({ data, refetch }) => {
  return (
    <RekuestBlok.ModelPage
      title={data.blok.name || "New Dasboard"}
      object={data.blok.id}
    >
      <div className="relative w-full h-full">Not implemented</div>
    </RekuestBlok.ModelPage>
  );
});
