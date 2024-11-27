import { useGetStateForQuery } from "@/rekuest/api/graphql";
import React from "react";
import zod from "zod";

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
  options?: StateOptions;
};

export const buildState = <T extends zod.objectInputType<any, any>>(
  args: T,
  options?: StateOptions,
): StateDefinition<T> => {
  return { ports: args, options };
};

export const buildAction = <
  T extends zod.ZodObject<any, any>,
  R extends zod.ZodObject<any, any>,
>(
  args: T = {} as T,
  returns: R = zod.object({}) as R,
  options?: ActionOptions,
): ActionDefinition<T, R> => {
  return { args, returns, options };
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
  options?: ActionOptions;
};

export type MetaApplication<
  States extends { [key: string]: StateDefinition<any> },
  Actions extends { [key: string]: ActionDefinition<any, any> },
> = {
  states: States;
  actions: Actions;
};

export type MetaApplicationAdds<T extends MetaApplication<any, any>> = T & {
  useState: <K extends keyof T["states"]>(
    state: K,
  ) => { value?: zod.infer<T["states"][K]["ports"]>; updatedAt?: string };
  useAction: <K extends keyof T["actions"]>(
    action: K,
  ) => [
    (
      args: zod.infer<T["actions"][K]["args"]>,
    ) => Promise<zod.infer<T["actions"][K]["returns"]>>,
    { loading: boolean; error: any },
  ];
};

export type AgentContext = {
  agent: string;
};

export const UsedAgentContext = React.createContext<AgentContext>({
  agent: "",
});

const useAgentContext = () => React.useContext(UsedAgentContext);

const buildUseRekuestState = <T extends MetaApplication<any, any>>(
  app: T,
): MetaApplicationAdds<T>["useState"] => {
  const hook = (state: keyof T["states"]) => {
    const { agent } = useAgentContext();

    const { data } = useGetStateForQuery({
      variables: {
        agent,
        stateHash: app.states[state].options?.forceHash,
      },
    });

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
  const hook = (action: keyof T["actions"]) => {
    const { agent } = useAgentContext();

    const doStuff = (args: any) => {
      return new Promise((resolve) => {
        console.log(
          "doStuff",
          app.actions[action].options?.forceHash,
          args,
          agent,
        );
        resolve(args);
      });
    };

    return [doStuff, { loading: false, error: null }];
  };

  return hook as any;
};

export const buildModule = <T extends MetaApplication<any, any>>(
  app: T,
): MetaApplicationAdds<T> => {
  return {
    app,
    useState: buildUseRekuestState(app),
    useAction: buildUseRekuestActions(app),
  } as unknown as MetaApplicationAdds<T>;
};
