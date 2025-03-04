import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { NodeDescription } from "@/lib/rekuest/NodeDescription";
import { RekuestPanel } from "@/linkers";
import { toast } from "sonner";
import { useGetPanelQuery, useGetStateQuery } from "../api/graphql";
import { StateDisplay } from "../components/State";
import { usePortForm } from "../hooks/usePortForm";
import { useTemplateAction } from "../hooks/useTemplateAction";
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

const Fake = (props: { template: string }) => {
  const { assign, latestAssignation, cancel, template } = useTemplateAction({
    id: props.template,
  });

  const form = usePortForm({
    ports: template?.node.args || [],
  });

  const onSubmit = (data: any) => {
    console.log("Submitting");
    console.log(data);
    assign({
      template: props.template,
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
          {template?.node?.description && (
            <NodeDescription
              description={template.node.description}
              variables={form.watch()}
            />
          )}
          <ArgsContainer
            registry={registry}
            groups={template?.node?.portGroups || []}
            ports={template?.node.args || []}
            path={[]}
            bound={props.template}
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

export default asDetailQueryRoute(useGetPanelQuery, ({ data, refetch }) => {
  return (
    <RekuestPanel.ModelPage
      title={data.panel.name || "New Dasboard"}
      object={data.panel.id}
    >
      <div className="relative w-full h-full">
        {data.panel.state ? (
          <StateWidget
            state={data.panel.state.id}
            accessors={data.panel.accessors}
          />
        ) : (
          <> State kind but now state? </>
        )}
        {data.panel.reservation?.template ? (
          <Fake template={data.panel.reservation?.template.id} />
        ) : (
          <> State kind but now state? </>
        )}
      </div>
    </RekuestPanel.ModelPage>
  );
});
