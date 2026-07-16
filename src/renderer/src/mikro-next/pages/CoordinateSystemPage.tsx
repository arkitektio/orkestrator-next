import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useDialog } from "@/app/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MikroADataset,
  MikroCoordinateSystem,
  MikroScene,
  MikroTableDataset,
} from "@/linkers";
import { Ruler, Waypoints } from "lucide-react";
import { ReactNode } from "react";
import {
  CoordinateSystemFragment,
  CoordinateSystemKind,
  useGetCoordinateGraphQuery,
  useGetCoordinateSystemQuery,
} from "../api/graphql";
import SceneCard from "../components/cards/SceneCard";
import CoordinateGraphView from "../components/coordinates/CoordinateGraphView";
import EdgeTable, {
  assumedCount,
  ValidityBadge,
} from "../components/coordinates/EdgeTable";
import {
  PixelSizeEdge,
  formatPixelSize,
  pixelSizeEntries,
} from "../components/coordinates/pixelSize";
import { AnyTransformation } from "../components/coordinates/types";
import AxesTable from "../components/tables/AxesTable";

/**
 * A coordinate system's page.
 *
 * `kind` makes four genuinely different objects — a dataset's pixel grid, a
 * pyramid level's voxel grid, a calibration, an atlas hub — and the page asks
 * each one the question it actually has:
 *
 *   SHARED    what is registered into me, and how much do we trust it?
 *   INTRINSIC what has been derived from these pixels?
 *   PHYSICAL  what is the pixel size, and who says so?
 *   ARRAY     what am I a slice of?
 */

/** `kind` says what a system denotes; `owner` says whose it is. */
const OwnerLink = (props: {
  owner: NonNullable<CoordinateSystemFragment["owner"]>;
}) => {
  const { owner } = props;
  switch (owner.__typename) {
    case "ADataset":
      return (
        <MikroADataset.DetailLink object={owner}>
          {owner.name}
        </MikroADataset.DetailLink>
      );
    case "TableDataset":
      return (
        <MikroTableDataset.DetailLink object={owner}>
          {owner.name}
        </MikroTableDataset.DetailLink>
      );
    case "Scene":
      return (
        <MikroScene.DetailLink object={owner}>{owner.name}</MikroScene.DetailLink>
      );
    case "Lens":
      // A lens has no name of its own, so it borrows its dataset's.
      return (
        <span>
          a lens of{" "}
          <MikroADataset.DetailLink object={owner.dataset}>
            {owner.dataset.name}
          </MikroADataset.DetailLink>
        </span>
      );
    case "DataArray":
      // A DataArray has neither a name nor a back-reference to its dataset.
      return <span>pyramid level {owner.level}</span>;
    case "MeshCollection":
      return <span>mesh collection {owner.version}</span>;
    default:
      return null;
  }
};

const Section = (props: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex flex-row items-center justify-between gap-2">
        <span>{props.title}</span>
        {props.action}
      </CardTitle>
    </CardHeader>
    <CardContent>{props.children}</CardContent>
  </Card>
);

export const CoordinateSystemPage = asDetailQueryRoute(
  useGetCoordinateSystemQuery,
  ({ data }) => {
    const system = data.coordinateSystem;
    const { openDialog } = useDialog();

    // The same query CoordinateGraphView fires below — Apollo dedupes it, so
    // the edges cost nothing extra. The list queries deliberately cannot answer
    // "which edges relate to THIS system" (relatedness is transitive); the
    // graph walk is the schema's own answer, so partition its result rather
    // than adding a transformations(filters:) round trip.
    const { data: graphData } = useGetCoordinateGraphQuery({
      variables: { coordinateSystem: system.id },
    });

    const edges: AnyTransformation[] = graphData?.coordinateGraph.transformations ?? [];
    const inbound = edges.filter((edge) => edge?.output?.id === system.id);
    const outbound = edges.filter((edge) => edge?.input?.id === system.id);

    const isShared = system.kind === CoordinateSystemKind.Shared;
    const isIntrinsic = system.kind === CoordinateSystemKind.Intrinsic;
    const isPhysical = system.kind === CoordinateSystemKind.Physical;
    const isArray = system.kind === CoordinateSystemKind.Array;

    // A calibration is reached from the intrinsic grid by exactly one edge, and
    // that edge's parameters ARE the pixel size.
    const calibrationEdge = isPhysical ? inbound[0] : undefined;
    const pixelSizes = pixelSizeEntries(
      calibrationEdge as PixelSizeEdge,
      system.axes,
    );
    const assumed = assumedCount(inbound);

    const registerButton = (
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          openDialog("register", { target: system.id }, { className: "max-w-3xl" })
        }
      >
        <Waypoints className="mr-2 h-4 w-4" />
        Register…
      </Button>
    );

    // Calibration is a property of the DATASET, not of its pixel grid — the
    // mutation takes a dataset id — so this only appears when the owner is one.
    const calibrateOwner =
      isIntrinsic && system.owner?.__typename === "ADataset"
        ? system.owner
        : undefined;
    const calibrateButton = calibrateOwner ? (
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          openDialog(
            "calibrate",
            { dataset: calibrateOwner.id },
            { className: "max-w-2xl" },
          )
        }
      >
        <Ruler className="mr-2 h-4 w-4" />
        Calibrate…
      </Button>
    ) : undefined;

    return (
      <MikroCoordinateSystem.ModelPage
        object={system}
        title={system.name}
        actions={<MikroCoordinateSystem.Actions object={system} />}
        pageActions={isShared ? registerButton : calibrateButton}
      >
        <div className="flex flex-col gap-3 p-3">
          <div className="flex flex-row flex-wrap items-center gap-2">
            <MikroCoordinateSystem.DetailLink object={system} className="text-3xl">
              {system.name}
            </MikroCoordinateSystem.DetailLink>
            <Badge variant="outline">{system.kind}</Badge>
            {/* Both a hub and a scene's world are SHARED, so `kind` alone
                cannot tell them apart — `isHub` is the server's own answer. */}
            {system.isHub && (
              <Badge
                variant="secondary"
                title="An ownerless shared space, built to be registered into. It outlives every scene composed over it."
              >
                hub
              </Badge>
            )}
          </div>

          <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-mono">
              {[...system.axes]
                .sort((a, b) => a.order - b.order)
                .map((axis) => axis.name)
                .join(" ")}
            </span>
            {system.owner && (
              <span>
                of <OwnerLink owner={system.owner} />
              </span>
            )}
            {/* Only meaningful for a calibrated system with a TIME axis. An
                unanchored clock is not a defect: the time axis is still a
                perfectly composable relative coordinate. */}
            {system.axes.some((axis) => axis.type === "TIME") &&
              (system.epoch ? (
                <span title="wall_clock = epoch + t * unit">
                  t=0 ≙ {new Date(system.epoch).toISOString()}
                </span>
              ) : (
                <span title="The time axis is still a perfectly composable relative coordinate.">
                  clock unanchored
                </span>
              ))}
          </div>

          {isShared && (
            <Section
              title="Registered sources"
              action={
                <div className="flex items-center gap-2">
                  {assumed > 0 && (
                    <span className="text-xs font-normal text-destructive">
                      {assumed} of {inbound.length}{" "}
                      {inbound.length === 1 ? "placement is" : "placements are"}{" "}
                      still an assumption
                    </span>
                  )}
                  {registerButton}
                </div>
              }
            >
              <EdgeTable
                edges={inbound}
                direction="in"
                empty={
                  system.isHub
                    ? "Nothing is registered into this hub yet. Register a dataset, table or another space to place it here."
                    : "Nothing is registered into this world yet."
                }
              />
            </Section>
          )}

          {isPhysical && (
            <Section title="Pixel size">
              {calibrationEdge ? (
                <div className="flex flex-col gap-2">
                  {pixelSizes.length > 0 ? (
                    <div className="flex flex-row flex-wrap items-center gap-3">
                      {pixelSizes.map((entry) => (
                        <span key={entry.axis} className="font-mono text-sm">
                          {formatPixelSize(entry)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      This calibration is a {calibrationEdge.kind} edge, which
                      states no per-axis pixel size.
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>maps from</span>
                    {calibrationEdge.input && (
                      <MikroCoordinateSystem.DetailLink
                        object={calibrationEdge.input}
                      >
                        {calibrationEdge.input.name}
                      </MikroCoordinateSystem.DetailLink>
                    )}
                    {calibrationEdge.validity && (
                      <ValidityBadge validity={calibrationEdge.validity} />
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No edge into this calibration was found in the graph walk.
                </div>
              )}
            </Section>
          )}

          {(isIntrinsic || isArray) && (
            <Section
              title={isArray ? "Maps into" : "Derived from these pixels"}
              action={isIntrinsic ? calibrateButton : undefined}
            >
              <EdgeTable
                edges={outbound}
                direction="out"
                empty={
                  isArray
                    ? "This grid maps nowhere yet."
                    : "Nothing is derived from this pixel grid: it has no calibration and no registration. Its geometry is only expressed in pixels."
                }
              />
            </Section>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Coordinate graph</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] p-0">
              <CoordinateGraphView coordinateSystem={system.id} />
            </CardContent>
          </Card>

          <Section title="Axes">
            <AxesTable axes={system.axes} />
          </Section>

          {isShared && (
            <Section title="Scenes">
              {system.scenes.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No scenes use this coordinate system as their world yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {system.scenes.map((scene) => (
                    <SceneCard key={scene.id} scene={scene} />
                  ))}
                </div>
              )}
            </Section>
          )}
        </div>
      </MikroCoordinateSystem.ModelPage>
    );
  },
);

export default CoordinateSystemPage;
