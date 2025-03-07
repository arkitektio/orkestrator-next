import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Port } from "../widgets/types";
import {
  buildZodSchema,
  portToDefaults,
  submittedDataToRekuestFormat,
} from "../widgets/utils";
import { toast } from "sonner";

export const portHash = (port: Port[]) => {
  return port
    .map((port) => `${port.key}-${port.kind}-${port.identifier}`)
    .join("-");
};

export const usePortForm = (props: {
  ports: Port[];
  overwrites?: { [key: string]: any };
  doNotAutoReset?: boolean;
  additionalSchema?: Zod.ZodObject<any>;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
}) => {
  const hash = portHash(props.ports);

  const defaultValues = useCallback(async () => {
    return portToDefaults(props.ports, props.overwrites || {});
  }, [hash, props.overwrites]);

  const myResolver = useCallback(() => {
    const zodSchema = buildZodSchema(props.ports);
    if (props.additionalSchema) {
      return zodResolver(zodSchema.merge(props.additionalSchema));
    }
    return zodResolver(zodSchema);
  }, [hash, props.additionalSchema]);

  const { handleSubmit, ...form } = useForm({
    defaultValues: defaultValues,
    reValidateMode: props.reValidateMode || "onChange",
    resolver: myResolver(),
  });

  const overWrittenHandleSubmit = useCallback(
    (onSubmit: any) => {
      return handleSubmit(
        (data) => {
          const additionalData = Object.keys(data).reduce((acc, key) => {
            if (props.additionalSchema?.shape[key]) {
              acc[key] = data[key];
            }
            return acc;
          }, {});

          onSubmit({
            ...submittedDataToRekuestFormat(data, props.ports),
            ...additionalData,
          });
        },
        (e) => {
          toast.error(JSON.stringify(e));
        },
      );
    },
    [handleSubmit, hash],
  );

  useEffect(() => {
    if (props.doNotAutoReset) return;
    form.reset(portToDefaults(props.ports, props.overwrites || {}));
  }, [hash]);

  return { ...form, handleSubmit: overWrittenHandleSubmit };
};
