import { zodResolver } from "@hookform/resolvers/zod";
import Zod from "zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Port } from "../widgets/types";
import {
  buildZodSchema,
  portToDefaults,
  submittedDataToRekuestFormat,
} from "../widgets/utils";
import { DetailImplementationFragment } from "../api/graphql";

export const portHash = (port: Port[]) => {
  return port
    .map((port) => `${port.key}-${port.kind}-${port.identifier}`)
    .join("-");
};

export const useImplementationForm = (props: {
  implementation?: DetailImplementationFragment;
  overwrites?: { [key: string]: unknown };
  presetDependencies?: { [key: string]: string };
  doNotAutoReset?: boolean;
  additionalSchema?: Zod.ZodObject<unknown>;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
}) => {
  const hash = portHash(props.implementation?.action.args || []);

  const defaultValues = useCallback(async () => {
    return {
      args: portToDefaults(
        props.implementation?.action.args || [],
        props.overwrites || {},
      ),
      dependencies: props.presetDependencies || {},
    };
  }, [hash, props.overwrites, props.presetDependencies]);

  const myResolver = useCallback(() => {
    const argsSchema = buildZodSchema(props.implementation?.action.args || []);

    const zodSchema = Zod.object({
      args: argsSchema,
      dependencies: Zod.record(Zod.string()).optional(),
    });
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
          onSubmit({
            args: submittedDataToRekuestFormat(
              data.args || {},
              props.implementation?.action.args || [],
            ),
            dependencies: data.dependencies,
          });
        },
        (errors) => {
          toast.error(JSON.stringify(errors));
        },
      );
    },
    [handleSubmit, hash],
  );

  useEffect(() => {
    if (props.doNotAutoReset) return;
    form.reset({
      args: portToDefaults(
        props.implementation?.action.args || [],
        props.overwrites || {},
      ),
      dependencies: props.presetDependencies || {},
    });
  }, [hash]);

  return { ...form, handleSubmit: overWrittenHandleSubmit };
};
