import { Guard } from "@/app/Arkitekt";
import { useGraphQLDialog } from "@/app/hooks/useGraphQLDialog";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { FloatField } from "@/components/fields/FloatField";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AddLayerADatasetCandidatesQuery,
  AddLayerTableDatasetCandidatesQuery,
  AxisType,
  ProjectionMode,
  TableColumnRole,
  useAddLayerADatasetCandidatesQuery,
  useAddLayerTableDatasetCandidatesQuery,
  useCreateIntensityLayerMutation,
  useCreateLabelLayerMutation,
  useCreateLensMutation,
  useCreatePointLayerMutation,
  useCreateRgbLayerMutation,
  useCreateTrackLayerMutation,
  useCreateVolumeLayerMutation,
  useGetCoordinateGraphQuery,
  useGetSceneQuery,
  useListLensesForDatasetQuery,
} from "../api/graphql";

type DatasetCandidate = AddLayerADatasetCandidatesQuery["adatasets"][number];
type TableCandidate =
  AddLayerTableDatasetCandidatesQuery["tableDatasets"][number];

type Source =
  | { kind: "adataset"; dataset: DatasetCandidate }
  | { kind: "tabledataset"; table: TableCandidate };

// The mutation options every layer creation submits with: the scene view
// reinitializes its stores when the GetScene result changes, so the new layer
// appears without any store plumbing.
const REFETCH_SCENE = {
  refetchQueries: ["GetScene"],
  awaitRefetchQueries: true,
};

const NOT_COMPOSABLE_HINT =
  "No transformation path connects this data's coordinate system to the scene's world system. Register it into the scene first.";

const kindButton = (active: boolean) =>
  `rounded border px-3 py-1 text-sm transition-colors ${
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-input hover:bg-accent"
  }`;

const SourceRow = (props: {
  name: string;
  description?: string | null;
  meta: string;
  composable: boolean | null;
  onClick: () => void;
}) => (
  <button
    type="button"
    disabled={props.composable === false}
    title={props.composable === false ? NOT_COMPOSABLE_HINT : undefined}
    onClick={props.onClick}
    className={`flex w-full items-center justify-between gap-2 rounded border border-input p-2 text-left transition-colors ${
      props.composable === false
        ? "cursor-not-allowed opacity-50"
        : "hover:bg-accent"
    }`}
  >
    <div className="min-w-0">
      <div className="truncate text-sm font-medium">{props.name}</div>
      <div className="truncate text-xs text-muted-foreground">
        {props.description || props.meta}
      </div>
    </div>
    <div className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
      {props.composable === null
        ? "checking…"
        : props.composable
          ? "composable"
          : "no path to scene"}
    </div>
  </button>
);

/**
 * Step 2a: an ADataset becomes an image layer. Image layers hang off a Lens,
 * so submitting reuses the dataset's full lens (slices: []) when one exists
 * and mints one otherwise, then creates the chosen layer kind.
 */
const DatasetLayerForm = (props: {
  scene: string;
  dataset: DatasetCandidate;
  onBack: () => void;
}) => {
  const [kind, setKind] = useState<"INTENSITY" | "RGB" | "VOLUME" | "LABEL">(
    "INTENSITY",
  );

  const { data: lensData } = useListLensesForDatasetQuery({
    variables: { dataset: props.dataset.id },
  });

  const [createLens] = useCreateLensMutation();
  const [createIntensity] = useCreateIntensityLayerMutation();
  const [createRgb] = useCreateRgbLayerMutation();
  const [createVolume] = useCreateVolumeLayerMutation();
  const [createLabel] = useCreateLabelLayerMutation();

  const dialogOptions = {
    successMessage: "Layer added",
    errorPrefix: "Could not add layer",
  };
  const submitIntensity = useGraphQLDialog(createIntensity, dialogOptions);
  const submitRgb = useGraphQLDialog(createRgb, dialogOptions);
  const submitVolume = useGraphQLDialog(createVolume, dialogOptions);
  const submitLabel = useGraphQLDialog(createLabel, dialogOptions);

  const form = useForm({
    defaultValues: { mode: ProjectionMode.Mip as string },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    let lensId = lensData?.lenses.find((l) => l.slices.length === 0)?.id;
    if (!lensId) {
      // Outside useGraphQLDialog: a failed lens creation must not close the
      // dialog or toast "Layer added".
      try {
        const result = await createLens({
          variables: { input: { dataset: props.dataset.id, slices: [] } },
        });
        lensId = result.data?.createLens.id;
      } catch (e) {
        toast.error("Could not create lens: " + (e as Error).message);
        return;
      }
    }
    if (!lensId) {
      toast.error("Could not resolve a lens for this dataset");
      return;
    }

    const base = { lens: lensId, scene: props.scene };
    switch (kind) {
      case "INTENSITY":
        return submitIntensity({ variables: { input: base }, ...REFETCH_SCENE });
      case "RGB":
        return submitRgb({ variables: { input: base }, ...REFETCH_SCENE });
      case "VOLUME":
        return submitVolume({
          variables: { input: { ...base, mode: data.mode as ProjectionMode } },
          ...REFETCH_SCENE,
        });
      case "LABEL":
        return submitLabel({ variables: { input: base }, ...REFETCH_SCENE });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {(["INTENSITY", "RGB", "VOLUME", "LABEL"] as const).map((k) => (
            <button
              key={k}
              type="button"
              className={kindButton(kind === k)}
              onClick={() => setKind(k)}
            >
              {k.charAt(0) + k.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {kind === "VOLUME" && (
          <ChoicesField
            name="mode"
            label="Projection mode"
            description="How the volume is projected through its z-axis"
            options={[
              { value: ProjectionMode.Mip, label: "Maximum intensity (MIP)" },
              { value: ProjectionMode.AttenuatedMip, label: "Attenuated MIP" },
              { value: ProjectionMode.Volume, label: "Alpha volume" },
              { value: ProjectionMode.Isosurface, label: "Isosurface" },
            ]}
          />
        )}

        <DialogFooter className="mt-2">
          <Button type="button" variant="outline" onClick={props.onBack}>
            Back
          </Button>
          <Button type="submit">Add layer</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

/**
 * Step 2b: a TableDataset becomes a point or track layer. Column mappings
 * default from the table's declared column roles; the user can remap them.
 */
const TableLayerForm = (props: {
  scene: string;
  table: TableCandidate;
  onBack: () => void;
}) => {
  const columns = props.table.columns;
  const trackable = columns.some((c) => c.role === TableColumnRole.TrackId);
  const [kind, setKind] = useState<"POINT" | "TRACK">("POINT");

  const [createPoint] = useCreatePointLayerMutation();
  const [createTrack] = useCreateTrackLayerMutation();
  const dialogOptions = {
    successMessage: "Layer added",
    errorPrefix: "Could not add layer",
  };
  const submitPoint = useGraphQLDialog(createPoint, dialogOptions);
  const submitTrack = useGraphQLDialog(createTrack, dialogOptions);

  const defaults = useMemo(() => {
    const coordinates = columns.filter(
      (c) => c.role === TableColumnRole.Coordinate,
    );
    const space = coordinates.filter((c) => c.axisType === AxisType.Space);
    const byName = (name: string) =>
      space.find((c) => c.name.toLowerCase() === name)?.name;
    const byRole = (role: TableColumnRole) =>
      columns.find((c) => c.role === role)?.name;
    return {
      xColumn: byName("x") ?? space[0]?.name ?? "",
      yColumn: byName("y") ?? space[1]?.name ?? "",
      zColumn: byName("z") ?? (space.length > 2 ? space[2]?.name : "") ?? "",
      tColumn: coordinates.find((c) => c.axisType === AxisType.Time)?.name ?? "",
      trackIdColumn: byRole(TableColumnRole.TrackId) ?? "",
      colorColumn: byRole(TableColumnRole.Color) ?? "",
      idColumn: byRole(TableColumnRole.Id) ?? "",
      sizeColumn: "",
      pointSize: undefined as number | undefined,
      lineWidth: undefined as number | undefined,
    };
  }, [columns]);

  const form = useForm({ defaultValues: defaults });

  const columnOptions = (optional: boolean) => [
    ...(optional ? [{ value: "", label: "None" }] : []),
    ...columns.map((c) => ({
      value: c.name,
      label:
        c.role === TableColumnRole.Attribute
          ? c.name
          : `${c.name} (${c.role.toLowerCase()})`,
    })),
  ];

  const onSubmit = form.handleSubmit(async (data) => {
    // "" means an unmapped optional column; the input omits it entirely.
    const orUndefined = (v: string) => v || undefined;
    const base = {
      scene: props.scene,
      tableDataset: props.table.id,
      coordinateSystem: props.table.coordinateSystem.id,
      xColumn: orUndefined(data.xColumn),
      yColumn: orUndefined(data.yColumn),
      zColumn: orUndefined(data.zColumn),
      tColumn: orUndefined(data.tColumn),
    };
    if (kind === "POINT") {
      return submitPoint({
        variables: {
          input: {
            ...base,
            sizeColumn: orUndefined(data.sizeColumn),
            colorColumn: orUndefined(data.colorColumn),
            idColumn: orUndefined(data.idColumn),
            pointSize: data.pointSize ?? undefined,
          },
        },
        ...REFETCH_SCENE,
      });
    }
    return submitTrack({
      variables: {
        input: {
          ...base,
          trackIdColumn: orUndefined(data.trackIdColumn),
          colorByColumn: orUndefined(data.colorColumn),
          lineWidth: data.lineWidth ?? undefined,
        },
      },
      ...REFETCH_SCENE,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={kindButton(kind === "POINT")}
            onClick={() => setKind("POINT")}
          >
            Points
          </button>
          <button
            type="button"
            className={kindButton(kind === "TRACK")}
            disabled={!trackable}
            title={
              trackable ? undefined : "Requires a column with the TRACK_ID role"
            }
            onClick={() => setKind("TRACK")}
          >
            Tracks
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <ChoicesField name="xColumn" label="X column" options={columnOptions(false)} />
          <ChoicesField name="yColumn" label="Y column" options={columnOptions(false)} />
          <ChoicesField name="zColumn" label="Z column" options={columnOptions(true)} />
          <ChoicesField name="tColumn" label="Time column" options={columnOptions(true)} />
          {kind === "POINT" ? (
            <>
              <ChoicesField
                name="colorColumn"
                label="Color column"
                options={columnOptions(true)}
              />
              <ChoicesField
                name="sizeColumn"
                label="Size column"
                options={columnOptions(true)}
              />
              <ChoicesField
                name="idColumn"
                label="Id column"
                options={columnOptions(true)}
              />
              <FloatField
                name="pointSize"
                label="Point size"
                description="Leave empty for the default"
              />
            </>
          ) : (
            <>
              <ChoicesField
                name="trackIdColumn"
                label="Track id column"
                options={columnOptions(false)}
              />
              <ChoicesField
                name="colorColumn"
                label="Color by column"
                options={columnOptions(true)}
              />
              <FloatField
                name="lineWidth"
                label="Line width"
                description="Leave empty for the default"
              />
            </>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button type="button" variant="outline" onClick={props.onBack}>
            Back
          </Button>
          <Button type="submit">Add layer</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

const AddLayerFormInner = (props: { scene: string }) => {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<Source | null>(null);

  const { data: sceneData } = useGetSceneQuery({
    variables: { id: props.scene },
  });
  const worldCsId = sceneData?.scene.worldCoordinateSystem?.id;

  // Composability is decided client-side: a source composes into the scene
  // when one of its coordinate systems sits in the connected component around
  // the scene's world system (Scene.coordinateSystems is not transitive).
  const { data: graphData } = useGetCoordinateGraphQuery({
    variables: { coordinateSystem: worldCsId ?? "" },
    skip: !worldCsId,
  });
  const reachable = useMemo(
    () =>
      graphData
        ? new Set(graphData.coordinateGraph.systems.map((s) => s.id))
        : null,
    [graphData],
  );

  const filters = search ? { search } : undefined;
  const { data: datasetData, loading: datasetsLoading } =
    useAddLayerADatasetCandidatesQuery({
      variables: { filters, pagination: { limit: 50 } },
    });
  const { data: tableData, loading: tablesLoading } =
    useAddLayerTableDatasetCandidatesQuery({
      variables: { filters, pagination: { limit: 50 } },
    });

  const datasetComposable = (d: DatasetCandidate) =>
    reachable === null
      ? null
      : (d.intrinsicSystem != null && reachable.has(d.intrinsicSystem.id)) ||
        d.calibrations.some((c) => reachable.has(c.id));
  const tableComposable = (t: TableCandidate) =>
    reachable === null ? null : reachable.has(t.coordinateSystem.id);

  return (
    <div className="flex flex-col gap-3">
      <DialogHeader>
        <DialogTitle>Add layer</DialogTitle>
        <DialogDescription>
          {source
            ? source.kind === "adataset"
              ? `What kind of image layer should "${source.dataset.name}" become?`
              : `How should the rows of "${source.table.name}" be rendered?`
            : `Pick a dataset or table to add to "${sceneData?.scene.name ?? "this scene"}".`}
        </DialogDescription>
      </DialogHeader>

      {source === null ? (
        <>
          <Input
            placeholder="Search datasets and tables…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto">
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Array datasets
              </div>
              {datasetData?.adatasets.map((d) => (
                <SourceRow
                  key={d.id}
                  name={d.name}
                  description={d.description}
                  meta={`${d.axisNames.join(" × ")} — ${d.shape.join(" × ")}`}
                  composable={datasetComposable(d)}
                  onClick={() => setSource({ kind: "adataset", dataset: d })}
                />
              ))}
              {!datasetsLoading && !datasetData?.adatasets.length && (
                <div className="text-xs text-muted-foreground">
                  No datasets found
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Tables
              </div>
              {tableData?.tableDatasets.map((t) => (
                <SourceRow
                  key={t.id}
                  name={t.name}
                  description={t.description}
                  meta={t.columns.map((c) => c.name).join(", ")}
                  composable={tableComposable(t)}
                  onClick={() => setSource({ kind: "tabledataset", table: t })}
                />
              ))}
              {!tablesLoading && !tableData?.tableDatasets.length && (
                <div className="text-xs text-muted-foreground">
                  No tables found
                </div>
              )}
            </div>
          </div>
        </>
      ) : source.kind === "adataset" ? (
        <DatasetLayerForm
          scene={props.scene}
          dataset={source.dataset}
          onBack={() => setSource(null)}
        />
      ) : (
        <TableLayerForm
          scene={props.scene}
          table={source.table}
          onBack={() => setSource(null)}
        />
      )}
    </div>
  );
};

// The mikro guard must wrap from the outside: the inner component's queries
// fire on mount, before any JSX-level guard could stop them (CLAUDE.md §1).
export const AddLayerForm = (props: { scene: string }) => (
  <Guard.Mikro>
    <AddLayerFormInner {...props} />
  </Guard.Mikro>
);
