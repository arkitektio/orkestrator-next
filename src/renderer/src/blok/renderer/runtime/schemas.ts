import {z} from 'zod';
import type {
  BlokActionArgument,
  BlokAgentCall,
  BlokComponentNode,
  BlokComponentProp,
  BlokDynamicValue,
  BlokUtilCall,
} from './types';

const dynamicValueInputSchema: z.ZodType<BlokDynamicValue> = z.object({
  literal: z.string().nullish(),
  path: z.string().nullish(),
});

const actionArgumentInputSchema: z.ZodType<BlokActionArgument> = z.lazy(() =>
  z.object({
    key: z.string().nullish(),
    value_literal: z.unknown().optional(),
    value_path: z.string().nullish(),
    agent_call: agentCallInputSchema.nullish(),
    util_call: utilCallInputSchema.nullish(),
    value_list: z.array(actionArgumentInputSchema).nullish(),
    value_dict: z.array(actionArgumentInputSchema).nullish(),
  }),
);

const agentCallInputSchema: z.ZodType<BlokAgentCall> = z.object({
  dependency: z.string(),
  operation: z.string(),
  arguments: z.array(actionArgumentInputSchema).nullish(),
});

const utilCallInputSchema: z.ZodType<BlokUtilCall> = z.object({
  operation: z.string(),
  arguments: z.array(actionArgumentInputSchema).nullish(),
});

const componentPropInputSchema: z.ZodType<BlokComponentProp> = z.object({
  key: z.string(),
  static_value: z.unknown().optional(),
  dynamic_value: dynamicValueInputSchema.nullish(),
  agent_call: agentCallInputSchema.nullish(),
  util_call: utilCallInputSchema.nullish(),
});

const componentNodeInputSchema: z.ZodType<BlokComponentNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    component: z.string(),
    props: z.array(componentPropInputSchema).nullish(),
    children: z.array(componentNodeInputSchema).nullish(),
  }),
);

const actionValueSchema = z.custom<() => void>(value => typeof value === 'function', {
  message: 'Expected action handler',
});

export const BlokSchemas = {
  DynamicValue: dynamicValueInputSchema,
  ActionArgument: actionArgumentInputSchema,
  AgentCall: agentCallInputSchema,
  UtilCall: utilCallInputSchema,
  ComponentProp: componentPropInputSchema,
  ComponentProps: z.array(componentPropInputSchema).nullish(),
  ComponentNode: componentNodeInputSchema,
};

export const BlokPropSchemas = {
  ComponentId: z.string(),
  ChildList: z
    .array(
      z.union([
        z.string(),
        z.object({
          id: z.string(),
          basePath: z.string().optional(),
        }),
      ]),
    )
    .optional(),
  DynamicString: z.string(),
  DynamicBoolean: z.boolean(),
  Action: actionValueSchema,
  Checkable: z.object({
    checks: z.array(z.any()).optional(),
  }),
};
