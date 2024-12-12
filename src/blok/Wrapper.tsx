import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MetaApplication, UsedAgentContext } from "@/hooks/use-metaapp";
import { useAgentQuery, useAgentsQuery } from "@/rekuest/api/graphql";
import React from "react";

export const ModuleWrapper = (props: {
  app: MetaApplication<any, any>;
  agent: string;
  children: React.ReactNode;
}) => {
  const { data } = useAgentQuery({
    variables: {
      id: props.agent,
    },
  });

  return (
    <div className="relative overflow-hidden h-full w-full group">
      <UsedAgentContext.Provider value={{ agent: props.agent }}>
        {props.children}
      </UsedAgentContext.Provider>

      <div className="absolute top-0 right-0 bg-black rounded-full text-xs rounded font-light group-hover:opacity-100 opacity-0 transition-all duration-300">
        {data?.agent.name}
      </div>
    </div>
  );
};
