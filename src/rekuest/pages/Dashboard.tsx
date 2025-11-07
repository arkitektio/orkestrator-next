import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ModuleWrapper } from "@/blok/Wrapper";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RekuestDashboard } from "@/linkers";
import {
  Direction,
  DockviewApi,
  DockviewDidDropEvent,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
  positionToDirection,
  SerializedDockview,
} from "dockview";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  MaterializedBlokFragment,
  useGetBlokQuery,
  useGetDashboardQuery,
  useListBloksQuery,
  useMaterializeBlokMutation,
} from "../api/graphql";

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
    <div className="flex flex-col gap-2 p-3">
      {data?.bloks.map((blok) => <Card key={blok.id} onDragStart={(event) => {
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move';

          event.dataTransfer.setData('text/plain', "blok-" + blok.id);
        }
      }}
        className="p-3 cursor-move"
        draggable={true}>{blok.name}</Card>)}
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
  const [api, setApi] = useState<DockviewApi | null>(null);

  const [materialize] = useMaterializeBlokMutation();

  const onReady = (event: DockviewReadyEvent) => {

    const mySerializedLayout = localStorage.getItem(`layout_${data.dashboard.id}`);

    if (mySerializedLayout) {
      try {
        const layout = JSON.parse(mySerializedLayout);

        console.log("Restoring layout", layout.panels);

        layout.panels = data.dashboard.materializedBloks?.map((b) => ({
          id: b.id,
          contentComponent: "MBLOK",
          params: {
            title: b.blok.name,
            mblok: b
          },
          title: b.blok.name,
        })).reduce((acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {});

        event.api.fromJSON(layout);
      } catch (err) {
        data.dashboard.materializedBloks?.forEach((b) =>
          addMaterializedBlok(b, event.api),
        );
      }
    }
    else {
      data.dashboard.materializedBloks?.forEach((b) =>
        addMaterializedBlok(b, event.api),
      );
    }



    setApi(event.api);
  };

  const [dropContext, setDropContext] = useState<{
    blok: string
    group: string | undefined;
    direction: Direction
  } | undefined>(undefined);

  useEffect(() => {
    if (!api) {
      return;
    }
    const disposable = api.onUnhandledDragOverEvent((event) => {
      event.accept();
    });

    const disposableL = api.onDidLayoutChange(() => {
      const layout: SerializedDockview = api.toJSON();
      localStorage.setItem(`layout_${data.dashboard.id}`, JSON.stringify(layout));
    });

    return () => {
      disposable.dispose();
      disposableL.dispose();
    };
  }, [api]);


  const addMaterializedBlok = (
    mblok: MaterializedBlokFragment,
    api: DockviewApi,
  ) => {

    api.addPanel({
      id: mblok.id,
      component: "MBLOK",
      params: {
        title: "Panel 1",
        mblok: mblok,
      },
      title: mblok.blok.name,
    });
  };

  const addPanel = useCallback((blok: string, agent: string) => {
    materialize({
      variables: {
        input: { blok: blok, agent: agent, dashboard: data.dashboard.id },
      },
    }).then(
      (result) => {
        let mblok = result.data?.materializeBlok;
        if (mblok) {
          console.log("Materialized Blok", mblok);
          if (!api || dropContext == undefined) {
            toast.error("API reference is not set");
            return;
          }


          api.addPanel({
            id: mblok.id,
            component: "MBLOK",
            params: {
              title: mblok.blok.name,
              mblok: mblok,
            },
            title: mblok.blok.name,
            position: {
              direction: dropContext?.direction,
              referenceGroup: dropContext?.group,
            },
          });
          setDropContext(undefined);
        } else {
          toast.error("Failed to materialize blok");
        }
      },
      (error) => {
        toast.error(error.message);
      },
    );

  }, [data.dashboard.id, materialize, api, dropContext]);




  const onSave = () => {

  };

  const onDidDrop = (event: DockviewDidDropEvent) => {

    let blok = event.nativeEvent?.dataTransfer?.getData("text/plain");
    if (!blok || !blok.startsWith("blok-")) {
      alert("Dropped item is not a blok");
      return;
    }
    blok = blok.replace("blok-", "");

    setDropContext({
      blok: blok,
      group: event.group?.id,
      direction: positionToDirection(event.position),
    });
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
      <div className="relative w-full h-full flex">
        <Dialog
          open={dropContext != undefined}
          onOpenChange={() => {
            setDropContext(undefined);
          }}

        >
          <DialogContent>
            {dropContext &&
              <Selector module={dropContext.blok} addPanel={addPanel} />
            }
          </DialogContent>
        </Dialog>
        <DockviewReact
          components={components}
          onReady={onReady}
          className={"dockview-theme-abyss h-[800px] w-full"}
          onDidDrop={onDidDrop}
        />

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
