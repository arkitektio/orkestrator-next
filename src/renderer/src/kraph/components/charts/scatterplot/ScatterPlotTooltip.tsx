"use client";

import {
  ScatterPlotFragment
} from "@/kraph/api/graphql";
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { MiniWidget } from "../MiniWidget";

// Top-level exported tooltip component for the scatter plot. Recharts will
// render this component and pass in `active` and `payload` as props; we also
// accept the `scatterPlot` so the tooltip can show the selected column names.
// `graphId` is passed down from `ScatterPlot` (fetched via `renderGraphTable`),
// since `ScatterPlotFragment` itself doesn't carry the graph `MiniWidget` needs.
// It was `graphAgeName`: the AGE namespace is random and internal now, read only
// by the engine — `graph:` takes the primary key and never the handle.
export const ScatterPlotTooltip: React.FC<
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
    scatterPlot: ScatterPlotFragment;
    graphId?: string;
  }
> = ({ active, payload, scatterPlot, graphId }) => {
  if (!active || !payload || !payload.length) return null;

  const xVal = payload.find(
    (p: any) => p.dataKey === scatterPlot.xColumn,
  )?.value;
  const yVal = payload.find(
    (p: any) => p.dataKey === scatterPlot.yColumn,
  )?.value;

  const idVal = payload.at(0)?.payload[scatterPlot.idColumn || ""];

  return (
    <div className="grid min-w-[10rem] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="font-medium">{scatterPlot.label}</div>
      <div className="grid gap-1">
        <div className="text-muted-foreground">{scatterPlot.xColumn}</div>
        <div className="font-mono font-medium">{xVal ?? "—"}</div>
        <div className="text-muted-foreground">{scatterPlot.yColumn}</div>
        <div className="font-mono font-medium">{yVal ?? "—"}</div>
        <div className="text-muted-foreground">{scatterPlot.idColumn}</div>
      </div>

      <div className="border-t pt-2">
        {idVal ? (
          <>
            <MiniWidget id={idVal} graph={graphId} />
          </>
        ) : (
          "No id"
        )}
      </div>
    </div>
  );
};
