import {
  useGetStateForQuery,
  useNodeTemplateAtQuery,
  useTemplateQuery,
} from "@/rekuest/api/graphql";
import { InterfaceDefinition } from "../types";
import { useTemplateAction } from "@/rekuest/hooks/useTemplateAction";

export const useInterfaceTemplate = (
  descriptor: InterfaceDefinition<any, any>,
  key: string,
  agent: string,
) => {
  const template = useNodeTemplateAtQuery({
    variables: {
      nodeHash: descriptor.nodeRequirements[key],
      agent,
    },
  });

  return template;
};

export const useInterfaceState = (
  descriptor: InterfaceDefinition<any, any>,
  key: string,
  agent: string,
) => {
  const state = useGetStateForQuery({
    variables: {
      stateHash: descriptor.stateRequirements[key],
      agent,
    },
  });

  return state;
};
