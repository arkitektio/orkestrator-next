import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RekuestDashboard } from "@/linkers";
import { useSmartDrop } from "@/providers/smart/hooks";
import { Structure } from "@/types";
import {
  DockviewApi,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from "dockview";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  MaterializedBlokFragment,
  useGetBlokQuery,
  useGetDashboardQuery,
  useListBloksQuery,
  useMaterializeBlokMutation,
} from "../api/graphql";
import BlokCard from "../components/cards/BlokCard";
import { ModuleWrapper } from "@/blok/Wrapper";

const components: {} = {
  MBLOK: (
    props: IDockviewPanelProps<{
      title: string;
      mblok: MaterializedBlokFragment;
    }>,
  ) => {
    return <DynamicLoader blok={props.params.mblok} />;
  },
};

export const BlokSidebar = (props: {}) => {
  const { data, subscribeToMore } = useListBloksQuery();

  return (
    <div className="flex flex-col gap-2">
      {data?.bloks.map((blok) => <BlokCard item={blok} key={blok.id} />)}
    </div>
  );
};

export const DynamicLoader = (props: { blok: MaterializedBlokFragment }) => {
  return <ModuleWrapper mblok={props.blok} />;
};

export const Selector = (props: {
  module: string;
  addPanel: (key: string, agent: string) => void;
}) => {
  const { data, variables, error } = useGetBlokQuery({
    variables: {
      id: props.module,
    },
  });

  if (error) {
    return <div>Error loading blok: {error.message}</div>;
  }

  if (!data) {
    return <></>;
  }

  if (data.blok.possibleAgents.length === 0) {
    return (
      <div>
        No agents Implementing this. {JSON.stringify(data.blok, null, 3)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data.blok.possibleAgents.map((agent) => (
        <Button onClick={() => props.addPanel(props.module, agent.id)}>
          {agent.name}
        </Button>
      ))}
    </div>
  );
};

export default asDetailQueryRoute(useGetDashboardQuery, ({ data, refetch }) => {
  const apiRef = useRef<DockviewApi>();

  const [materialize] = useMaterializeBlokMutation();

  const onReady = (event: DockviewReadyEvent) => {
    data.dashboard.materializedBloks?.forEach((b) =>
      addMaterializedBlok(b, event.api),
    );
  };

  const addMaterializedBlok = (
    mblok: MaterializedBlokFragment,
    api: DockviewApi,
  ) => {
    let one_before: string | undefined = undefined;

    api.addPanel({
      id: mblok.id,
      component: "MBLOK",
      params: {
        title: "Panel 1",
        mblok: mblok,
      },
      title: mblok.blok.name,
      position: one_before
        ? { referencePanel: one_before, direction: "right" }
        : undefined,
    });
  };

  const addPanel = (blok: string, agent: string) => {
    materialize({
      variables: {
        input: { blok: blok, agent: agent, dashboard: data.dashboard.id },
      },
    }).then(
      (result) => {
        if (result.data?.materializeBlok) {
          console.log("Materialized Blok", result.data.materializeBlok);
          if (!apiRef.current) {
            console.error("API reference is not set");
            return;
          }
          addMaterializedBlok(result.data.materializeBlok, apiRef.current);
        } else {
          toast.error("Failed to materialize blok");
        }
      },
      (error) => {
        toast.error(error.message);
      },
    );
    setDroppedItems(undefined);
  };

  const [droppedItems, setDroppedItems] = useState<Structure[] | undefined>();

  const [{ isOver, canDrop }, drop] = useSmartDrop((items) => {
    setDroppedItems(items);
  }, []);

  const onSave = () => {
    let api = apiRef.current;
    if (api) {
      console.log(api.toJSON());
    }
  };

  return (
    <RekuestDashboard.ModelPage
      title={data.dashboard.name || "New Dasboard"}
      object={data.dashboard.id}
      sidebars={
        <MultiSidebar
          map={{
            Bloks: <BlokSidebar />,
          }}
        />
      }
    >
      <div className="relative w-full h-[800px] flex">
        <Dialog
          open={droppedItems != undefined}
          onOpenChange={() => {
            setDroppedItems(undefined);
          }}
        >
          <DialogContent>
            {droppedItems &&
              droppedItems.map((item) => (
                <Selector module={item.object} addPanel={addPanel} />
              ))}
          </DialogContent>
        </Dialog>
        <div
          ref={drop}
          className={`relative w-full h-full ${
            isOver && canDrop ? "bg-green-500/20" : ""
          }`}
        >
          {isOver && canDrop && (
            <div className="absolute top-0 left-0 w-full h-full bg-green-500/20 flex items-center justify-center">
              <p className="text-white">Drop to add a new panel</p>
            </div>
          )}
          <DockviewReact
            components={components}
            onReady={onReady}
            className={"dockview-theme-abyss h-[800px] w-full"}
          />
        </div>

        <Button
          variant="outline"
          className="absolute bottom-0 right-0"
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </RekuestDashboard.ModelPage>
  );
});
