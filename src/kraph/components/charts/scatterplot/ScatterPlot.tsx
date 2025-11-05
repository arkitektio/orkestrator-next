"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ScatterPlotFragment,
  TableFragment,
  useDeleteScatterPlotMutation,
} from "@/kraph/api/graphql";
import * as React from "react";
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import { calculateColumns, calculateRows } from "../../renderers/utils";

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

export default (props: {
  table: TableFragment;
  scatterPlot: ScatterPlotFragment;
}) => {
  const [timeRange, setTimeRange] = React.useState("90d");

  const [del] = useDeleteScatterPlotMutation();

  const columns = calculateColumns(props.table);
  const rows = calculateRows(props.table);

  return (
    <ChartContainer
      config={chartConfig}
      className="h-full w-full"
    >
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey={props.scatterPlot.xColumn}
          name={
            props.table.columns.find(
              (n) => n.name == props.scatterPlot.xColumn,
            )?.name || "No Label"
          }
          unit="µm"
        />
        <YAxis
          type="number"
          dataKey={props.scatterPlot.yColumn}
          name={
            props.table.columns.find(
              (n) => n.name == props.scatterPlot.yColumn,
            )?.name || " No Label"
          }
          unit="µm"
        />
        <ChartTooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name={props.scatterPlot.name} data={rows} fill="#8884d8" />
      </ScatterChart>
    </ChartContainer>
  );
};
