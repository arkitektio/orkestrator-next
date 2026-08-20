import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MikroCoordinateSystem } from "@/linkers";
import { describeTransformation } from "@/mikro-next/components/coordinates/types";
import { ChevronRight, Waypoints } from "lucide-react";
import { LayerState, useSceneStore } from "../stores/sceneStore";

type SystemRef = { id: string; name?: string | null };

/** A pill linking out to a coordinate system's detail page. */
const SystemPill = ({
  system,
  title,
}: {
  system: SystemRef;
  title?: string;
}) => (
  <MikroCoordinateSystem.DetailLink
    object={{ id: system.id }}
    title={title}
    className="shrink-0 rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/85 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
  >
    {system.name ?? system.id}
  </MikroCoordinateSystem.DetailLink>
);

const Header = () => (
  <div className="text-[9px] uppercase tracking-widest text-white/40">
    Placement
  </div>
);

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-1 px-1 py-1">
    <Header />
    <div className="flex flex-wrap items-center gap-1">{children}</div>
  </div>
);

/**
 * The layer's placement path, made navigable: every coordinate system it passes
 * through on its way from the lens' own space into the scene's world, linked to
 * its detail page, with the edge between each pair labelled by what it does.
 *
 * The systems come out of `pathToWorld`, the server-resolved walk the renderer
 * already composes its matrix from (`transformGraph.ts`) — so this is the same
 * chain the pixels actually travel, not a second derivation of it. A step is
 * walked output→input when `inverted`, which is why the next system in the
 * chain is the edge's INPUT in that case.
 */
export const PlacementChain = ({ layer }: { layer: LayerState }) => {
  const world = useSceneStore(
    (state) => state.transformContext.worldCoordinateSystem,
  );

  const source = layer.lens.coordinateSystem;
  const steps = layer.pathToWorld;

  if (!source) return null;

  // null = this layer is not registered into the world at all. It still has a
  // source space worth linking to, so the chain degrades to that one pill.
  if (!steps) {
    return (
      <Section>
        <SystemPill system={source} title="This layer's source space" />
        <span className="text-[10px] text-amber-300/80">
          not registered into the world
        </span>
      </Section>
    );
  }

  const links = steps.flatMap((step) => {
    const next = step.inverted
      ? step.transformation.input
      : step.transformation.output;
    return next ? [{ step, system: next }] : [];
  });

  return (
    <Section>
      <SystemPill system={source} title="This layer's source space" />
      {links.map(({ step, system }) => (
        <div key={step.transformation.id} className="flex items-center gap-1">
          <span
            className="flex shrink-0 items-center text-[9px] text-white/40"
            title={`${step.transformation.kind}${step.inverted ? " (walked backwards, so the renderer inverts it)" : ""}`}
          >
            <ChevronRight className="h-3 w-3" />
            {describeTransformation(step.transformation)}
            {step.inverted && <span className="ml-0.5">⁻¹</span>}
            <ChevronRight className="h-3 w-3" />
          </span>
          <SystemPill system={system} />
        </div>
      ))}
      {/* [] = the layer's source space IS the world, so no edge precedes it. */}
      {links.length === 0 && world && world.id !== source.id && (
        <SystemPill system={world} title="The scene's world space" />
      )}
    </Section>
  );
};

/**
 * The placement chain on demand. Which coordinate systems a layer travels
 * through is reference material — worth reaching in one click when a layer
 * lands somewhere unexpected, not worth the vertical space it took in every
 * unfolded card. The popover carries its own dark surface because the chain is
 * scene chrome (white-on-black pills), not themed form UI.
 */
export const PlacementPopover = ({ layer }: { layer: LayerState }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        className="flex items-center gap-1 self-start rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/50 transition-colors hover:border-white/25 hover:text-white/90"
        title="Which coordinate systems this layer passes through on its way into the scene's world"
        onClick={(e) => e.stopPropagation()}
      >
        <Waypoints className="h-3 w-3" />
        Placement
      </button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      className="w-72 border-white/10 bg-black/90 p-2 text-white/85 backdrop-blur-md"
    >
      <PlacementChain layer={layer} />
    </PopoverContent>
  </Popover>
);

export default PlacementChain;
