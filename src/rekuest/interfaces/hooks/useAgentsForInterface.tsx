import { useAgentsQuery } from "../../api/graphql";
import { registry } from "../instance";

export const useAgentsForDescriptor = (name: string) => {
  const value = registry.getDescriptor(name);

  return useAgentsQuery({
    variables: {
      filters: {
        hasStates: Object.values(value.stateRequirements),
        hasTemplates: Object.values(value.nodeRequirements),
      },
    },
  });
};
