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
  doNotAutoReset?: boolean;
  additionalSchema?: Zod.ZodObject<unknown>;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
}) => {
  const hash = portHash(props.implementation?.action.args || []);

  const defaultValues = useCallback(async () => {
    return portToDefaults(props.implementation?.action.args || [], props.overwrites || {});
  }, [hash, props.overwrites]);

  const myResolver = useCallback(() => {
    let argsSchema = buildZodSchema(props.implementation?.action.args || [])
    if (props.implementation?.action.args.length === 0) {
      argsSchema = argsSchema.optional();
    }

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
            args: submittedDataToRekuestFormat(data.args || {}, props.implementation?.action.args || []),
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
    form.reset(portToDefaults(props.implementation?.action.args || [], props.overwrites || {}));
  }, [hash]);

  return { ...form, handleSubmit: overWrittenHandleSubmit, };
};
