import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MetaApplication, MetaApplicationAdds } from "@/hooks/use-metaapp";
import { Guard } from "@/app/Arkitekt";
import { useSmartDrop } from "@/providers/smart/hooks";
import {
  useAgentsQuery,
  useCreateBlokMutation
} from "@/rekuest/api/graphql";
import { Structure } from "@/types";
import {
  DockviewApi,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from "dockview";
import { useRef, useState } from "react";
import registry from "../registry";
import { ModuleWrapper } from "../Wrapper";

const components = registry.components
  .keys()
  .map((key) => ({
    key: key,
    component: (
      props: IDockviewPanelProps<{ title: string; agent: string }>,
    ) => {
      const Component = registry.components.get(key)?.component;
      const module = registry.components.get(key)?.module;

      if (!Component || !module) {
        return <>FAULTY</>;
      }

      return (
        <div className="p-2 h-full w-full @container">
          <ModuleWrapper app={module} agent={props.params.agent}>
            {" "}
            <Component />{" "}
          </ModuleWrapper>
        </div>
      );
    },
  }))
  .reduce((acc, cur) => {
    acc[cur.key] = cur.component;
    return acc;
  }, {});

export const Selector = (props: {
  module: string;
  app: MetaApplicationAdds<any>;
  addPanel: (key: string, agent: string) => void;
}) => {
  if (!props.app.app) {
    return <>No app defined</>;
  }

  const stateDemands = Object.keys(props.app.app.states).map((key) => {
    return props.app.app.states[key].demand;
  });

  const actionDemands = Object.keys(props.app.app.actions).map((key) => {
    return props.app.app.actions[key].demand;
  });

  const { data, variables } = useAgentsQuery({
    variables: {
      filters: {
        stateDemands: stateDemands.length > 0 ? stateDemands : undefined,
        actionDemands: actionDemands.length > 0 ? actionDemands : undefined,
        distinct: true,
      },
    },
  });

  if (!data) {
    return <></>;
  }

  if (data.agents.length === 0) {
    return (
      <div>
        No agents Implementing this. {JSON.stringify(variables, null, 3)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data.agents.map((agent) => (
        <Button onClick={() => props.addPanel(props.module, agent.id)}>
          {agent.name}
        </Button>
      ))}
    </div>
  );
};

export const Home = (props) => {
  const apiRef = useRef<DockviewApi>();

  const addPanel = (key: string, agent: string) => {
    const api = apiRef.current;
    if (api) {
      api.addPanel({
        id: `${key}-${agent}`,
        component: key,
        params: {
          key: key,
          agent: agent,
          registry: props.registry,
        },
        title: key,
      });
    }
    setDroppedItems(undefined);
  };

  const onReady = (event: DockviewReadyEvent) => {
    apiRef.current = event.api;

    // Load layout from localStorage if it exists
    const savedLayout = localStorage.getItem("dockview-layout");
    if (savedLayout) {
      try {
        const layout = JSON.parse(savedLayout);
        event.api.fromJSON(layout);
      } catch (error) {
        console.error("Failed to load layout:", error);
      }
    }
  };

  const onSave = () => {
    const api = apiRef.current;
    if (api) {
      const layout = api.toJSON();
      localStorage.setItem("dockview-layout", JSON.stringify(layout));
    }
  };

  const [droppedItems, setDroppedItems] = useState<Structure[] | undefined>();

  const [{ isOver, canDrop, overItems }, drop] = useSmartDrop((items) => {
    setDroppedItems(items);
  }, []);

  const [createBlok] = useCreateBlokMutation();

  const createBloks = async () => {
    for (const [key, mod] of registry.modules.entries()) {
      if (mod.app) {
        const stateDemands = Object.keys(mod.app.states).map((key) => {
          return { key: key, ...mod.app.states[key].demand };
        });

        const actionDemands = Object.keys(mod.app.actions).map((key) => {
          return { key: key, ...mod.app.actions[key].demand };
        });

        const x = await createBlok({
          variables: {
            input: {
              name: mod.app.name,
              stateDemands: stateDemands,
              actionDemands: actionDemands,
              url: `orkestrator:///${key}`,
            },
          },
        });


      }
    }
  };

  return (
    <PageLayout
      title="Bloks"
      pageActions={<Button onClick={() => createBloks()}>Materialize</Button>}
    >
      <div className="h-full w-full flex flex-col">
        <Guard.Rekuest>
          <Dialog
            open={droppedItems != undefined}
            onOpenChange={() => {
              setDroppedItems(undefined);
            }}
          >
            <DialogContent>
              {droppedItems &&
                droppedItems.map((item) => (
                  <Selector
                    module={item.object}
                    app={
                      registry.modules.get(item.object) as MetaApplication<
                        any,
                        any
                      >
                    }
                    addPanel={addPanel}
                  />
                ))}
            </DialogContent>
          </Dialog>
          <div className="h-full w-full" ref={drop}>
            <DockviewReact
              components={components}
              onReady={onReady}
              className={"dockview-theme-abyss"}
            />
          </div>
          <Button
            variant="outline"
            className="absolute bottom-0 right-0"
            onClick={onSave}
          >
            Save
          </Button>
        </Guard.Rekuest>
      </div>
    </PageLayout>
  );
};
