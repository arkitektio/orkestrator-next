import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { notEmpty } from "@/lib/utils";
import {
  PostmanReservationFragment,
  ReservationStatus,
  useAssignNodeQuery,
  useConstantNodeQuery,
  useDetailReservationQuery,
} from "@/rekuest/api/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import { EasyGuard } from "@jhnnsrs/arkitekt";
import {
  Port,
  PortGroup,
  RekuestGuard,
  portToDefaults,
  useWidgetRegistry,
  yupSchemaBuilder,
  withRekuest,
  usePostman,
  NodeDescription,
  argDictToArgs,
} from "@jhnnsrs/rekuest";
import { set } from "date-fns";
import { useEffect, useCallback, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

export const portHash = (port: Port[]) => {
  return port
    .map((port) => `${port.key}-${port.kind}-${port.identifier}`)
    .join("-");
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

  const hash = portHash(props.ports);

  const schema = useMemo(() => yupSchemaBuilder(props.ports), [hash]);
  const resolver = useCallback(
    async (data: any, context: any, options: any) => {
      return await yupResolver(schema)(data, context, options);
    },
    [hash, schema]
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
    form.reset(portToDefaults(props.ports, props.overwrites || {}));
  }, [hash]);

  function onSubmit(data: any) {
    console.log(data);
    setArgDict(data);
  }

  return (
    <>
      <NodeDescription description={props.description} variables={argDict} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <ArgsContainer
            registry={registry}
            ports={props.ports}
            groups={props.groups}
          />
        </form>
        <Button type="submit" disabled={!form.formState.isValid}>
          Assign
        </Button>
      </Form>
    </>
  );
};

export const Assigner = (props: { id: string }) => {
  const { data } = withRekuest(useDetailReservationQuery)({
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

function Reservation() {
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

export default Reservation;
