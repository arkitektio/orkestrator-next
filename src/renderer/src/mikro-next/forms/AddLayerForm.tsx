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
import {
  AddLayerLensCandidatesQuery,
  AddLayerTableDatasetCandidatesQuery,
  AxisType,
  ProjectionMode,
  TableColumnRole,
  useAddLayerLensCandidatesQuery,
  useAddLayerTableDatasetCandidatesQuery,
  useCreateIntensityLayerMutation,
  useCreateLabelLayerMutation,
  useCreatePointLayerMutation,
  useCreateRgbLayerMutation,
  useCreateTrackLayerMutation,
  useCreateVolumeLayerMutation,
  useGetSceneQuery,
} from "../api/graphql";

type LensCandidate = AddLayerLensCandidatesQuery["lenses"][number];
type TableCandidate =
  AddLayerTableDatasetCandidatesQuery["tableDatasets"][number];

type Source =
  | { kind: "lens"; lens: LensCandidate }
  | { kind: "tabledataset"; table: TableCandidate };

// The mutation options every layer creation submits with: the scene view
// reinitializes its stores when the GetScene result changes, so the new layer
// appears without any store plumbing.
const REFETCH_SCENE = {
  refetchQueries: ["GetScene"],
  awaitRefetchQueries: true,
};

const kindButton = (active: boolean) =>
  `rounded border px-3 py-1 text-sm transition-colors ${
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-input hover:bg-accent"
  }`;

// Placeability is decided server-side (the `placeableIn` filter), so every row
// shown is a valid drop target — the row is always selectable.
const SourceRow = (props: {
  name: string;
  secondary?: string | null;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={props.onClick}
    className="flex w-full items-center justify-between gap-2 rounded border border-input p-2 text-left transition-colors hover:bg-accent"
  >
    <div className="min-w-0">
      <div className="truncate text-sm font-medium">{props.name}</div>
      {props.secondary && (
        <div className="truncate text-xs text-muted-foreground">
          {props.secondary}
        </div>
      )}
    </div>
  </button>
);

// A one-line descriptor that distinguishes lenses of the same dataset: whether
// the lens is the full array (slices: []) or a slice, plus its axes and shape.
const lensLabel = (lens: LensCandidate) => {
  const dims = `${lens.axisNames.join(" × ")} · ${lens.shape.join(" × ")}`;
  if (lens.slices.length === 0) return `full — ${dims}`;
  const slices = lens.slices
    .map((s) => `${s.axis}[${s.start ?? ""}:${s.stop ?? ""}]`)
    .join(", ");
  return `${slices} — ${dims}`;
};

/**
 * Step 2a: a lens becomes an image layer. Image layers hang off a lens, and the
 * chosen lens is the layer's source directly — no lens resolution needed.
 */
const LensLayerForm = (props: {
  scene: string;
  lens: LensCandidate;
  onBack: () => void;
}) => {
  const [kind, setKind] = useState<"INTENSITY" | "RGB" | "VOLUME" | "LABEL">(
    "INTENSITY",
  );

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
    const base = { lens: props.lens.id, scene: props.scene };
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

  // The server returns only sources placeable into this scene: a lens whose
  // space (or a table's coordinate system) has a traversable path to the
  // scene's world. No client-side coordinate-graph walk is needed.
  const { data: lensData, loading: lensesLoading } =
    useAddLayerLensCandidatesQuery({
      variables: {
        filters: { placeableIn: props.scene },
        pagination: { limit: 50 },
      },
    });
  const { data: tableData, loading: tablesLoading } =
    useAddLayerTableDatasetCandidatesQuery({
      variables: {
        filters: { placeableIn: props.scene, ...(search ? { search } : {}) },
        pagination: { limit: 50 },
      },
    });

  // LensFilter has no text search, so filter the placeable lenses by their
  // dataset name client-side (tables are searched server-side above).
  const lenses = useMemo(() => {
    const all = lensData?.lenses ?? [];
    if (!search) return all;
    const q = search.toLowerCase();
    return all.filter((l) => l.dataset.name.toLowerCase().includes(q));
  }, [lensData, search]);

  return (
    <div className="flex flex-col gap-3">
      <DialogHeader>
        <DialogTitle>Add layer</DialogTitle>
        <DialogDescription>
          {source
            ? source.kind === "lens"
              ? `What kind of image layer should "${source.lens.dataset.name}" become?`
              : `How should the rows of "${source.table.name}" be rendered?`
            : `Pick a lens or table to add to "${sceneData?.scene.name ?? "this scene"}".`}
        </DialogDescription>
      </DialogHeader>

      {source === null ? (
        <>
          <Input
            placeholder="Search lenses and tables…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto">
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Lenses
              </div>
              {lenses.map((l) => (
                <SourceRow
                  key={l.id}
                  name={l.dataset.name}
                  secondary={lensLabel(l)}
                  onClick={() => setSource({ kind: "lens", lens: l })}
                />
              ))}
              {!lensesLoading && !lenses.length && (
                <div className="text-xs text-muted-foreground">
                  No placeable lenses found
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
                  secondary={
                    t.description || t.columns.map((c) => c.name).join(", ")
                  }
                  onClick={() => setSource({ kind: "tabledataset", table: t })}
                />
              ))}
              {!tablesLoading && !tableData?.tableDatasets.length && (
                <div className="text-xs text-muted-foreground">
                  No placeable tables found
                </div>
              )}
            </div>
          </div>
        </>
      ) : source.kind === "lens" ? (
        <LensLayerForm
          scene={props.scene}
          lens={source.lens}
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
