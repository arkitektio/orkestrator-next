import { useEffect, useState } from "react";
import { DetailTraceFragment } from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, CartesianGrid, XAxis, AreaChart } from "recharts";

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
      setValues(data);
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
          <XAxis dataKey="t" tickLine={false} axisLine={false} tickMargin={8} />
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
