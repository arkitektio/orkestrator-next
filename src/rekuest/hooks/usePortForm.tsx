import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Port } from "../widgets/types";
import {
  buildZodSchema,
  portToDefaults,
  submittedDataToRekuestFormat,
} from "../widgets/utils";

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
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
}) => {
  const hash = portHash(props.ports);

  const defaultValues = useCallback(async () => {
    return portToDefaults(props.ports, props.overwrites || {});
  }, [hash, props.overwrites]);

  const myResolver = useCallback(() => {
    return zodResolver(buildZodSchema(props.ports));
  }, [hash]);

  const { handleSubmit, ...form } = useForm({
    defaultValues: defaultValues,
    reValidateMode: props.reValidateMode || "onBlur",
    resolver: myResolver(),
  });

  const overWrittenHandleSubmit = useCallback(
    (onSubmit: any) => {
      return handleSubmit((data) => {
        onSubmit(submittedDataToRekuestFormat(data, props.ports));
      });
    },
    [handleSubmit, hash],
  );

  useEffect(() => {
    if (props.doNotAutoReset) return;
    form.reset(portToDefaults(props.ports, props.overwrites || {}));
  }, [hash]);

  return { ...form, handleSubmit: overWrittenHandleSubmit };
};
