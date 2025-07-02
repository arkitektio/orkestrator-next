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
  MaterializedBlokFragment,
  useGetStateQuery,
  useImplementationQuery,
} from "@/rekuest/api/graphql";
import React, { useEffect } from "react";
import zod from "zod";
import { useAction } from "./use-action";
import { useAssign } from "@/rekuest/hooks/useAssign";
import { toast } from "sonner";
import { t } from "node_modules/@udecode/plate-list/dist/BaseListPlugin-B0eGlA5x";
import Implementation from "@/rekuest/pages/Implementation";
import { useFilteredAssignations } from "@/rekuest/hooks/useAssignations";

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
  demand: SchemaDemandInput;
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
  const matches = Object.entries(ports).map(([key, value]) => {
    return {
      key: key,
      kind: value.kind,
      identifier: value.identifier,
    };
  });

  return {
    hash: options?.forceHash,
    matches: matches,
  };
};

export const buildActionManifest = <
  T extends Record<string, StatePort>,
  R extends Record<string, StatePort>,
>(
  args?: T,
  returns?: R,
  options?: ActionOptions,
): Omit<ActionDemandInput, "key"> => {
  const argMatches = Object.entries(args || {}).map(([key, value]) => {
    return {
      key: key,
      kind: value.kind,
    };
  });

  const returnMatches = Object.entries(returns || {}).map(([key, value]) => {
    return {
      key: key,
      kind: value.kind,
    };
  });

  return {
    hash: options?.forceHash,
    name: options?.name,
    argMatches: argMatches,
    returnMatches: returnMatches,
  };
};

export type BuildStateOptions<T extends Record<string, StatePort>> = {
  keys: T;
} & StateOptions;

export const buildState = <T extends Record<string, StatePort>>(
  options: BuildStateOptions<T>,
): StateDefinition<zod.ZodObject<{ [K in keyof T]: T[K]["zodType"] }>> => {
  const shape = Object.entries(options.keys).reduce(
    (acc, [key, value]) => {
      acc[key] = value.zodType;
      return acc;
    },
    {} as { [key: string]: zod.ZodTypeAny },
  );

  return {
    ports: zod.object(shape) as any,
    demand: statePortsToDemand(options.keys, options),
  };
};

export type BuildActionOptions<
  T extends Record<string, StatePort>,
  R extends Record<string, StatePort>,
> = {
  args?: T;
  returns?: R;
} & ActionOptions;

export const buildAction = <
  T extends Record<string, StatePort>,
  R extends Record<string, StatePort>,
>(
  options: BuildActionOptions<T, R>,
): ActionDefinition<
  zod.ZodObject<{ [K in keyof T]: T[K]["zodType"] }>,
  zod.ZodObject<{ [K in keyof R]: R[K]["zodType"] }>
> => {
  const argsShape = Object.entries(options.args || {}).reduce(
    (acc, [key, value]) => {
      acc[key] = value.zodType;
      return acc;
    },
    {} as { [key: string]: zod.ZodTypeAny },
  );

  const returnsShape = Object.entries(options.returns || {}).reduce(
    (acc, [key, value]) => {
      acc[key] = value.zodType;
      return acc;
    },
    {} as { [key: string]: zod.ZodTypeAny },
  );

  return {
    args: zod.object(argsShape) as any,
    returns: zod.object(returnsShape) as any,
    demand: buildActionManifest(options.args, options.returns, options),
  };
};

export type ActionManifest = {
  demand: ActionDemandInput;
};

export type ActionOptions = {
  forceHash?: string;
  name?: string;
  interface?: string;
};

export type StateOptions = {
  forceHash?: string;
};

export type ActionDefinition<
  T extends zod.ZodObject<any, any>,
  R extends zod.ZodObject<any, any>,
> = {
  args: T;
  returns: R;
  demand: Omit<ActionDemandInput, "key">;
};

export type MetaApplication<
  States extends { [key: string]: StateDefinition<any> },
  Actions extends { [key: string]: ActionDefinition<any, any> },
> = {
  name: string;
  description?: string;
  states: States;
  actions: Actions;
};

export type UseActionOptions = {
  track: boolean;
  debounce?: number;
};

export type MetaApplicationAdds<T extends MetaApplication<any, any>> = {
  app: T;
  useState: <K extends keyof T["states"]>(
    state: K,
  ) => {
    value?: zod.infer<T["states"][K]["ports"]>;
    updatedAt?: string;
    errors: any;
  };
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

export type MaterializedBlokContext = {
  mblok: MaterializedBlokFragment;
};

export const MaterializedBlokContext =
  React.createContext<MaterializedBlokContext>({
    mblok: null as any,
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

export const useMaterializedBlokContext = () =>
  React.useContext(MaterializedBlokContext);

const buildUseRekuestState = <T extends MetaApplication<any, any>>(
  app: T,
): MetaApplicationAdds<T>["useState"] => {
  const hook = (state: keyof T["states"]) => {
    const { mblok } = useMaterializedBlokContext();

    let stateID = mblok.stateMappings.find((s) => s.key === state)?.state.id;

    if (!stateID) {
      console.error(
        `State ${String(state)} not found in materialized blok ${mblok.id}`,
      );
      return {
        value: undefined,
        updatedAt: undefined,
        errors: new Error(`State ${String(state)} not found`),
      };
    }

    const { data, subscribeToMore, refetch, error } = useGetStateQuery({
      variables: {
        id: stateID,
      },
    });

    useEffect(() => {
      console.log("Refetching");
      refetch({ id: stateID });
    }, [stateID]);

    useEffect(() => {
      if (data?.state) {
        console.log("State", state, "subscribing to", data.state.id);
        return subscribeToMore<
          WatchStateEventsSubscription,
          WatchStateEventsSubscriptionVariables
        >({
          document: WatchStateEventsDocument,
          variables: {
            stateID: data.state.id,
          },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            console.log("State update for", state, subscriptionData.data);
            // TODO: This is so weird and hacky because why is it subscribing to the other state as well?
            if (subscriptionData.data.stateUpdateEvents.id !== data.state.id) {
              return prev;
            }
            return {
              stateFor: {
                ...prev.state,
                ...subscriptionData.data.stateUpdateEvents,
              },
            };
          },
        });
      }

      return () => { };
    }, [subscribeToMore, data?.state?.id]);

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

    return data?.state;
  };

  return hook as any;
};

const buildUseRekuestActions = <T extends MetaApplication<any, any>>(
  app: T,
): MetaApplicationAdds<T>["useAction"] => {
  const hook = (action: keyof T["actions"], options?: UseActionOptions) => {
    const { mblok } = useMaterializedBlokContext();

    let actionId = mblok.actionMappings.find((s) => s.key === action)
      ?.implementation.id;


    const { assign } = useAssign();

    const assingation = useFilteredAssignations({
      implementation: actionId,
    })


    const nodeAssign = async (args: any) => {
      if (options?.debounce) {
        return debounce(
          () =>
            assign({
              implementation: actionId,
              args: args,
              ephemeral: options?.track ? false : true,
            }),
          options.debounce,
        );
      } else {
        return assign({
          implementation: actionId,
          args: args,
          ephemeral: options?.track ? false : true,
        });
      }
    };

    return {
      assign: nodeAssign,
      latestEvent: assingation?.at(-1)?.events?.at(0),
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
  };
};

export const module = buildModule;
export const action = buildAction;
export const state = buildState;
export const integer = build.integer;
export const string = build.string;
export const structure = build.structure;
export const model = build.model;
export const list = build.array;
export const float = build.float;
