import { zodResolver } from "@hookform/resolvers/zod";
import Zod from "zod";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArgPort } from "../widgets/types";
import {
  buildZodSchema,
  portToDefaults,
  submittedDataToRekuestFormat,
} from "../widgets/utils";

export const portHash = (port: ArgPort[]) => {
  return port
    .map((port) => `${port.key}-${port.kind}-${port.identifier}`)
    .join("-");
};

export const usePortForm = (props: {
  ports: ArgPort[];
  overwrites?: Record<string, unknown>;
  doNotAutoReset?: boolean;
  additionalSchema?: Zod.ZodObject<Zod.ZodRawShape>;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
}) => {
  const defaultValuesKey = useMemo(
    () => `${portHash(props.ports)}:${JSON.stringify(props.overwrites || {})}`,
    [props.overwrites, props.ports],
  );

  const defaultValues = useMemo(
    () => portToDefaults(props.ports, props.overwrites || {}),
    [props.overwrites, props.ports],
  );

  const lastResetKeyRef = useRef<string | null>(null);

  const resolver = useMemo(() => {
    const zodSchema = buildZodSchema(props.ports);
    if (props.additionalSchema) {
      return zodResolver(zodSchema.merge(props.additionalSchema));
    }
    return zodResolver(zodSchema);
  }, [props.additionalSchema, props.ports]);

  const { handleSubmit, ...form } = useForm({
    defaultValues,
    reValidateMode: props.reValidateMode || "onChange",
    resolver,
  });

  const overWrittenHandleSubmit = useCallback(
    (onSubmit: (data: Record<string, unknown>) => void) => {
      return handleSubmit(
        (data) => {
          const additionalData = Object.keys(data).reduce((acc, key) => {
            if (props.additionalSchema?.shape[key]) {
              acc[key] = data[key];
            }
            return acc;
          }, {} as Record<string, unknown>);

          onSubmit({
            ...submittedDataToRekuestFormat(data, props.ports),
            ...additionalData,
          });
        },
        (errors) => {
          console.log("Validation errors:", errors);
          toast.error(JSON.stringify(errors));
        },
      );
    },
    [handleSubmit, props.additionalSchema, props.ports],
  );

  useEffect(() => {
    if (props.doNotAutoReset) return;
    if (lastResetKeyRef.current === defaultValuesKey) return;

    lastResetKeyRef.current = defaultValuesKey;
    form.reset(defaultValues);
  }, [defaultValues, defaultValuesKey, form, props.doNotAutoReset]);

  return { ...form, handleSubmit: overWrittenHandleSubmit, };
};
