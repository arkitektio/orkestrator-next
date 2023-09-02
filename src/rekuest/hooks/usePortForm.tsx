import { yupResolver } from "@hookform/resolvers/yup";
import { Port, portToDefaults, yupSchemaBuilder } from "@jhnnsrs/rekuest-next";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

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
