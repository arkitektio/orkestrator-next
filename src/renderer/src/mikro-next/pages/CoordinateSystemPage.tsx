import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useDialog } from "@/app/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MikroADataset,
  MikroCoordinateSystem,
  MikroTableDataset,
} from "@/linkers";
import { Ruler, Waypoints } from "lucide-react";
import { ReactNode } from "react";
import {
  CoordinateSystemFragment,
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
  spatialPixelSizes,
} from "../components/coordinates/pixelSize";
import {
  isReferenceFrame,
  residentLabel,
} from "../components/coordinates/residents";
import { AnyTransformation } from "../components/coordinates/types";
import AxesTable from "../components/tables/AxesTable";

/**
 * A coordinate system's page.
 *
 * A system no longer declares what it is — `residents` is the whole vocabulary,
 * and its emptiness is the only distinction the schema still draws. So the page
 * asks one of two questions:
 *
 *   nothing lives here   what is registered into me, how much do we trust it,
 *                        and which scenes have adopted me as their world?
 *   something lives here who lives here, what reaches me, and what I map into?
 *
 * The old PHYSICAL section survives as a pixel-size readout, gated on the edge
 * actually encoding per-axis factors rather than on a kind that no longer
 * exists — which is exactly the set of systems it used to fire for.
 */

/** Who lives in this space. Several may, and the frame case has none. */
const ResidentLink = (props: {
  resident: CoordinateSystemFragment["residents"][number];
}) => {
  const { resident } = props;
  switch (resident.__typename) {
    case "ADataset":
      return (
        <MikroADataset.DetailLink object={resident}>
          {resident.name}
        </MikroADataset.DetailLink>
      );
    case "TableDataset":
      return (
        <MikroTableDataset.DetailLink object={resident}>
          {resident.name}
        </MikroTableDataset.DetailLink>
      );
    case "AnnotationCollection":
      // No @mikro/annotationcollection linker exists, so it names itself.
      return <span>{resident.name}</span>;
    case "Lens":
      // A lens has no name of its own, so it borrows its dataset's.
      return (
        <span>
          a lens of{" "}
          <MikroADataset.DetailLink object={resident.dataset}>
            {resident.dataset.name}
          </MikroADataset.DetailLink>
        </span>
      );
    case "DataArray":
      // A DataArray has neither a name nor a back-reference to its dataset.
      return <span>pyramid level {resident.level}</span>;
    case "MeshCollection":
      return <span>mesh collection {resident.version}</span>;
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

    // Nothing lives here: a world, an atlas — a space built to be registered
    // into rather than to hold anything of its own.
    const isFrame = isReferenceFrame(system);

    // A calibration is reached from the space it calibrates by exactly one
    // edge, and that edge's parameters ARE the pixel size. There is no PHYSICAL
    // kind left to gate on, so gate on what actually made those systems
    // different: this space's axes CARRY UNITS, and something scales into it.
    // Units are the test rather than "has a scale edge" because a pyramid level
    // maps into its dataset's grid by a scale too — but into unitless pixels,
    // which is a resolution, not a pixel size.
    // SPACE axes only: a calibration edge scales the time and spectral axes
    // too, but those are sampling intervals rather than the extent of a voxel,
    // and listing them under "Pixel size" claims a geometry that is not there.
    const calibrationEdge = inbound[0];
    const pixelSizes = spatialPixelSizes(
      pixelSizeEntries(calibrationEdge as PixelSizeEdge, system.axes),
    );
    const isCalibration = pixelSizes.some((entry) => entry.unit);
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

    // Calibration is a property of the DATASET, not of the space it lives in —
    // the form takes a dataset id — so this only appears when a dataset is one
    // of the residents.
    const calibrateDataset = system.residents.find(
      (resident) => resident.__typename === "ADataset",
    );
    const calibrateButton = calibrateDataset ? (
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          openDialog(
            "calibrate",
            { dataset: calibrateDataset.id },
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
        pageActions={isFrame ? registerButton : calibrateButton}
      >
        <div className="flex flex-col gap-3 p-3">
          <div className="flex flex-row flex-wrap items-center gap-2">
            <MikroCoordinateSystem.DetailLink object={system} className="text-3xl">
              {system.name}
            </MikroCoordinateSystem.DetailLink>
            {/* What this space is, said the only way the schema still says it:
                by who lives in it. */}
            <Badge
              variant="outline"
              title={
                isFrame
                  ? "Nothing lives in this space. Sources register into it and scenes adopt it as their world; it outlives every scene over it."
                  : "The data living in this space."
              }
            >
              {residentLabel(system)}
            </Badge>
          </div>

          <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-mono">
              {[...system.axes]
                .sort((a, b) => a.order - b.order)
                .map((axis) => axis.name)
                .join(" ")}
            </span>
            {/* The residents are not repeated here — the badge above names the
                one that matters, and the Residents section below links them
                all. */}
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

          {isFrame ? (
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
                empty="Nothing is registered into this space yet. Register a dataset, table or another space to place it here."
              />
            </Section>
          ) : (
            <Section title="Residents">
              <div className="flex flex-col gap-1 text-sm">
                {system.residents.map((resident) => (
                  <div key={`${resident.__typename}-${resident.id}`}>
                    <ResidentLink resident={resident} />
                    <span className="ml-2 text-xs text-muted-foreground">
                      {resident.__typename}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {isCalibration && calibrationEdge && (
            <Section title="Pixel size">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row flex-wrap items-center gap-3">
                  {pixelSizes.map((entry) => (
                    <span key={entry.axis} className="font-mono text-sm">
                      {formatPixelSize(entry)}
                    </span>
                  ))}
                </div>
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
            </Section>
          )}

          {!isFrame && (
            <>
              <Section title="Reached from">
                <EdgeTable
                  edges={inbound}
                  direction="in"
                  empty="Nothing maps into this space."
                />
              </Section>
              <Section title="Maps into" action={calibrateButton}>
                <EdgeTable
                  edges={outbound}
                  direction="out"
                  empty="Nothing is derived from this space: it has no calibration and no registration. Its geometry is only expressed in its own coordinates."
                />
              </Section>
            </>
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

          {isFrame && (
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
