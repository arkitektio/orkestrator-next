import { Eye, EyeOff, Waypoints } from "lucide-react";
import {
  STIMULATOR_COLOR,
  SYNAPSE_EXCITATORY_COLOR,
  SYNAPSE_INHIBITORY_COLOR,
} from "../lib/networkLayout";

export type NetworkControlProps = {
  show: boolean;
  onToggle: () => void;
  counts: { synapses: number; stimulators: number; connections: number };
  /** Synapses whose section couldn't be located (not drawn). */
  unmatched?: number;
  className?: string;
};

const Swatch = ({ color, label }: { color: string; label: string }) => (
  <span className="flex items-center gap-1">
    <span
      className="size-2 rounded-full"
      style={{ backgroundColor: color }}
    />
    <span className="text-white/70">{label}</span>
  </span>
);

/**
 * Small dark overlay pill for the 3D renderer's network layer: toggles the
 * synapses / stimulators / connections on and off, shows their counts, and a
 * tiny excitatory / inhibitory / source legend while shown.
 */
export const NetworkControl = ({
  show,
  onToggle,
  counts,
  unmatched = 0,
  className,
}: NetworkControlProps) => {
  const parts = [
    counts.synapses > 0 ? `${counts.synapses} synapses` : null,
    counts.connections > 0 ? `${counts.connections} connections` : null,
    counts.stimulators > 0 ? `${counts.stimulators} stimulators` : null,
  ].filter(Boolean);

  return (
    <div
      className={`flex flex-col gap-2 rounded-md border border-white/10 bg-black/60 p-2 text-white/80 backdrop-blur-md ${className ?? ""}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          title={show ? "Hide network layer" : "Show network layer"}
          className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
            show ? "bg-white/15 text-white ring-1 ring-white/30" : "hover:bg-white/10"
          }`}
        >
          <Waypoints className="size-3.5" />
          <span>Network</span>
          {show ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
        </button>
        <span className="text-[0.625rem] text-white/50">
          {parts.length > 0 ? parts.join(" · ") : "none"}
        </span>
      </div>

      {show && (counts.synapses > 0 || counts.stimulators > 0) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.625rem]">
          <Swatch color={SYNAPSE_EXCITATORY_COLOR} label="excitatory" />
          <Swatch color={SYNAPSE_INHIBITORY_COLOR} label="inhibitory" />
          <Swatch color={STIMULATOR_COLOR} label="stimulator" />
        </div>
      )}

      {unmatched > 0 && (
        <span className="text-[0.5625rem] text-amber-300/70">
          {unmatched} synapse{unmatched === 1 ? "" : "s"} without a matching
          section (not shown)
        </span>
      )}
    </div>
  );
};

export default NetworkControl;
