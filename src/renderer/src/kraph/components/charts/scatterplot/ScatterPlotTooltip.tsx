"use client";

import {
  ChartConfig
} from "@/components/ui/chart";
import {
  ScatterPlotFragment
} from "@/kraph/api/graphql";
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { MiniWidget } from "../MiniWidget";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Top-level exported tooltip component for the scatter plot. Recharts will
// render this component and pass in `active` and `payload` as props; we also
// accept the `scatterPlot` so the tooltip can show the selected column names.
export const ScatterPlotTooltip: React.FC<
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
    scatterPlot: ScatterPlotFragment;
  }
> = ({ active, payload, scatterPlot }) => {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0]?.payload || {};

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
            <MiniWidget id={idVal} graph={scatterPlot.query.graph.ageName} />
          </>
        ) : (
          "No id"
        )}
      </div>
    </div>
  );
};
