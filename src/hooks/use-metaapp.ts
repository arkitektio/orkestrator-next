import {
  AssignationEventKind,
  PortInput,
  PortKind,
  PortScope,
  PostmanAssignationFragment,
  useGetStateForQuery,
  WatchStateEventsDocument,
  WatchStateEventsSubscription,
  WatchStateEventsSubscriptionVariables,
} from "@/rekuest/api/graphql";
import React, { useEffect } from "react";
import zod from "zod";
import { useAction } from "./use-action";
import { T } from "node_modules/@udecode/plate-emoji/dist/IndexSearch-Dvqq913n";

export const ports = zod.object;

export const port = {
  boolean: zod.boolean(),
  string: zod.string(),
  integer: zod.number(),
  number: zod.number(),
  structure: zod.string(),
  any: zod.any(),
};

type ManifestedState = {
  hash: string;
};

export type StateDefinition<T extends { [key: string]: any }> = {
  ports: T;
  manifest?: ManifestedState;
};

// Function to extract schema definition as JSON
function schemaToJson(schema: zod.ZodTypeAny): any {
  if (schema instanceof zod.ZodObject) {
    const shape = schema.shape;
    return Object.fromEntries(
      Object.entries(shape).map(([key, value]) => [
        key,
        schemaToJson(value as zod.ZodTypeAny),
      ]),
    );
  }
  if (schema instanceof zod.ZodString)
    return { type: "string", enum: schema._def.typeName };
  if (schema instanceof zod.ZodNumber)
    return { type: "number", enum: schema._def.typeName };
  if (schema instanceof zod.ZodBoolean) return { type: "boolean" };
  if (schema instanceof zod.ZodArray) {
    return {
      type: "array",
      items: schemaToJson(schema._def.type),
    };
  }
  if (schema instanceof zod.ZodUnion) {
    return {
      type: "union",
      options: schema._def.options.map((option) => schemaToJson(option)),
    };
  }
  // Handle more Zod types as needed
  return { type: "unknown" };
}

export const build = {
  integer: (description?: string): StatePort => ({
    kind: PortKind.Int,
    description: description,
    zodType: zod.number(),
    scope: PortScope.Global,
  }),
  int: (description?: string): StatePort => ({
    kind: PortKind.Int,
    description: description,
    zodType: zod.number(),
    scope: PortScope.Global,
  }),
  float: (description?: string): StatePort => ({
    kind: PortKind.Float,
    description: description,
    zodType: zod.number(),
    scope: PortScope.Global,
  }),
  string: (description?: string): StatePort => ({
    kind: PortKind.String,
    description: description,
    zodType: zod.string(),
    scope: PortScope.Global,
  }),
  structure(identifier: string, description?: string): StatePort {
    return {
      kind: PortKind.Structure,
      identifier: identifier,
      description: description,
      zodType: zod.string(),
      scope: PortScope.Global,
    };
  },
  model: <T extends Record<string, StatePort>>(ports: T) => {
    const shape = Object.entries(ports).reduce(
      (acc, [key, value]) => {
        acc[key] = value.zodType;
        return acc;
      },
      {} as { [key: string]: zod.ZodTypeAny },
    );

    return {
      kind: PortKind.Model,
      zodType: zod.object(shape) as zod.ZodObject<{
        [K in keyof T]: T[K]["zodType"];
      }>,
      scope: PortScope.Global,
    };
  },
  array: <T extends StatePort>(port: T): StatePort => {
    return {
      kind: PortKind.List,
      zodType: zod.array(port.zodType) as zod.ZodArray<T["zodType"]>,
      scope: PortScope.Global,
    };
  },
};

export type StatePort = { zodType: zod.ZodTypeAny } & Omit<PortInput, "key">;

export const hashifyState = <T extends Record<string, StatePort>>(
  ports: T,
  options?: StateOptions,
): string => {
  if (options?.forceHash) {
    return options.forceHash;
  }
  const shape = Object.entries(ports).reduce(
    (acc, [key, value]) => {
      acc[key] = schemaToJson(value.zodType);
      return acc;
    },
    {} as { [key: string]: any },
  );

  return JSON.stringify(shape);
};

export const hashifyAction = <T extends Record<string, StatePort>>(
  ports: T,
  options?: ActionOptions,
): string => {
  if (options?.forceHash) {
    return options.forceHash;
  }
  const shape = Object.entries(ports).reduce(
    (acc, [key, value]) => {
      acc[key] = schemaToJson(value.zodType);
      return acc;
    },
    {} as { [key: string]: any },
  );

  return JSON.stringify(shape);
};

export const buildState = <T extends Record<string, StatePort>>(
  ports: T,
  options?: StateOptions,
): StateDefinition<zod.ZodObject<{ [K in keyof T]: T[K]["zodType"] }>> => {
  const shape = Object.entries(ports).reduce(
    (acc, [key, value]) => {
      acc[key] = value.zodType;
      return acc;
    },
    {} as { [key: string]: zod.ZodTypeAny },
  );

  return {
    ports: zod.object(shape) as any,
    manifest: { hash: hashifyState(ports, options) },
  };
};

export const buildAction = <
  T extends Record<string, StatePort>,
  R extends Record<string, StatePort>,
>(
  args: T = {} as T,
  returns: R = {} as R,
  options?: ActionOptions,
): ActionDefinition<
  zod.ZodObject<{ [K in keyof T]: T[K]["zodType"] }>,
  zod.ZodObject<{ [K in keyof R]: R[K]["zodType"] }>
> => {
  const argsShape = Object.entries(args).reduce(
    (acc, [key, value]) => {
      acc[key] = value.zodType;
      return acc;
    },
    {} as { [key: string]: zod.ZodTypeAny },
  );

  const returnsShape = Object.entries(returns).reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {} as { [key: string]: zod.ZodTypeAny },
  );

  return {
    args: zod.object(argsShape) as any,
    returns: zod.object(returnsShape) as any,
    manifest: { hash: hashifyAction(args, options) },
  };
};

export type ActionManifest = {
  hash: string;
};

export type ActionOptions = {
  forceHash: string;
};

export type StateOptions = {
  forceHash: string;
};

export type ActionDefinition<
  T extends zod.ZodObject<any, any>,
  R extends zod.ZodObject<any, any>,
> = {
  args: T;
  returns: R;
  manifest?: ActionManifest;
};

export type MetaApplication<
  States extends { [key: string]: StateDefinition<any> },
  Actions extends { [key: string]: ActionDefinition<any, any> },
> = {
  states: States;
  actions: Actions;
};

export type UseActionOptions = {
  ephemeral: boolean;
  debounce?: number;
};

export type MetaApplicationAdds<T extends MetaApplication<any, any>> = T & {
  useState: <K extends keyof T["states"]>(
    state: K,
  ) => { value?: zod.infer<T["states"][K]["ports"]>; updatedAt?: string };
  useAction: <K extends keyof T["actions"]>(
    action: K,
    options?: UseActionOptions,
  ) => {
    assign: (
      args: zod.infer<T["actions"][K]["args"]>,
    ) => Promise<PostmanAssignationFragment>;
    reassign: () => Promise<PostmanAssignationFragment>;
    cancel: () => void;
    returns?: zod.infer<T["actions"][K]["returns"]>;
    events?: PostmanAssignationFragment["events"];
    latestEvent?: PostmanAssignationFragment["events"][0];
    done: boolean;
  };
};

export type AgentContext = {
  agent: string;
};

export const UsedAgentContext = React.createContext<AgentContext>({
  agent: "",
});

const debounce = (callback: Function, delay: number) => {
  let timeout: NodeJS.Timeout | undefined;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback();
    }, delay);
  };
};

export const useAgentContext = () => React.useContext(UsedAgentContext);

const buildUseRekuestState = <T extends MetaApplication<any, any>>(
  app: T,
): MetaApplicationAdds<T>["useState"] => {
  const hook = (state: keyof T["states"]) => {
    const { agent } = useAgentContext();

    const { data, subscribeToMore, refetch } = useGetStateForQuery({
      variables: {
        agent,
        stateHash: app.states[state].manifest.hash,
      },
    });

    useEffect(() => {
      console.log("Refetching");
      refetch({
        agent,
        stateHash: app.states[state].manifest.hash,
      });
    }, [agent, app.states[state].manifest.hash]);

    useEffect(() => {
      if (data?.stateFor) {
        console.log("State", state, "subscribing to", data.stateFor.id);
        return subscribeToMore<
          WatchStateEventsSubscription,
          WatchStateEventsSubscriptionVariables
        >({
          document: WatchStateEventsDocument,
          variables: {
            stateID: data.stateFor.id,
          },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            console.log("State update for", state, subscriptionData.data);
            // TODO: This is so weird and hacky because why is it subscribing to the other state as well?
            if (
              subscriptionData.data.stateUpdateEvents.id !== data.stateFor.id
            ) {
              return prev;
            }
            return {
              stateFor: {
                ...prev.stateFor,
                ...subscriptionData.data.stateUpdateEvents,
              },
            };
          },
        });
      }

      return () => {};
    }, [subscribeToMore, data?.stateFor?.id]);

    if (!data) {
      return {
        value: undefined,
        updatedAt: undefined,
      };
    }

    return data?.stateFor;
  };

  return hook as any;
};

const buildUseRekuestActions = <T extends MetaApplication<any, any>>(
  app: T,
): MetaApplicationAdds<T>["useAction"] => {
  const hook = (action: keyof T["actions"], options?: UseActionOptions) => {
    const { agent } = useAgentContext();

    const { assign, reassign, cancel, latestAssignation } = useAction({
      nodeHash: app.actions[action].manifest?.hash,
      agent: agent,
    });

    const nodeAssign = async (args: any) => {
      if (options?.debounce) {
        debounce(
          () => assign({ args: args, ephemeral: options?.ephemeral }),
          options.debounce,
        );
      } else {
        return assign({ args: args, ephemeral: options?.ephemeral });
      }
    };

    return {
      assign: nodeAssign,
      reassign,
      cancel,
      returns: latestAssignation?.events
        .filter((a) => a.kind == AssignationEventKind.Yield)
        .at(0)?.returns,
      events: latestAssignation?.events,
      latestEvent: latestAssignation?.events.at(0),
      done:
        latestAssignation?.events.some(
          (a) => a.kind == AssignationEventKind.Done,
        ) || false,
    };
  };

  return hook as any;
};

export const buildModule = <T extends MetaApplication<any, any>>(
  app: T,
): MetaApplicationAdds<T> => {
  return {
    ...app,
    useState: buildUseRekuestState(app),
    useAction: buildUseRekuestActions(app),
  } as unknown as MetaApplicationAdds<T>;
};
