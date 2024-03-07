import { Port, portToDefaults, } from "@jhnnsrs/rekuest-next";
import { useCallback, useEffect } from "react";
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
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onChange" | "onBlur" | "onSubmit" ;
}) => {
  const hash = portHash(props.ports);

  const defaultValues = useCallback(() => {
    return portToDefaults(props.ports, props.overwrites || {});
  }, [hash, props.overwrites]);

  const form = useForm({
    defaultValues: defaultValues,
    reValidateMode: props.reValidateMode || "onChange",
    mode: props.mode || "onBlur",
  });

  useEffect(() => {
    if (props.doNotAutoReset) return;
    form.reset(portToDefaults(props.ports, props.overwrites || {}));
  }, [hash]);

  return form;
};
