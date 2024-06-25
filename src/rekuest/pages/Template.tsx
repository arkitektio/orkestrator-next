import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { Button } from "@/components/ui/button";
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import {
  DetailNodeFragment,
  WatchTemplateDocument,
  WatchTemplateSubscription,
  WatchTemplateSubscriptionVariables,
  useTemplateQuery,
} from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { ClipboardIcon } from "@radix-ui/react-icons";
import DependencyCard from "../components/cards/DependencyCard";
import { DependencyGraphFlow } from "../components/dependencyGraph/DependencyGraph";
import { useEffect } from "react";
import { usePortForm } from "../hooks/usePortForm";
import { ActionAssignVariables } from "../hooks/useNode";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { DialogFooter } from "@/components/ui/dialog";
import { useWidgetRegistry } from "../widgets/WidgetsContext";
import { useTemplateAction } from "../hooks/useTemplateAction";

export const DoForm = (props: { id: string }) => {
  const { assign, latestAssignation, cancel, template } = useTemplateAction({
    id: props.id,
  });

  const form = usePortForm({
    ports: template?.node.args || [],
  });

  const onSubmit = (data: any) => {
    console.log("Submitting");
    console.log(data);
    assign({
      template: props.id,
      args: data,
      hooks: [],
    });
  };

  const { registry } = useWidgetRegistry();

  return (
    <>
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
