import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { useRoiDrawingStore } from "../store/roiDrawingStore";
import { MAX_TRACE_COST, type TraceWeights } from "../core/trace/traceCost";

/**
 * What the TRACE search treats as cheap, while it is the active tool.
 *
 * These are exposed rather than tuned once and hidden because there is no
 * universally right answer: what reads as "the structure" depends on the data.
 * A weight is how much cost the worst voxel in the box adds under that term, so
 * the numbers are comparable with each other and with the search's own
 * shortest-path pull — turning them all down gives a straight line, turning one
 * up makes that term decide the route.
 *
 * Edits land in the store immediately and the NEXT hop uses them; hops already
 * traced are left alone, so a chain can deliberately change character part-way.
 */

const SLIDERS: {
  key: Exclude<keyof TraceWeights, "invert">;
  label: string;
  hint: string;
}[] = [
  { key: "intensity", label: "Bright", hint: "follow bright voxels" },
  { key: "gradient", label: "Edges", hint: "follow boundaries" },
  { key: "straightness", label: "Straight", hint: "resist detours" },
];

export const TraceWeightsPanel = () => {
  const weights = useRoiDrawingStore((s) => s.traceWeights);
  const setTraceWeights = useRoiDrawingStore((s) => s.setTraceWeights);

  return (
    <div className="pointer-events-auto flex flex-col gap-1 rounded-md bg-background/80 px-2 py-1.5 shadow-md backdrop-blur-sm">
      {SLIDERS.map(({ key, label, hint }) => (
        <div key={key} className="flex items-center gap-2" title={hint}>
          <span className="w-12 select-none text-right text-[10px] font-medium uppercase text-muted-foreground">
            {label}
          </span>
          <div className="w-32">
            <Slider
              min={0}
              max={MAX_TRACE_COST}
              step={0.05}
              value={[weights[key]]}
              onValueChange={([value]) => setTraceWeights({ [key]: value })}
            />
          </div>
          <span className="w-8 select-none text-[10px] tabular-nums text-muted-foreground">
            {weights[key].toFixed(2)}
          </span>
        </div>
      ))}
      <Toggle
        size="sm"
        pressed={weights.invert}
        onPressedChange={(invert) => setTraceWeights({ invert })}
        className="h-6 text-[10px]"
        title="Trace dark structures on a bright background"
      >
        Invert
      </Toggle>
    </div>
  );
};
