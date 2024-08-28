import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { RekuestDashboard } from "@/linkers";
import {
  DockviewApi,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from "dockview";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  PanelFragment,
  PanelKind,
  useGetDashboardQuery,
  useGetStateQuery,
  WatchStateEventsDocument,
  WatchStateEventsSubscription,
  WatchStateEventsSubscriptionVariables,
} from "../api/graphql";
import { StateDisplay } from "../components/State";
import { usePortForm } from "../hooks/usePortForm";
import { useTemplateAction } from "../hooks/useTemplateAction";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

const StateWidget = (props: {
  state: string;
  accessors?: string[] | null | undefined;
}) => {
  const { data, subscribeToMore } = useGetStateQuery({
    variables: {
      id: props.state,
    },
  });

  useEffect(() => {
    console.log("Starting subscription");
    const unsubscribe = subscribeToMore<
      WatchStateEventsSubscription,
      WatchStateEventsSubscriptionVariables
    >({
      document: WatchStateEventsDocument,
      variables: { stateID: props.state },
      updateQuery: (prev, { subscriptionData }) => {
        console.log("Subscription data for state", subscriptionData);
        if (!subscriptionData.data.stateUpdateEvents.value) return prev;

        let newState = subscriptionData.data.stateUpdateEvents;
        return {
          ...prev,
          state: { ...prev.state, ...newState },
        };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [props.state]);

  return (
    <>
      {data?.state && (
        <StateDisplay state={data?.state} select={props.accessors} />
      )}
    </>
  );
};

const Fake = (props: { template: string; panel: PanelFragment }) => {
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

  const { handleSubmit, watch } = form;

  useEffect(() => {
    // TypeScript users
    if (props.panel.submitOnChange) {
      console.log("Watching for changes");
      const subscription = watch(() => handleSubmit(onSubmit)());

      return () => subscription.unsubscribe();
    }
  }, [handleSubmit, watch, props.panel]);

  const { registry } = useWidgetRegistry();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <p className="text-muted-foreground text-xs mb-2">
            {props.panel.name}
          </p>
          <ArgsContainer
            registry={registry}
            ports={template?.node.args || []}
            path={[]}
            bound={props.template}
          />
          {!props.panel.submitOnChange && (
            <Button type="submit" className="btn">
              {" "}
              Submit{" "}
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};

const components: { [key in PanelKind]: any } = {
  STATE: (
    props: IDockviewPanelProps<{ title: string; panel: PanelFragment }>,
  ) => {
    return (
      <>
        {props.params.panel.state ? (
          <StateWidget
            state={props.params.panel.state.id}
            accessors={props.params.panel.accessors}
          />
        ) : (
          <> State kind but now state? </>
        )}
      </>
    );
  },
  ASSIGN: (
    props: IDockviewPanelProps<{ title: string; panel: PanelFragment }>,
  ) => {
    return (
      <div style={{ padding: "20px", color: "white" }}>
        {props.params.panel.reservation?.template ? (
          <Fake
            template={props.params.panel.reservation?.template.id}
            panel={props.params.panel}
          />
        ) : (
          <> State kind but now state? </>
        )}
      </div>
    );
  },
};

export default asDetailQueryRoute(useGetDashboardQuery, ({ data, refetch }) => {
  const apiRef = useRef<DockviewApi>();

  const onReady = (event: DockviewReadyEvent) => {
    let one_before: string | undefined = undefined;
    data.dashboard.panels?.forEach((p) => {
      event.api.addPanel({
        id: p.id,
        component: p.kind,
        params: {
          title: "Panel 1",
          panel: p,
        },
        position: one_before
          ? { referencePanel: one_before, direction: "right" }
          : undefined,
      });

      one_before = p.id;
    });
  };

  const onSave = () => {
    let api = apiRef.current;
    if (api) {
      console.log(api.toJSON());
    }
  };

  return (
    <RekuestDashboard.ModelPage
      title={data.dashboard.name || "New Dasboard"}
      object={data.dashboard.id}
    >
      <div className="relative w-full h-full">
        <DockviewReact
          components={components}
          onReady={onReady}
          className={"dockview-theme-abyss"}
        />
        <Button
          variant="outline"
          className="absolute bottom-0 right-0"
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </RekuestDashboard.ModelPage>
  );
});
