import { MetaApplication, UsedAgentContext } from "@/hooks/use-metaapp";
import { useAgentsQuery } from "@/rekuest/api/graphql";

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

  if (!data) {
    return <></>;
  }

  if (data.agents.length === 0) {
    return <div>No agents Implementing this</div>;
  }

  return (
    <UsedAgentContext.Provider value={{ agent: data.agents.at(0)?.id || "" }}>
      {props.children}
    </UsedAgentContext.Provider>
  );
};
