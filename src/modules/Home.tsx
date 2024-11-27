import { Guard } from "@/arkitekt/Arkitekt";
import { Registry } from "./registry";
import { ModuleWrapper } from "./Wrapper";

export const Home = (props: { registry: Registry }) => {
  return (
    <Guard.Rekuest>
      <div className="flex flex-col gap-2">
        {Array.from(props.registry.modules.keys()).map((key) => {
          const Component = props.registry.components.get(key)?.component;
          const module = props.registry.components.get(key)?.module;

          if (!Component || !module) {
            return <>FAULTY</>;
          }

          return (
            <ModuleWrapper app={module}>
              {" "}
              <Component />{" "}
            </ModuleWrapper>
          );
        })}
      </div>
    </Guard.Rekuest>
  );
};
