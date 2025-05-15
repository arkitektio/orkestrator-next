import {
  AssignationEventKind,
  PortInput,
  PortKind,
  PostmanAssignationFragment,
  useGetStateForQuery,
  SchemaDemandInput,
  WatchStateEventsDocument,
  WatchStateEventsSubscription,
  WatchStateEventsSubscriptionVariables,
  ActionDemandInput,
  useImplementationAtQuery,
} from "@/rekuest/api/graphql";
import React, { useEffect } from "react";
import zod from "zod";
import { useAction } from "./use-action";
import { useAssign } from "@/rekuest/hooks/useAssign";
import { toast } from "sonner";

export const ports = zod.object;

export const port = {
  boolean: zod.boolean(),
  string: zod.string(),
  integer: zod.number(),
  number: zod.number(),
  structure: zod.string(),
  any: zod.any(),
};


export type StateDefinition<T extends { [key: string]: any }> = {
  ports: T;
  demand: SchemaDemandInput
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
  }),
  int: (description?: string): StatePort => ({
    kind: PortKind.Int,
    description: description,
    zodType: zod.number(),
  }),
  float: (description?: string): StatePort => ({
    kind: PortKind.Float,
    description: description,
    zodType: zod.number(),
  }),
  string: (description?: string): StatePort => ({
    kind: PortKind.String,
    description: description,
    zodType: zod.string(),
  }),
  structure(identifier: string, description?: string): StatePort {
    return {
      kind: PortKind.Structure,
      identifier: identifier,
      description: description,
      zodType: zod.string(),
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
    };
  },
  array: <T extends StatePort>(port: T): StatePort => {
    return {
      kind: PortKind.List,
      zodType: zod.array(port.zodType) as zod.ZodArray<T["zodType"]>,
    };
  },
};

export type StatePort = { zodType: zod.ZodTypeAny } & Omit<PortInput, "key">;

export const statePortsToDemand = <T extends Record<string, StatePort>>(
  ports: T,
  options?: StateOptions,
): SchemaDemandInput => {


  const matches = Object.entries(ports).map(
    ([key, value]) => {
      return {
        key: key,
        kind: value.kind,
      };
    },
  )

  return {
    hash: options?.forceHash,
    matches: matches,
  };
};

export const buildActionManifest = <
  T extends Record<string, StatePort>,
  R extends Record<string, StatePort>,
>(
  args: T,
  returns: R,
  options?: ActionOptions,
): ActionDemandInput => {
  
  const argMatches = Object.entries(args).map(
    ([key, value]) => {
      return {
        key: key,
        kind: value.kind,
      };
    },
  )

  const returnMatches = Object.entries(returns).map(
    ([key, value]) => {
      return {
        key: key,
        kind: value.kind,
      };
    },
  )

  return {
    hash: options?.forceHash,
    argMatches: argMatches,
    returnMatches: returnMatches,
  };
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
    demand: statePortsToDemand(ports, options),
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
      acc[key] = value.zodType;
      return acc;
    },
    {} as { [key: string]: zod.ZodTypeAny },
  );

  return {
    args: zod.object(argsShape) as any,
    returns: zod.object(returnsShape) as any,
    demand: buildActionManifest(args, returns, options),
  };
};

export type ActionManifest = {
  demand: ActionDemandInput
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
  demand: ActionDemandInput
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

export type MetaApplicationAdds<T extends MetaApplication<any, any>> = {
  app: T;
  useState: <K extends keyof T["states"]>(
    state: K,
  ) => { value?: zod.infer<T["states"][K]["ports"]>; updatedAt?: string, errors: any };
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

    const { data, subscribeToMore, refetch, error } = useGetStateForQuery({
      variables: {
        agent,
        demand: app.states[state].demand,
      },
    });

    useEffect(() => {
      console.log("Refetching");
      refetch({
        agent,
        demand: app.states[state].demand,
      });
    }, [agent]);

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

    if (error) {
      console.error("Error", error);
      return {
        value: undefined,
        updatedAt: undefined,
        errors: error,
      };
    }

    if (!data) {
      return {
        value: undefined,
        updatedAt: undefined,
      };
    }

    



    return data?.stateFor
  };

  return hook as any;
};

const buildUseRekuestActions = <T extends MetaApplication<any, any>>(
  app: T,
): MetaApplicationAdds<T>["useAction"] => {
  const hook = (action: keyof T["actions"], options?: UseActionOptions) => {
    const { agent } = useAgentContext();

    const { data} = useImplementationAtQuery({
      variables: {
        agent,
        demand: app.actions[action].demand,
      },
    });

    const { assign} = useAssign()


    const nodeAssign = async (args: any) => {
      if (!data?.implementationAt) {
        toast.error(`No implementation found for ${String(action)} on ${agent}`);
        return;
      }
      if (options?.debounce) {
        return debounce(
          () => assign({ implementation: data?.implementationAt.id, args: args, ephemeral: options?.ephemeral }),
          options.debounce,
        );
      } else {
        return assign({implementation: data?.implementationAt.id, args: args, ephemeral: options?.ephemeral });
      }
    };

    return {
      assign: nodeAssign,
    };
  };

  return hook as any;
};

export const buildModule = <T extends MetaApplication<any, any>>(
  app: T,
): MetaApplicationAdds<T> => {
  return {
    app: app,
    useState: buildUseRekuestState(app),
    useAction: buildUseRekuestActions(app),
  } 
};


export const module = buildModule 
export const action = buildAction
export const state = buildState
export const integer = build.integer
export const string = build.string
export const structure = build.structure
export const model = build.model
export const list = build.array
export const float = build.float