import { MetaApplication, UsedAgentContext } from "@/hooks/use-metaapp";
import { useAgentsQuery } from "@/rekuest/api/graphql";

export const ModuleWrapper = (props: {
  app: MetaApplication<any, any>;
  children: React.ReactNode;
}) => {
  const { data } = useAgentsQuery({
    variables: {
      filters: {
        hasStates: props.app.states,
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
