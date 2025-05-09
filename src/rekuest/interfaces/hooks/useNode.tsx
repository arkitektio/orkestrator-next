import {
  useGetStateForQuery,
  useActionImplementationAtQuery,
  useImplementationQuery,
} from "@/rekuest/api/graphql";
import { InterfaceDefinition } from "../types";
import { useImplementationAction } from "@/rekuest/hooks/useImplementationAction";

export const useInterfaceImplementation = (
  descriptor: InterfaceDefinition<any, any>,
  key: string,
  agent: string,
) => {
  const implementation = useActionImplementationAtQuery({
    variables: {
      actionHash: descriptor.actionRequirements[key],
      agent,
    },
  });

  return implementation;
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
