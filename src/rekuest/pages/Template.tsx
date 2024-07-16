import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { NodeDescription } from "@/lib/rekuest/NodeDescription";
import { RekuestAssignation } from "@/linkers";
import { useFlowQuery } from "@/reaktion/api/graphql";
import { ShowFlow } from "@/reaktion/show/ShowFlow";
import {
  DetailTemplateFragment,
  WatchTemplateDocument,
  WatchTemplateSubscription,
  WatchTemplateSubscriptionVariables,
  useTemplateQuery,
} from "@/rekuest/api/graphql";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DependencyCard from "../components/cards/DependencyCard";
import { usePortForm } from "../hooks/usePortForm";
import { useTemplateAction } from "../hooks/useTemplateAction";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

export const DoForm = (props: { id: string }) => {
  const { assign, latestAssignation, cancel, template } = useTemplateAction({
    id: props.id,
  });

  const form = usePortForm({
    ports: template?.node.args || [],
  });

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log("Submitting");
    console.log(data);
    assign({
      template: props.id,
      args: data,
      hooks: [],
    }).then(
      (result) => {
        console.log("Result", result);
        navigate(RekuestAssignation.linkBuilder(result.id));
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

export const TemplateFlow = (props: { template: DetailTemplateFragment }) => {
  const { data } = useFlowQuery({
    variables: {
      id: props.template.params.flow,
    },
  });

  return (
    <>
      {data?.flow && <ShowFlow flow={data?.flow} template={props.template} />}
    </>
  );
};

export const DefaultRenderer = (props: {
  template: DetailTemplateFragment;
}) => {
  return (
    <DetailPane>
      <DetailPaneHeader>
        <DetailPaneTitle
          actions={
            <Button variant={"outline"} title="Copy to clipboard">
              <ClipboardIcon />
            </Button>
          }
        >
          {props?.template?.interface}
        </DetailPaneTitle>

        <DetailPaneDescription>
          <DoForm id={props.template.id} />
        </DetailPaneDescription>
      </DetailPaneHeader>
      <ListRender array={props?.template?.dependencies}>
        {(template, key) => <DependencyCard item={template} key={key} />}
      </ListRender>
    </DetailPane>
  );
};

export const FlowRender = (props: { template: DetailTemplateFragment }) => {
  return (
    <div className="w-full h-full">
      <TemplateFlow template={props.template} />
    </div>
  );
};

export default asDetailQueryRoute(
  useTemplateQuery,
  ({ data, refetch, subscribeToMore }) => {
    useEffect(() => {
      return subscribeToMore<
        WatchTemplateSubscription,
        WatchTemplateSubscriptionVariables
      >({
        document: WatchTemplateDocument,
        variables: {
          template: data.template.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          return { template: subscriptionData.data.templateChange };
        },
      });
    }, [subscribeToMore]);

    return (
      <ModelPageLayout
        identifier="@rekuest/template"
        title={data.template.interface}
        object={data.template.id}
      >
        {data.template?.params?.flow ? (
          <FlowRender template={data.template} />
        ) : (
          <DefaultRenderer template={data.template} />
        )}
      </ModelPageLayout>
    );
  },
);
