import { Guard } from "@/app/Arkitekt";
import { useGraphQLDialog } from "@/app/hooks/useGraphQLDialog";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { FloatField } from "@/components/fields/FloatField";
import { SwitchField } from "@/components/fields/SwitchField";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RESIDENT_ICON } from "@/mikro-next/components/coordinates/ResidentLink";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ProjectionMode,
  TableColumnRole,
  useAddLayerLensCapabilitiesQuery,
  useAddLayerReachableQuery,
  useCreateAnnotationLayerMutation,
  useCreateIntensityLayerMutation,
  useCreateLabelLayerMutation,
  useCreateMeshLayerMutation,
  useCreatePointLayerMutation,
  useCreateRgbLayerMutation,
  useCreateTrackLayerMutation,
  useCreateVolumeLayerMutation,
} from "../api/graphql";
import {
  AnnotationCandidate,
  CandidateRow,
  Capabilities,
  MeshCandidate,
  Source,
  SpaceGroup,
  TableCandidate,
  groupCandidates,
  totalRows,
} from "./addLayer/candidates";

// The mutation options every layer creation submits with: the scene view
// reinitializes its stores when the GetScene result changes, so the new layer
// appears without any store plumbing.
const REFETCH_SCENE = {
  refetchQueries: ["GetScene"],
  awaitRefetchQueries: true,
};

const DIALOG_OPTIONS = {
  successMessage: "Layer added",
  errorPrefix: "Could not add layer",
};

// Beyond this many rows the spaces start collapsed: a stage frame can hold a
// hundred registered tiles, and a wall of them is not a picker.
const COLLAPSE_ABOVE = 40;

const kindButton = (active: boolean) =>
  `rounded border px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-input hover:bg-accent"
  }`;

/** What a row could become — "image", "points", "mesh". */
const Badge = (props: { children: string }) => (
  <span className="rounded-full border border-input px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
    {props.children}
  </span>
);

/**
 * One resident of one reachable space.
 *
 * A row that cannot become a layer is still drawn — an ArrayDataset is staged
 * through its lenses, a DataArray is a pyramid level of one — but as plain text
 * carrying its reason, so nobody clicks it and wonders why nothing happened.
 */
const CandidateRowView = (props: {
  row: CandidateRow;
  onSelect: (source: Source) => void;
}) => {
  const { row } = props;
  const Icon = RESIDENT_ICON[row.resident.__typename];
  const body = (
    <>
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{row.name}</div>
        {(row.secondary || row.disabledReason) && (
          <div className="truncate text-xs text-muted-foreground">
            {row.disabledReason ?? row.secondary}
          </div>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        {row.badges.map((badge) => (
          <Badge key={badge}>{badge}</Badge>
        ))}
      </div>
    </>
  );

  if (!row.source) {
    return (
      <div className="flex items-center gap-2 rounded border border-dashed border-input/60 p-2 opacity-60">
        {body}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => props.onSelect(row.source!)}
      className="flex w-full items-center gap-2 rounded border border-input p-2 text-left transition-colors hover:bg-accent"
    >
      {body}
    </button>
  );
};

/**
 * One space, with who lives in it. The header is the whole point of the grouped
 * shape: a candidate is offered BECAUSE its space has a path into the world, so
 * the space is named rather than left implicit.
 */
const SpaceSection = (props: {
  group: SpaceGroup;
  defaultOpen: boolean;
  onSelect: (source: Source) => void;
}) => {
  const { group } = props;
  // Uncontrolled on purpose: an open/closed section is a per-section gesture,
  // and the parent re-keys these on the collapse decision so a search reopens
  // them without an effect fighting the user's own clicks.
  const [open, setOpen] = useState(props.defaultOpen);

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setOpen((was) => !was)}
        className="flex items-center gap-1 text-left text-xs text-muted-foreground hover:text-foreground"
      >
        {open ? (
          <ChevronDown className="size-3" />
        ) : (
          <ChevronRight className="size-3" />
        )}
        <span className="font-medium uppercase tracking-wide">{group.name}</span>
        <span>· {group.label}</span>
        {group.isWorld && <span>{"· this scene's world"}</span>}
      </button>
      {open &&
        (group.rows.length ? (
          <div className="flex flex-col gap-1 pl-4">
            {group.rows.map((row) => (
              <CandidateRowView
                key={row.key}
                row={row}
                onSelect={props.onSelect}
              />
            ))}
          </div>
        ) : (
          <div className="pl-4 text-xs text-muted-foreground">
            nothing lives here — a frame to register into
          </div>
        ))}
    </div>
  );
};

/**
 * Step 2a: a lens becomes an image layer. Image layers hang off a lens, and the
 * chosen lens is the layer's source directly — no lens resolution needed.
 *
 * The kinds the server would refuse are disabled rather than offered and then
 * rejected: `asLayer` already answered which of IMAGE and LABEL this lens
 * qualifies for (§ AddLayerLensCapabilities).
 */
const LensLayerForm = (props: {
  scene: string;
  source: Extract<Source, { kind: "lens" }>;
  onBack: () => void;
}) => {
  const { image, label, lens } = props.source;
  const [kind, setKind] = useState<"INTENSITY" | "RGB" | "VOLUME" | "LABEL">(
    image ? "INTENSITY" : "LABEL",
  );

  const [createIntensity] = useCreateIntensityLayerMutation();
  const [createRgb] = useCreateRgbLayerMutation();
  const [createVolume] = useCreateVolumeLayerMutation();
  const [createLabel] = useCreateLabelLayerMutation();

  const submitIntensity = useGraphQLDialog(createIntensity, DIALOG_OPTIONS);
  const submitRgb = useGraphQLDialog(createRgb, DIALOG_OPTIONS);
  const submitVolume = useGraphQLDialog(createVolume, DIALOG_OPTIONS);
  const submitLabel = useGraphQLDialog(createLabel, DIALOG_OPTIONS);

  const form = useForm({
    defaultValues: { mode: ProjectionMode.Mip as string },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const base = { lens: lens.id, scene: props.scene };
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
          {(["INTENSITY", "RGB", "VOLUME", "LABEL"] as const).map((k) => {
            const allowed = k === "LABEL" ? label : image;
            return (
              <button
                key={k}
                type="button"
                disabled={!allowed}
                title={
                  allowed
                    ? undefined
                    : k === "LABEL"
                      ? "Requires a derivation declaring CATEGORIZED — the values became object ids"
                      : "Requires an x and a y axis of more than one pixel"
                }
                className={kindButton(kind === k)}
                onClick={() => setKind(k)}
              >
                {k.charAt(0) + k.slice(1).toLowerCase()}
              </button>
            );
          })}
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
 * Step 2b: a TableDataset becomes a point or track layer. The coordinate, time
 * and track-id columns are not chosen here: the server derives them from the
 * dataset's declared column schema. Only the styling columns — which have no
 * declared role to derive from — are picked.
 */
const TableLayerForm = (props: {
  scene: string;
  table: TableCandidate;
  onBack: () => void;
}) => {
  const columns = props.table.columns;
  // Same signal the picker badged the row with, re-read here rather than
  // threaded through: a table is trackable or not, in this form and that list.
  const trackable = columns.some((c) => c.role === TableColumnRole.TrackId);
  const [kind, setKind] = useState<"POINT" | "TRACK">("POINT");

  const [createPoint] = useCreatePointLayerMutation();
  const [createTrack] = useCreateTrackLayerMutation();
  const submitPoint = useGraphQLDialog(createPoint, DIALOG_OPTIONS);
  const submitTrack = useGraphQLDialog(createTrack, DIALOG_OPTIONS);

  const defaults = useMemo(
    () => ({
      colorColumn: columns.find((c) => c.role === TableColumnRole.Color)?.name ?? "",
      sizeColumn: "",
      pointSize: undefined as number | undefined,
      lineWidth: undefined as number | undefined,
    }),
    [columns],
  );

  const form = useForm({ defaultValues: defaults });

  const columnOptions = [
    { value: "", label: "None" },
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
    };
    if (kind === "POINT") {
      return submitPoint({
        variables: {
          input: {
            ...base,
            sizeColumn: orUndefined(data.sizeColumn),
            colorColumn: orUndefined(data.colorColumn),
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
          {kind === "POINT" ? (
            <>
              <ChoicesField
                name="colorColumn"
                label="Color column"
                options={columnOptions}
              />
              <ChoicesField
                name="sizeColumn"
                label="Size column"
                options={columnOptions}
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
                name="colorColumn"
                label="Color by column"
                options={columnOptions}
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

/**
 * Step 2c: a MeshCollection becomes a mesh layer. Its own coordinate system is
 * the layer's space — the picker only offered it because that space already has
 * a path to the world — so there is nothing spatial left to ask.
 *
 * Only the two knobs that change what you see on the first frame are here;
 * material color and color-by stay on the layer card, where the meshes are
 * visible while they are tuned.
 */
const MeshLayerForm = (props: {
  scene: string;
  mesh: MeshCandidate;
  onBack: () => void;
}) => {
  const [createMesh] = useCreateMeshLayerMutation();
  const submitMesh = useGraphQLDialog(createMesh, DIALOG_OPTIONS);

  const form = useForm({
    defaultValues: {
      wireframe: false,
      opacity: undefined as number | undefined,
    },
  });

  const onSubmit = form.handleSubmit(async (data) =>
    submitMesh({
      variables: {
        input: {
          scene: props.scene,
          meshCollection: props.mesh.id,
          wireframe: data.wireframe,
          opacity: data.opacity ?? undefined,
        },
      },
      ...REFETCH_SCENE,
    }),
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <SwitchField
            name="wireframe"
            label="Wireframe"
            description="Draw the edges instead of the surfaces"
          />
          <FloatField
            name="opacity"
            label="Opacity"
            description="Leave empty for the default"
          />
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

/**
 * Step 2d: an AnnotationCollection becomes an annotation layer.
 *
 * This is the path for adopting an EXISTING collection into a scene. Drawing a
 * new ROI in the viewport does not come through here: `createAnnotation` with a
 * scene mints the collection, its registration and the layer server-side (see
 * `interactions/useCreateSceneAnnotation.ts`).
 */
const AnnotationLayerForm = (props: {
  scene: string;
  collection: AnnotationCandidate;
  onBack: () => void;
}) => {
  const [createAnnotationLayer] = useCreateAnnotationLayerMutation();
  const submit = useGraphQLDialog(createAnnotationLayer, DIALOG_OPTIONS);

  const form = useForm({
    defaultValues: { opacity: undefined as number | undefined },
  });

  const onSubmit = form.handleSubmit(async (data) =>
    submit({
      variables: {
        input: {
          scene: props.scene,
          annotationCollection: props.collection.id,
          opacity: data.opacity ?? undefined,
        },
      },
      ...REFETCH_SCENE,
    }),
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <FloatField
          name="opacity"
          label="Opacity"
          description="Leave empty for the default"
        />

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

const stepDescription = (source: Source): string => {
  switch (source.kind) {
    case "lens":
      return `What kind of image layer should "${source.lens.dataset.name}" become?`;
    case "tabledataset":
      return `How should the rows of "${source.table.name}" be rendered?`;
    case "mesh":
      return `Add mesh collection ${source.mesh.version} to this scene.`;
    case "annotation":
      return `Draw the shapes of "${source.collection.name}" in this scene.`;
  }
};

const AddLayerFormInner = (props: { scene: string }) => {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<Source | null>(null);

  // Everything composable in this scene, in one round trip: the world, and every
  // space with a traversable path into it, each reporting who lives in it. The
  // set `placedSystems` answers with is the set `placeableIn` answers with, so
  // the picker and the create mutations cannot disagree about what is offerable.
  const { data, loading } = useAddLayerReachableQuery({
    variables: { scene: props.scene },
  });
  const world = data?.scene.worldCoordinateSystem;

  // Which of those lenses the server would draw, and which of them are labels.
  // Asked of the SPACE, not the scene: every scene over one world offers the
  // same candidates, so a scene-shaped argument would ask for more than the
  // answer depends on.
  const { data: capabilityData } = useAddLayerLensCapabilitiesQuery({
    variables: { space: world?.id ?? "" },
    skip: !world,
  });

  const capabilities: Capabilities = useMemo(
    () =>
      capabilityData
        ? {
            drawable: new Set(capabilityData.drawable.map((lens) => lens.id)),
            labels: new Set(capabilityData.labels.map((lens) => lens.id)),
          }
        : null,
    [capabilityData],
  );

  const groups = useMemo(
    () =>
      world
        ? groupCandidates({
            world,
            placedSystems: world.placedSystems,
            capabilities,
            search,
          })
        : [],
    [world, capabilities, search],
  );

  const expanded = !!search || totalRows(groups) <= COLLAPSE_ABOVE;

  return (
    <div className="flex flex-col gap-3">
      <DialogHeader>
        <DialogTitle>Add layer</DialogTitle>
        <DialogDescription>
          {source
            ? stepDescription(source)
            : world
              ? `Everything reachable from "${world.name}", the world "${data?.scene.name}" composes over.`
              : "Loading what this scene can reach…"}
        </DialogDescription>
      </DialogHeader>

      {source === null ? (
        <>
          <Input
            placeholder="Search spaces and what lives in them…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto">
            {groups.map((group) => (
              <SpaceSection
                key={`${group.id}:${expanded}`}
                group={group}
                defaultOpen={expanded}
                onSelect={setSource}
              />
            ))}
            {!loading && !groups.length && (
              <div className="text-xs text-muted-foreground">
                {search
                  ? "Nothing reachable matches that"
                  : "No space can reach this scene's world yet — register something into it first"}
              </div>
            )}
          </div>
        </>
      ) : source.kind === "lens" ? (
        <LensLayerForm
          scene={props.scene}
          source={source}
          onBack={() => setSource(null)}
        />
      ) : source.kind === "tabledataset" ? (
        <TableLayerForm
          scene={props.scene}
          table={source.table}
          onBack={() => setSource(null)}
        />
      ) : source.kind === "mesh" ? (
        <MeshLayerForm
          scene={props.scene}
          mesh={source.mesh}
          onBack={() => setSource(null)}
        />
      ) : (
        <AnnotationLayerForm
          scene={props.scene}
          collection={source.collection}
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
