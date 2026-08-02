import { formatDisplay } from "@/lib/quantities";
import type {
  FullCoordinateAnchorFragment,
  LightpathGraphFragment,
} from "@/mikro-next/api/graphql";
import { useGetLensAnchorsQuery } from "@/mikro-next/api/graphql";
import { LightPathListView } from "@/mikro-next/components/lightpath/LightPathListView";
import { Tags } from "lucide-react";
import { useMemo, useState } from "react";
import {
  type AnchorMatch,
  describePins,
  layerCoverage,
  matchAnchor,
} from "../../core/anchorVisibility";
import { LayerState } from "../../store/sceneStore";
import { useViewerStore } from "../../store/viewerStore";

/**
 * The acquisition truth pinned to what this layer is currently showing.
 *
 * A dataset's `CoordinateAnchor`s pin metadata — the channel's name, its value
 * distribution, the light path it came down, the microscope state at the moment
 * of acquisition — to specific coordinates. Which of them describe the pixels on
 * screen depends on the channel toggles and the dim sliders, so the panel splits
 * them live (`core/anchorVisibility.ts` owns that rule) and shows only the ones
 * in view. The rest stay one click away rather than vanishing, because "there IS
 * a light path, just not for this timepoint" is a different answer from "no light
 * path was ever recorded".
 *
 * This sits in the card body, unfolded with the card, rather than behind a
 * click: which channel a layer is and what light made it is the first thing you
 * want when a layer looks wrong, unlike the placement chain next to it, which is
 * only interesting when a layer lands somewhere unexpected.
 *
 * The scene payload already carries a thin projection of these anchors (the
 * histogram the clim comes from, the label the row shows), so the section draws
 * the instant the card unfolds; `GetLensAnchors` then fills in the microscope
 * state and phasor facts that are far too heavy to ride along with every scene
 * load. The query mounts with the section, and `CollapsibleContent` unmounts a
 * folded card — so a scene of twenty layers still fetches only what is open.
 */

/**
 * What the panel renders. Structural, so both the thin `SceneLens.activeAnchors`
 * projection and the full `FullCoordinateAnchorFragment` satisfy it — the panel
 * degrades field by field rather than switching modes.
 */
type PanelAnchor = {
  id: string;
  coordinates: unknown;
  channelLabel?: { label: string } | null;
  valueHistogram?: {
    bins: number[];
    histogram: number[];
    min?: number | null;
    max?: number | null;
    p1?: number | null;
    p99?: number | null;
  } | null;
  lightGraph?: { graph: LightpathGraphFragment } | null;
  microscope?: FullCoordinateAnchorFragment["microscope"];
  phasorCalibrations?: FullCoordinateAnchorFragment["phasorCalibrations"];
  phasorHistograms?: FullCoordinateAnchorFragment["phasorHistograms"];
};

const Header = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[9px] uppercase tracking-widest text-white/40">
    {children}
  </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-baseline gap-1.5">
    <span className="shrink-0 text-white/40">{label}</span>
    <span className="min-w-0 truncate font-mono text-white/85">{value}</span>
  </div>
);

/** Read-only shape of a value distribution — reference, not a levels editor. */
const HistogramSparkline = ({
  histogram,
}: {
  histogram: readonly number[];
}) => {
  // reduce, not Math.max(...bins): a fine-grained histogram would blow the
  // argument limit.
  const peak = histogram.reduce((best, count) => Math.max(best, count), 1);
  const step = 100 / Math.max(1, histogram.length);
  return (
    <svg
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      className="h-6 w-full rounded-sm bg-white/5"
      aria-hidden
    >
      {histogram.map((count, index) => {
        const height = (count / peak) * 24;
        return (
          <rect
            key={index}
            x={index * step}
            y={24 - height}
            width={step}
            height={height}
            className="fill-white/50"
          />
        );
      })}
    </svg>
  );
};

const ValueHistogramSpoke = ({
  histogram,
}: {
  histogram: NonNullable<PanelAnchor["valueHistogram"]>;
}) => {
  const limits = [
    histogram.min != null && `min ${histogram.min}`,
    histogram.max != null && `max ${histogram.max}`,
    histogram.p1 != null && `p1 ${histogram.p1}`,
    histogram.p99 != null && `p99 ${histogram.p99}`,
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-1">
      <Header>Values</Header>
      {histogram.histogram.length > 0 && (
        <HistogramSparkline histogram={histogram.histogram} />
      )}
      {limits.length > 0 && (
        <div className="font-mono text-[9px] text-white/50">
          {limits.join(" · ")}
        </div>
      )}
    </div>
  );
};

/**
 * A `Setting` is a tagged union by which field is non-null — render whichever
 * one the server filled, and say nothing rather than "null" when none is.
 */
const settingValue = (
  setting: NonNullable<
    FullCoordinateAnchorFragment["microscope"]
  >["state"]["devices"][number]["settings"][number],
): string | null => {
  if (setting.quantity != null) return formatDisplay(setting.quantity);
  if (setting.text != null && setting.text !== "") return setting.text;
  if (setting.number != null) return String(setting.number);
  if (setting.flag != null) return setting.flag ? "on" : "off";
  return null;
};

const MicroscopeSpoke = ({
  microscope,
}: {
  microscope: NonNullable<FullCoordinateAnchorFragment["microscope"]>;
}) => {
  const { stage, temperature, devices } = microscope.state;
  const stagePose = stage
    ? [stage.x, stage.y, stage.z]
        .map((axis) => formatDisplay(axis, "length"))
        .join(" / ")
    : null;

  return (
    <div className="flex flex-col gap-1">
      <Header>Microscope</Header>
      {stagePose && <Row label="stage" value={stagePose} />}
      {temperature != null && (
        <Row label="temp" value={formatDisplay(temperature)} />
      )}
      {devices.map((device) => {
        const settings = device.settings
          .map((setting) => {
            const value = settingValue(setting);
            return value === null ? null : `${setting.name} ${value}`;
          })
          .filter((entry): entry is string => entry !== null);
        return (
          <div key={`${device.kind ?? ""}:${device.label}`} className="pl-1">
            <Row
              label={device.kind ?? "device"}
              value={
                <>
                  {device.label}
                  {settings.length > 0 && (
                    <span className="text-white/45"> · {settings.join(" · ")}</span>
                  )}
                </>
              }
            />
          </div>
        );
      })}
    </div>
  );
};

const PhasorSpoke = ({ anchor }: { anchor: PanelAnchor }) => {
  const calibrations = anchor.phasorCalibrations ?? [];
  const histograms = anchor.phasorHistograms ?? [];
  if (calibrations.length === 0 && histograms.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      <Header>Phasor</Header>
      {calibrations.map((calibration) => (
        <Row
          key={calibration.id}
          label={`h${calibration.harmonic} cal`}
          value={[
            calibration.phaseOffset != null &&
              `φ ${calibration.phaseOffset.toFixed(3)}`,
            calibration.modulationFactor != null &&
              `m ${calibration.modulationFactor.toFixed(3)}`,
            calibration.reference,
          ]
            .filter(Boolean)
            .join(" · ")}
        />
      ))}
      {histograms.map((histogram) => (
        <Row
          key={histogram.id}
          label={`h${histogram.harmonic} dist`}
          value={`${histogram.axis} · ${histogram.bins}² bins · ${
            histogram.calibrated ? "calibrated" : "uncalibrated"
          }${histogram.total != null ? ` · n=${histogram.total}` : ""}`}
        />
      ))}
    </div>
  );
};

/** One in-view anchor: its pins, then whichever metadata spokes it carries. */
const ActiveAnchor = ({
  anchor,
  match,
}: {
  anchor: PanelAnchor;
  match: AnchorMatch;
}) => {
  const pins = describePins(match.pins);
  const hasSpokes =
    Boolean(anchor.channelLabel) ||
    Boolean(anchor.valueHistogram) ||
    Boolean(anchor.lightGraph) ||
    Boolean(anchor.microscope) ||
    (anchor.phasorCalibrations?.length ?? 0) > 0 ||
    (anchor.phasorHistograms?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-1.5 rounded border border-white/10 bg-white/[0.03] p-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] text-white/85">
          {pins || "everywhere"}
        </span>
        {anchor.channelLabel?.label && (
          <span className="shrink-0 rounded border border-white/15 bg-white/5 px-1 py-px text-[9px] text-white/85">
            {anchor.channelLabel.label}
          </span>
        )}
      </div>

      {anchor.valueHistogram && (
        <ValueHistogramSpoke histogram={anchor.valueHistogram} />
      )}

      {anchor.lightGraph && (
        <div className="flex flex-col gap-1">
          <Header>Light path</Header>
          {/* LightPathListView styles itself with themed tokens rather than the
              scene's white-on-black chrome. They read correctly on this
              near-black surface in the dark theme, and the wrapper sets the
              inherited color so they do in the light theme too. */}
          <div className="text-white/85">
            <LightPathListView graph={anchor.lightGraph.graph} />
          </div>
        </div>
      )}

      {anchor.microscope && <MicroscopeSpoke microscope={anchor.microscope} />}

      <PhasorSpoke anchor={anchor} />

      {!hasSpokes && (
        <span className="text-[9px] text-white/40">no metadata recorded</span>
      )}
    </div>
  );
};

/**
 * The anchors that exist but describe something else. Worth listing: a missing
 * light path and a light path for another channel look identical otherwise.
 */
const OutOfView = ({
  entries,
}: {
  entries: { anchor: PanelAnchor; match: AnchorMatch }[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <button
        className="self-start text-[9px] uppercase tracking-widest text-white/40 transition-colors hover:text-white/70"
        onClick={() => setOpen((previous) => !previous)}
      >
        {entries.length} anchor{entries.length === 1 ? "" : "s"} out of view
      </button>
      {open &&
        entries.map(({ anchor, match }) => (
          <div key={anchor.id} className="flex flex-wrap gap-1 pl-1">
            {match.pins.map((pin) => (
              <span
                key={pin.axis}
                className={
                  pin.met
                    ? "rounded border border-white/10 px-1 font-mono text-[9px] text-white/45"
                    : "rounded border border-amber-400/30 bg-amber-400/10 px-1 font-mono text-[9px] text-amber-300/90"
                }
                title={pin.met ? undefined : `showing ${pin.current}`}
              >
                {pin.axis}={pin.value ?? "?"}
                {!pin.met && (
                  <span className="text-amber-300/60"> ≠ {pin.current}</span>
                )}
              </span>
            ))}
            {anchor.channelLabel?.label && (
              <span className="text-[9px] text-white/40">
                {anchor.channelLabel.label}
              </span>
            )}
          </div>
        ))}
    </div>
  );
};

export const AnchorMetadata = ({
  layer,
  anchors,
  loading,
}: {
  layer: LayerState;
  anchors: readonly PanelAnchor[];
  loading: boolean;
}) => {
  // The dim sliders move under us — re-partition on every selection change so
  // the panel never claims metadata for a slice that scrolled off.
  const dimSelections = useViewerStore((state) => state.dimSelections);

  const { active, hidden } = useMemo(() => {
    const coverage = layerCoverage(layer, dimSelections);
    const active: { anchor: PanelAnchor; match: AnchorMatch }[] = [];
    const hidden: { anchor: PanelAnchor; match: AnchorMatch }[] = [];
    for (const anchor of anchors) {
      const match = matchAnchor(anchor.coordinates, coverage);
      (match.satisfied ? active : hidden).push({ anchor, match });
    }
    return { active, hidden };
  }, [anchors, layer, dimSelections]);

  // A dataset with no anchors is the common case, not a fault worth a row of
  // chrome on every layer card. Say nothing.
  if (anchors.length === 0) return null;

  return (
    <div className="flex max-h-64 min-w-0 flex-col gap-1.5 overflow-y-auto text-[10px]">
      {active.length === 0 ? (
        <span className="text-white/40">
          Nothing anchored to what this layer is showing.
        </span>
      ) : (
        active.map(({ anchor, match }) => (
          <ActiveAnchor key={anchor.id} anchor={anchor} match={match} />
        ))
      )}
      {hidden.length > 0 && <OutOfView entries={hidden} />}
      {loading && <span className="text-[9px] text-white/30">Loading…</span>}
    </div>
  );
};

/**
 * The metadata section of an unfolded layer card. The full payload (microscope
 * state, phasor facts) is fetched when the card unfolds; until it lands, the
 * thin `SceneLens` projection already in the scene stands in, so the section
 * never flashes empty and then fills.
 */
export const MetadataSection = ({ layer }: { layer: LayerState }) => {
  const { data, loading } = useGetLensAnchorsQuery({
    variables: { id: layer.lens.id },
    fetchPolicy: "cache-first",
  });

  const anchors: readonly PanelAnchor[] =
    data?.lens.activeAnchors ?? layer.lens.activeAnchors;

  if (anchors.length === 0) return null;

  return (
    <div className="flex min-w-0 flex-col gap-1 px-1 py-1">
      <Header>
        <span className="flex items-center gap-1">
          <Tags className="h-2.5 w-2.5" />
          Metadata
        </span>
      </Header>
      <AnchorMetadata layer={layer} anchors={anchors} loading={loading} />
    </div>
  );
};

export default MetadataSection;
