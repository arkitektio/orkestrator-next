import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { toast } from "@/components/ui/use-toast";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { notEmpty } from "@/lib/utils";
import { RekuestAssignation } from "@/linkers";
import { TestConstants } from "@/reaktion/base/Constants";
import {
  PostmanReservationFragment,
  useAssignMutation,
  useDetailReservationQuery,
} from "@/rekuest/api/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClipboardIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { DependencyGraphFlow } from "../components/dependencyGraph/DependencyGraph";

export const portHash = (port: Port[]) => {
  return port
    .map((port) => `${port.key}-${port.kind}-${port.identifier}`)
    .join("-");
};

export const usePortForm = (props: {
  ports: Port[];
  overwrites?: { [key: string]: any };
  doNotAutoReset?: boolean;
}) => {
  const hash = portHash(props.ports);

  const schema = useMemo(() => yupSchemaBuilder(props.ports), [hash]);
  const resolver = useCallback(
    async (data: any, context: any, options: any) => {
      console.log(data);
      return await yupResolver(schema)(data, context, options);
    },
    [hash, schema],
  );

  const defaultValues = useCallback(async () => {
    return portToDefaults(props.ports, props.overwrites || {});
  }, [hash, props.overwrites]);

  const form = useForm({
    defaultValues: defaultValues,
    resolver: resolver,
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (props.doNotAutoReset) return;
    form.reset(portToDefaults(props.ports, props.overwrites || {}));
  }, [hash]);

  return form;
};

export const PortForm = (props: {
  description: string;
  reservation: PostmanReservationFragment;
  ports: Port[];
  groups: PortGroup[];
  overwrites?: { [key: string]: any };
}) => {
  const { assign } = usePostman();
  const { registry } = useWidgetRegistry();
  const [argDict, setArgDict] = useState<{ [key: string]: any }>({});

  const form = usePortForm({
    ports: props.ports,
    overwrites: props.overwrites,
  });

  function onSubmit(data: any) {
    console.log(data);
    setArgDict(data);
    assign({
      reservation: props.reservation.id,
      args: argDictToArgs(data, props.ports),
    }).then((res) => {
      toast({
        title: "Assigned",
        description: "The reservation has been assigned",
      });
    });
  }

  const description = useNodeDescription({
    description: props.description,
    variables: argDict,
  });

  return (
    <>
      {description}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, () => {
            toast({
              title: "Error",
              description: "Something went wrong",
            });
          })}
          className="space-y-6 mt-4"
        >
          <ArgsContainer
            registry={registry}
            ports={props.ports}
            groups={props.groups}
            path={[]}
          />
        </form>
        <Button type="submit">Assign</Button>
      </Form>
    </>
  );
};

export const Assigner = (props: { id: string }) => {
  const { data } = useDetailReservationQuery({
    variables: {
      id: props.id,
    },
  });

  return (
    <>
      {data?.reservation?.node?.args && (
        <PortForm
          description={data?.reservation?.node?.description}
          reservation={data?.reservation}
          ports={data?.reservation?.node?.args.filter(notEmpty) || []}
          groups={data?.reservation?.node?.portGroups?.filter(notEmpty) || []}
        />
      )}
    </>
  );
};

function Page() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>Missing id</div>;
  }

  return (
    <>
      <EasyGuard>
        <RekuestGuard>
          <Assigner id={id} />
        </RekuestGuard>
      </EasyGuard>
    </>
  );
}

export default asDetailQueryRoute(
  useDetailReservationQuery,
  ({ data, refetch }) => {
    const [assign, _] = useAssignMutation();

    const navigate = useNavigate();

    return (
      <ModelPageLayout
        identifier="@rekuest/reservation"
        title={data?.reservation?.title || data?.reservation.node?.name}
        object={data.reservation.id}
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
              {data?.reservation?.title || data?.reservation.node?.name}
            </DetailPaneTitle>
            <DetailPaneDescription>
              {data?.reservation?.node?.description}

              {JSON.stringify(data?.reservation?.binds)}
            </DetailPaneDescription>
          </DetailPaneHeader>
          {data?.reservation?.dependencyGraph && (
            <>
              <DependencyGraphFlow
                graph={data?.reservation?.dependencyGraph}
                refetch={refetch}
              />
            </>
          )}
        </DetailPane>
        <DetailPane className="mt-2">
          <DetailPaneHeader>Assign</DetailPaneHeader>
          <TestConstants
            ports={data?.reservation.node?.args || []}
            overwrites={{}}
            onSubmit={(e) => {
              console.log("submit", e);
              assign({
                variables: {
                  reservation: data.reservation.id,
                  args:
                    data?.reservation?.node?.args.map(
                      (arg) => e[arg.key] || null,
                    ) || [],
                },
              })
                .then((res) => {
                  toast({
                    title: "Assigned",
                    description: "The reservation has been assigned",
                  });
                  res.data?.assign.id &&
                    navigate(
                      RekuestAssignation.linkBuilder(res.data?.assign.id),
                    );
                })
                .catch((e) => {
                  toast({
                    title: "Error",
                    description: e.message,
                  });
                });
            }}
          />
        </DetailPane>
      </ModelPageLayout>
    );
  },
);
