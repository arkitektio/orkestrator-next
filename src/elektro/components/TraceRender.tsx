import {
  Card
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { DetailTraceFragment } from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const TraceRender = (props: { trace: DetailTraceFragment }) => {
  const { renderView } = useTraceArray();
  const [values, setValues] = useState<{ [key: string]: number }[]>([]);

  useEffect(() => {
    renderView(props.trace, 0).then((data) => {
      const values = data.map((x, index) => ({ index: index, c: x }));
      setValues(values);
    });
  }, [props.trace]);

  if (!values) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-3">
      <ChartContainer config={chartConfig}>
        <AreaChart
          data={values}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="index" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="c"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
};
