import React from "react";
import { useExperimentViewerStore } from "./store/experimentViewerStore";

export const ExperimentHoverTooltip: React.FC = () => {
  const hover = useExperimentViewerStore((s) => s.hover);

  if (!hover) return null;

  return (
    <div className="absolute left-2 top-2 z-10 min-w-[10rem] rounded-lg border border-border/50 bg-background/95 px-3 py-2 text-xs shadow-sm backdrop-blur-sm">
      <div className="font-medium">t: {hover.time.toFixed(3)}</div>
      <div className="mt-1 flex flex-col gap-1">
        {hover.values.map((entry) => (
          <div
            key={entry.label}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.label}
            </span>
            <span className="font-mono text-foreground tabular-nums">
              {entry.value == null ? "-" : entry.value.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
