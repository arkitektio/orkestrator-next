import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import BlokRenderer from "@/blok/renderer/BlokRenderer";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocalActionButton } from "@/components/ui/localactionbutton";
import { RekuestDashboard } from "@/linkers";
import {
  Direction,
  DockviewApi,
  DockviewDidDropEvent,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
  IDockviewPanelHeaderProps,
  positionToDirection,
  SerializedDockview,
} from "dockview";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Circle, Pencil, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import {
  MaterializedBlokFragment,
  useGetBlokQuery,
  useGetDashboardQuery,
  useListBloksQuery,
  useMaterializeBlokMutation,
} from "../api/graphql";
import { MaterializeBlokForm } from "../forms/MaterializeBlokForm";

type MaterializedBlokPanelParams = {
  title: string;
  mblok: MaterializedBlokFragment;
};

const components = {
  MBLOK: (
    props: IDockviewPanelProps<MaterializedBlokPanelParams>,
  ) => {
    return <DynamicLoader blok={props.params.mblok} />;
  },
} as const;

const MaterializedBlokTab = (
  props: IDockviewPanelHeaderProps<MaterializedBlokPanelParams> & {
    editing: boolean;
  },
) => {
  return (
    <div className="group flex items-center gap-1.5 px-2 py-1 text-muted-foreground">
      <Circle className="h-2 w-2 fill-current text-primary" />
      <span>{props.params.mblok.blok.name ?? props.api.title}</span>
      {props.editing && (
        <button
          className="ml-1 rounded-sm p-0.5 opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100 hover:bg-muted"
          onClick={(event) => {
            event.stopPropagation();
            props.api.close();
          }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export const BlokSidebar = () => {
  const { data } = useListBloksQuery();

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
  return (
    <div className="h-full overflow-auto p-3 @container">
      <BlokRenderer
        surfaceId={props.blok.id}
        uiComponents={props.blok.blok.uiComponents}
        demoState={props.blok.blok.demoState}
      />
    </div>
  );
};

export const Selector = (props: {
  blokId: string;
  dashboardId: string;
  onMaterialized: (mblok: MaterializedBlokFragment) => void;
}) => {
  const { data, error } = useGetBlokQuery({
    variables: {
      id: props.blokId,
    },
  });
  const [materialize, { loading }] = useMaterializeBlokMutation();
  const autoMaterializedRef = useRef(false);

  useEffect(() => {
    if (!data || autoMaterializedRef.current || data.blok.dependencies.length > 0) {
      return;
    }

    autoMaterializedRef.current = true;

    materialize({
      variables: {
        input: {
          blok: props.blokId,
          dashboard: props.dashboardId,
        },
      },
    })
      .then((result) => {
        const materializedBlok = result.data?.materializeBlok;

        if (!materializedBlok) {
          autoMaterializedRef.current = false;
          toast.error("Failed to materialize blok");
          return;
        }

        props.onMaterialized(materializedBlok);
      })
      .catch((materializeError) => {
        autoMaterializedRef.current = false;
        toast.error(materializeError.message);
      });
  }, [data, materialize, props]);

  if (error) {
    return <div>Error loading blok: {error.message}</div>;
  }

  if (!data) {
    return <div className="text-sm text-muted-foreground">Loading blok...</div>;
  }

  if (data.blok.dependencies.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        {loading ? "Materializing blok..." : "Preparing blok..."}
      </div>
    );
  }

  return (
    <MaterializeBlokForm
      blokId={data.blok.id}
      dashboardId={props.dashboardId}
      dependencies={data.blok.dependencies.map((dependency) => ({
        id: dependency.id,
        key: dependency.key,
      }))}
      onMaterialized={props.onMaterialized}
    />
  );
};

export const DashboardPage = asDetailQueryRoute(useGetDashboardQuery, ({ data, refetch }) => {
  const materializedBloks = data.dashboard.placements.flatMap((placement) =>
    placement.blok ? [placement.blok] : [],
  );
  const [api, setApi] = useState<DockviewApi | null>(null);
  const [editing, setEditing] = useState(false);
  const [panelCount, setPanelCount] = useState(materializedBloks.length);
  const layoutStorageKey = `layout_${data.dashboard.id}`;

  const addMaterializedBlok = useCallback((
    mblok: MaterializedBlokFragment,
    dockApi: DockviewApi,
    position?: {
      direction: Direction;
      referenceGroup?: string;
    },
  ) => {
    dockApi.addPanel({
      id: mblok.id,
      component: "MBLOK",
      params: {
        title: mblok.blok.name,
        mblok,
      },
      title: mblok.blok.name,
      position,
    });
  }, []);

  const onReady = (event: DockviewReadyEvent) => {
    const mySerializedLayout = localStorage.getItem(layoutStorageKey);

    if (mySerializedLayout) {
      try {
        const layout = JSON.parse(mySerializedLayout);

        layout.panels = materializedBloks.map((b) => ({
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
      } catch {
        materializedBloks.forEach((b) =>
          addMaterializedBlok(b, event.api),
        );
      }
    }
    else {
      materializedBloks.forEach((b) =>
        addMaterializedBlok(b, event.api),
      );
    }



    setApi(event.api);
    setPanelCount(event.api.panels.length);
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
      localStorage.setItem(layoutStorageKey, JSON.stringify(layout));
      setPanelCount(api.panels.length);
    });

    return () => {
      disposable.dispose();
      disposableL.dispose();
    };
  }, [api, layoutStorageKey]);

  const onMaterialized = useCallback((mblok: MaterializedBlokFragment) => {
    if (!api || dropContext == undefined) {
      toast.error("Dashboard is not ready for dropping panels yet");
      return;
    }

    addMaterializedBlok(mblok, api, {
      direction: dropContext.direction,
      referenceGroup: dropContext.group,
    });
    setDropContext(undefined);
    void refetch();
  }, [api, dropContext, refetch, addMaterializedBlok]);

  const resetLayout = useCallback(() => {
    if (!api) {
      return;
    }

    api.clear();
    localStorage.removeItem(layoutStorageKey);
    materializedBloks.forEach((mblok) => addMaterializedBlok(mblok, api));
    setPanelCount(api.panels.length);
  }, [api, layoutStorageKey, materializedBloks, addMaterializedBlok]);

  const renderTab = useCallback(
    (props: IDockviewPanelHeaderProps<MaterializedBlokPanelParams>) => (
      <MaterializedBlokTab {...props} editing={editing} />
    ),
    [editing],
  );

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
      object={data.dashboard}
      pageActions={(
        <LocalActionButton
          name="rekuest-delete-dashboard"
          variant="destructive"
          size="sm"
          state={{
            left: [
              {
                identifier: '@rekuest/dashboard',
                object: data.dashboard,
              },
            ],
            isCommand: false,
          }}
        />
      )}
      sidebars={
        <MultiSidebar
          map={{
            Bloks: <BlokSidebar />,
          }}
        />
      }
    >
      <div className="h-full w-full flex flex-col overflow-hidden">
        <Dialog
          open={dropContext != undefined}
          onOpenChange={() => {
            setDropContext(undefined);
          }}

        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Materialize Blok</DialogTitle>
            </DialogHeader>
            {dropContext &&
              <Selector
                blokId={dropContext.blok}
                dashboardId={data.dashboard.id}
                onMaterialized={onMaterialized}
              />
            }
          </DialogContent>
        </Dialog>

        <div className="px-6 py-5 flex flex-col flex-1 gap-4 min-h-0">
          <div className="flex items-end justify-between gap-4 shrink-0">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {data.dashboard.name || "Untitled dashboard"}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Drag bloks from the sidebar to materialize and arrange them in this workspace.
              </p>
            </div>

            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button onClick={resetLayout} variant="ghost" size="sm">
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Reset
                  </Button>
                  <Button onClick={() => setEditing(false)} variant="default" size="sm">
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    Done
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setEditing(true)} variant="ghost" size="sm">
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button onClick={() => void refetch()} variant="outline" size="sm">
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Refresh
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap shrink-0">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Dashboard
            </span>
            <div className="flex items-center gap-1.5">
              <Circle className="h-2 w-2 fill-current text-green-500" />
              <span className="text-xs text-muted-foreground">{panelCount} panels open</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Circle className="h-2 w-2 fill-current text-primary" />
              <span className="text-xs text-muted-foreground">
                {data.dashboard.placements.length} placements
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Circle className="h-2 w-2 fill-current text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Drop enabled</span>
            </div>
          </div>

          <div className="flex-1 min-h-0 rounded-2xl overflow-hidden">
            <DockviewReact
              components={components}
              defaultTabComponent={renderTab}
              onReady={onReady}
              className="dockview-theme-abyss h-full w-full"
              onDidDrop={onDidDrop}
            />
          </div>
        </div>
      </div>
    </RekuestDashboard.ModelPage>
  );
});


export default DashboardPage;
