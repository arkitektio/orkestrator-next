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
import { RekuestAssignation } from "@/linkers";
import { useFlowQuery } from "@/reaktion/api/graphql";
import { ShowFlow } from "@/reaktion/show/ShowFlow";
import {
  WatchTemplateDocument,
  WatchTemplateSubscription,
  WatchTemplateSubscriptionVariables,
  useTemplateQuery,
} from "@/rekuest/api/graphql";
import { withFluss } from "@jhnnsrs/fluss-next";
import { NodeDescription } from "@jhnnsrs/rekuest";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DependencyCard from "../components/cards/DependencyCard";
import { usePortForm } from "../hooks/usePortForm";
import { useTemplateAction } from "../hooks/useTemplateAction";
import { useWidgetRegistry } from "../widgets/WidgetsContext";
import { toast } from "sonner";

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

export const TemplateFlow = (props: { id: string }) => {
  const { data } = withFluss(useFlowQuery)({
    variables: {
      id: props.id,
    },
  });

  return <>{data?.flow && <ShowFlow flow={data?.flow} />}</>;
};

export default asDetailQueryRoute(
  withRekuest(useTemplateQuery),
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
        <DetailPane>
          <DetailPaneHeader>
            <DetailPaneTitle
              actions={
                <Button variant={"outline"} title="Copy to clipboard">
                  <ClipboardIcon />
                </Button>
              }
            >
              {data?.template?.interface}
            </DetailPaneTitle>

            <div className="w-full h-[500px]">
              {data?.template?.extension === "reaktion" && (
                <TemplateFlow id={data.template.params["flow"]} />
              )}
            </div>
            <DetailPaneDescription>
              <DoForm id={data.template.id} />
            </DetailPaneDescription>
          </DetailPaneHeader>
          <ListRender array={data?.template?.dependencies}>
            {(template, key) => <DependencyCard item={template} key={key} />}
          </ListRender>
        </DetailPane>
      </ModelPageLayout>
    );
  },
);
