import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Zod from "zod";
import { DetailImplementationFragment, ListDependencyFragment, ResolvedDependencyInput } from "../api/graphql";
import { Port } from "../widgets/types";
import {
  buildZodSchema,
  portToDefaults,
  submittedDataToRekuestFormat,
} from "../widgets/utils";

const extractErrorMessages = (obj: Record<string, any>, prefix = ""): string[] => {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof v?.message === "string") out.push(`${path}: ${v.message}`);
    else if (v && typeof v === "object") out.push(...extractErrorMessages(v, path));
  }
  return out;
};

export const portHash = (port: Port[]) => {
  return port
    .map((port) => `${port.key}-${port.kind}-${port.identifier}`)
    .join("-");
};

const buildDependenciesSchema = (
  dependencies: ListDependencyFragment[],
) => {
  const resolvedDepSchema = Zod.object({
    autoResolve: Zod.boolean().optional(),
    key: Zod.string(),
    mappedAgents: Zod.array(
      Zod.object({
        agent: Zod.string(),
        key: Zod.string(),
      }),
    ),
  });

  // No dependencies defined — allow anything
  if (dependencies.length === 0) {
    return Zod.array(resolvedDepSchema).default([]);
  }

  return Zod.array(resolvedDepSchema)
    .default([])
    .superRefine((resolved, ctx) => {
      const resolvedArr = resolved ?? [];

      for (const dep of dependencies) {
        const entry = resolvedArr.find((r) => r.key === dep.key);
        const agentCount = entry?.mappedAgents?.length ?? 0;
        const isAutoResolving = entry?.autoResolve === true;

        // If auto-resolvable and user opted into auto-resolve, skip agent count checks
        if (dep.autoResolvable && isAutoResolving) continue;
        // If auto-resolvable and no entry at all, also skip (backend can handle)
        if (dep.autoResolvable && !entry) continue;

        // Must be set (either agents or autoResolve)
        if (agentCount === 0 && !isAutoResolving) {
          ctx.addIssue({
            code: Zod.ZodIssueCode.custom,
            message: `Requires at least one agent${dep.autoResolvable ? ", or enable auto-resolve" : ""}.`,
            path: [dep.key],
          });
          continue;
        }

        // Check singular — only one agent allowed
        if (dep.singular && agentCount > 1) {
          ctx.addIssue({
            code: Zod.ZodIssueCode.custom,
            message: `Singular dependency — only one agent allowed, but ${agentCount} were provided.`,
            path: [dep.key],
          });
        }

        // Check minViableInstances
        if (dep.minViableInstances != null && agentCount < dep.minViableInstances) {
          ctx.addIssue({
            code: Zod.ZodIssueCode.custom,
            message: `Requires at least ${dep.minViableInstances} agent(s), but only ${agentCount} provided.`,
            path: [dep.key],
          });
        }

        // Check maxViableInstances
        if (dep.maxViableInstances != null && agentCount > dep.maxViableInstances) {
          ctx.addIssue({
            code: Zod.ZodIssueCode.custom,
            message: `Allows at most ${dep.maxViableInstances} agent(s), but ${agentCount} provided.`,
            path: [dep.key],
          });
        }
      }
    });
};

export const useImplementationForm = (props: {
  implementation?: DetailImplementationFragment;
  overwrites?: { [key: string]: unknown };
  presetDependencies?: ResolvedDependencyInput[] ;
  doNotAutoReset?: boolean;
  additionalSchema?: Zod.ZodObject<Zod.ZodRawShape>;
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
      dependencies: props.presetDependencies || [],
    };
  }, [hash, props.overwrites, props.presetDependencies]);

  const myResolver = useCallback(() => {
    const argsSchema = buildZodSchema(props.implementation?.action.args || []);
    const depsSchema = buildDependenciesSchema(props.implementation?.dependencies || []);

    const zodSchema = Zod.object({
      args: argsSchema,
      dependencies: depsSchema,
    });
    return zodResolver(zodSchema);
  }, [hash, props.additionalSchema, props.implementation?.dependencies]);

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
          const msgs = extractErrorMessages(errors as Record<string, any>);
          if (msgs.length === 0) toast.error("Please check the form for errors.");
          else if (msgs.length === 1) toast.error(msgs[0]);
          else toast.error(`${msgs.length} validation errors — ${msgs.slice(0, 3).join("; ")}${msgs.length > 3 ? "…" : ""}`);
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
      dependencies: props.presetDependencies || [],
    });
  }, [hash]);

  return { ...form, handleSubmit: overWrittenHandleSubmit };
};
