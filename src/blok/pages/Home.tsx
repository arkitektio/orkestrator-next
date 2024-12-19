import { Guard } from "@/arkitekt/Arkitekt";
import registry, { Registry } from "../registry";
import { ModuleWrapper } from "../Wrapper";
import { useRef, useState } from "react";
import {
  DockviewApi,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from "dockview";
import { PanelKind, useAgentsQuery } from "@/rekuest/api/graphql";
import { Button } from "@/components/ui/button";
import { MetaApplication } from "@/hooks/use-metaapp";
import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSmartDrop } from "@/providers/smart/hooks";
import { BlokBlok } from "@/linkers";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Structure } from "@/types";

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
  app: MetaApplication<any, any>;
  addPanel: (key: string, agent: string) => void;
}) => {
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
        hasStates: stateHashes.length > 0 ? stateHashes : undefined,
        hasTemplates: templateHashes.length > 0 ? templateHashes : undefined,
        distinct: true,
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
    let api = apiRef.current;
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
    let api = apiRef.current;
    if (api) {
      const layout = api.toJSON();
      localStorage.setItem("dockview-layout", JSON.stringify(layout));
      console.log("Layout saved to localStorage");
    }
  };

  const [droppedItems, setDroppedItems] = useState<Structure[] | undefined>();

  const [{ isOver, canDrop, overItems }, drop] = useSmartDrop((items) => {
    setDroppedItems(items);
  }, []);

  return (
    <PageLayout title="Bloks">
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