import { MaterializedBlokContext } from "@/hooks/use-metaapp";
import { MaterializedBlokFragment } from "@/rekuest/api/graphql";
import registry from "./registry";

export const ModuleWrapper = (props: { mblok: MaterializedBlokFragment }) => {
  const Component = registry.components.get(props.mblok.blok.name)?.component;

  return (
    <div className="relative overflow-hidden h-full w-full group">
      <MaterializedBlokContext.Provider value={{ mblok: props.mblok }}>
        {Component && <Component />}
      </MaterializedBlokContext.Provider>

      <div className="absolute top-0 right-0 bg-black rounded-full text-xs rounded font-light group-hover:opacity-100 opacity-0 transition-all duration-300">
        {props.mblok.agent.id}
      </div>
    </div>
  );
};
