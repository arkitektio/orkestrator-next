"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScatterPlotFragment, TableFragment, useDeleteScatterPlotMutation } from "@/kraph/api/graphql"
import { calculateColumns, calculateRows } from "../../renderers/utils"
import { Button } from "@/components/ui/button"


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
} satisfies ChartConfig

export default (props: {table: TableFragment, scatterPlot: ScatterPlotFragment}) => {
  const [timeRange, setTimeRange] = React.useState("90d")

  const [del] = useDeleteScatterPlotMutation()


  const columns = calculateColumns(props.table);
  const rows = calculateRows(props.table);


  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{props.scatterPlot.name}</CardTitle>
          <CardDescription>
            {props.scatterPlot.description}
          </CardDescription>
        </div>
        <Button variant="destructive" onClick={() => del({variables: {id: props.scatterPlot.id}})}>Delete</Button>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
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
          <XAxis type="number" dataKey={props.scatterPlot.xColumn} name={props.table.columns.find(n => n.name == props.scatterPlot.xColumn)?.name || "No Label" } unit="µm" />
          <YAxis type="number" dataKey={props.scatterPlot.yColumn} name={props.table.columns.find(n => n.name == props.scatterPlot.yColumn)?.name  || " No Label"} unit="µm" />
          <ChartTooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name={props.scatterPlot.name} data={rows} fill="#8884d8" />
        </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
