import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MetaApplication, UsedAgentContext } from "@/hooks/use-metaapp";
import { useAgentsQuery } from "@/rekuest/api/graphql";
import React from "react";

export const ModuleWrapper = (props: {
  app: MetaApplication<any, any>;
  children: React.ReactNode;
}) => {
  console.log("APP", props.app);

  const stateHashes = Object.keys(props.app.states).map((key) => {
    return props.app.states[key].manifest?.hash || "";
  });

  const templateHashes = Object.keys(props.app.actions).map((key) => {
    return props.app.actions[key].manifest?.hash || "";
  });

  console.log("STATE_HASHES", stateHashes);
  console.log("TEMPLATE_HASHES", templateHashes);

  const { data } = useAgentsQuery({
    variables: {
      filters: {
        hasStates: stateHashes,
        hasTemplates: templateHashes,
      },
    },
  });

  const [selectedAgent, setSelectedAgent] = React.useState(0);

  if (!data) {
    return <></>;
  }

  if (data.agents.length === 0) {
    return <div>No agents Implementing this</div>;
  }

  return (
    <Card className="rounded-md relative overflow-hidden">
      <UsedAgentContext.Provider
        value={{ agent: data.agents.at(selectedAgent)?.id || "" }}
      >
        {props.children}
      </UsedAgentContext.Provider>
      <Popover>
        <PopoverTrigger asChild>
          <div className="p-2 cursor-pointer absolute rotate-45 translate-x-[50%]  translate-y-[50%] bottom-0 right-0 h-5 w-5 bg-gradient-to-r from-slate-200 to-slate-400  group transition opacity-20 hover:opacity-100">
            <div className="group-hover:block hidden"></div>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-2">Agents</div>
          {data.agents.map((agent, index) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(index)}
              className={`p-2 cursor-pointer rounded-md ${
                selectedAgent === index ? "bg-primary" : ""
              }`}
            >
              {agent.name}
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </Card>
  );
};
